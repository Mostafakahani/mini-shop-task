import { describe, it, expect, vi } from "vitest";
import { NextResponse } from "next/server";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data) => ({ json: () => data })),
  },
}));

describe("Checkout API Simple", () => {
  it("should be a simple test", () => {
    expect(true).toBe(true);
  });
});
