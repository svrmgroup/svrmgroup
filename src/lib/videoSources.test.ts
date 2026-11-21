import { afterEach, describe, expect, it, vi } from "vitest";
import { pickVideoTier, resolveVideoSource } from "./videoSources";

afterEach(() => { vi.unstubAllGlobals(); });

describe("adaptive background videos", () => {
  it("uses the small rendition on a slow connection", () => {
    vi.stubGlobal("navigator", { connection: { effectiveType: "3g" } });
    vi.stubGlobal("window", { innerWidth: 1440, devicePixelRatio: 2 });
    expect(pickVideoTier()).toBe("480");
  });
  it("uses HD on a large screen with a fast connection", () => {
    vi.stubGlobal("navigator", { connection: { effectiveType: "4g", downlink: 10 } });
    vi.stubGlobal("window", { innerWidth: 1280, devicePixelRatio: 1 });
    expect(pickVideoTier()).toBe("720");
  });
  it("keeps high-density phone backgrounds in HD on a normal connection", () => {
    vi.stubGlobal("navigator", { connection: { effectiveType: "4g", downlink: 10 } });
    vi.stubGlobal("window", { innerWidth: 390, devicePixelRatio: 3 });
    expect(pickVideoTier()).toBe("720");
  });
  it("keeps phones in HD when network information is unavailable", () => {
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", { innerWidth: 390, devicePixelRatio: 1 });
    expect(pickVideoTier()).toBe("720");
  });
  it("never downloads the homepage master when a phone rendition exists", () => {
    expect(resolveVideoSource("https://svrm.group/hero-drone.mp4", "480"))
      .toMatch(/hero-drone-480\.mp4$/);
  });
  it("preserves an unknown video", () => {
    expect(resolveVideoSource("/new-video.mp4", "480")).toBe("/new-video.mp4");
  });
});