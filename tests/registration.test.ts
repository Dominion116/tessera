import { describe, expect, it } from "vitest";
import {
  dateInputToUnix,
  fieldError,
  FIELD_RULES,
  parseAllowlistRoot,
  registrationFlags,
  utf8Bytes,
} from "@/lib/registration";

describe("registration input rules", () => {
  it("counts UTF-8 bytes rather than JavaScript characters", () => {
    expect(utf8Bytes("é🚀")).toBe(6);
  });

  it("rejects JSON-unsafe metadata characters", () => {
    expect(fieldError('Night "one"', FIELD_RULES.name)).toContain("double quote");
    expect(fieldError("Line\nTwo", FIELD_RULES.description)).toContain("line break");
  });

  it("converts valid UTC dates and rejects malformed dates", () => {
    expect(dateInputToUnix("2026-01-01")).toBe(1_767_225_600n);
    expect(dateInputToUnix("not-a-date")).toBe(0n);
  });

  it("packs soulbound and public flags", () => {
    expect(registrationFlags(false, false)).toBe(0);
    expect(registrationFlags(true, false)).toBe(1);
    expect(registrationFlags(false, true)).toBe(2);
    expect(registrationFlags(true, true)).toBe(3);
  });

  it("accepts only a 32-byte allowlist root", () => {
    const root = `0x${"ab".repeat(32)}` as const;
    expect(parseAllowlistRoot(root)).toBe(root);
    expect(parseAllowlistRoot("0x1234")).toBeNull();
  });
});
