import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/og/OgCard";
import { profile } from "@/content";

export const alt = `${profile.name} — ${profile.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgCard eyebrow={profile.role} title={profile.shortName} subtitle={profile.headline} footer="Payments · Security · AI" />, size);
}
