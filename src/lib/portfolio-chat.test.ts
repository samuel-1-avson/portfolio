import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPortfolioFallback,
  getSuggestedActions,
  MAX_CHAT_MESSAGE_LENGTH,
  validateChatMessage,
} from "./portfolio-chat.ts";

describe("portfolio chat validation", () => {
  it("normalizes valid visitor messages", () => {
    assert.deepEqual(validateChatMessage("  Tell   me about Samuel  "), {
      ok: true,
      message: "Tell me about Samuel",
    });
  });

  it("rejects absent and overlong messages", () => {
    assert.deepEqual(validateChatMessage(undefined), {
      ok: false,
      status: 400,
      error: "Message must be a string.",
    });
    assert.deepEqual(validateChatMessage("x".repeat(MAX_CHAT_MESSAGE_LENGTH + 1)), {
      ok: false,
      status: 413,
      error: `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.`,
    });
  });
});

describe("portfolio chat fallback", () => {
  it("provides a usable contact answer without an AI provider", () => {
    assert.match(getPortfolioFallback("How can I contact Samuel?"), /samuelavson360@gmail.com/);
  });

  it("limits generic responses to portfolio guidance", () => {
    assert.match(getPortfolioFallback("What is the weather like tomorrow?"), /background/);
  });

  it("greets visitors instead of showing a generic error-style answer", () => {
    assert.match(getPortfolioFallback("hi"), /portfolio assistant/i);
    assert.doesNotMatch(getPortfolioFallback("hi"), /temporarily unavailable/i);
  });
});

describe("portfolio assistant actions", () => {
  it("links contact and project questions to appropriate next steps", () => {
    assert.deepEqual(getSuggestedActions("How can I contact Samuel?").map((action) => action.label), ["Email Samuel", "Open LinkedIn"]);
    assert.deepEqual(getSuggestedActions("Show me projects").map((action) => action.href), ["#projects", "https://github.com/samuel-1-avson"]);
  });
});
