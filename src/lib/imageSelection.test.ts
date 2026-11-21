import { describe, expect, it } from "vitest";
import { selectImageSource } from "./imageSelection";

const registry = {
  "/__l5e/photo.jpg": [
    { src: "/photo-640.webp", width: 640 },
    { src: "/photo-1280.webp", width: 1280 },
  ],
};

describe("responsive image selection", () => {
  it("offers small and large display copies without changing the source", () => {
    expect(selectImageSource("/__l5e/photo.jpg", registry)).toEqual({
      src: "/photo-1280.webp",
      srcSet: "/photo-640.webp 640w, /photo-1280.webp 1280w",
    });
  });
  it("resolves absolute CMS CDN links to the same copies", () => {
    expect(selectImageSource("https://svrm.group/__l5e/photo.jpg", registry).src)
      .toBe("/photo-1280.webp");
  });
  it("retains the full-size original for expanded viewing", () => {
    expect(selectImageSource("/__l5e/photo.jpg", registry, true))
      .toEqual({ src: "/__l5e/photo.jpg", srcSet: undefined });
  });
  it("leaves new and unknown CMS uploads untouched", () => {
    expect(selectImageSource("https://example.com/new.jpg", registry))
      .toEqual({ src: "https://example.com/new.jpg", srcSet: undefined });
  });
});