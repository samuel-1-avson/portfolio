// Per-instance abuse protection. On serverless hosts each instance keeps its
// own counters, so this is a baseline; see AI_ASSISTANT_ARCHITECTURE.md for
// moving to a shared store before high-traffic use.

type Window = { count: number; resetAt: number };

export type RateLimitDecision = { allowed: boolean; remaining: number; resetAt: number; reason?: "minute" | "daily" };

export class RateLimiter {
  private readonly windows = new Map<string, Window>();
  private dailyCount = 0;
  private dailyDate = "";
  private readonly perMinute: number;
  private readonly perDay: number;
  private readonly now: () => number;

  // Plain constructor assignments (no parameter properties) so node --experimental-strip-types can run the tests.
  constructor(perMinute: number, perDay: number, now: () => number = Date.now) {
    this.perMinute = perMinute;
    this.perDay = perDay;
    this.now = now;
  }

  check(clientId: string): RateLimitDecision {
    const now = this.now();
    const today = new Date(now).toISOString().slice(0, 10);
    if (today !== this.dailyDate) {
      this.dailyDate = today;
      this.dailyCount = 0;
    }

    if (this.windows.size > 5_000) {
      for (const [key, window] of this.windows) if (window.resetAt <= now) this.windows.delete(key);
    }

    const current = this.windows.get(clientId);
    const window = !current || current.resetAt <= now ? { count: 0, resetAt: now + 60_000 } : current;

    if (window.count >= this.perMinute) {
      this.windows.set(clientId, window);
      return { allowed: false, remaining: 0, resetAt: window.resetAt, reason: "minute" };
    }
    if (this.dailyCount >= this.perDay) {
      return { allowed: false, remaining: 0, resetAt: window.resetAt, reason: "daily" };
    }

    window.count += 1;
    this.windows.set(clientId, window);
    return { allowed: true, remaining: this.perMinute - window.count, resetAt: window.resetAt };
  }

  /** Model calls consume the daily budget; deterministic answers do not. */
  consumeDailyBudget() {
    this.dailyCount += 1;
  }

  get dailyUsed() {
    return this.dailyCount;
  }
}

export function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}
