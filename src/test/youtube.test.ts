import { describe, expect, it } from "vitest";
import { youtubeId } from "@/lib/youtube";

describe("youtubeId", () => {
  it("reads the Ingenuity short link", () => {
    expect(youtubeId("https://youtu.be/45mOijC1foY")).toBe("45mOijC1foY");
  });
  it("reads a full watch link", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=45mOijC1foY&t=3s")).toBe("45mOijC1foY");
  });
  it("reads shorts and embed links", () => {
    expect(youtubeId("https://youtube.com/shorts/45mOijC1foY")).toBe("45mOijC1foY");
    expect(youtubeId("https://www.youtube.com/embed/45mOijC1foY")).toBe("45mOijC1foY");
  });
  it("ignores uploaded clips", () => {
    expect(youtubeId("/media/scene-1.mp4")).toBeNull();
  });
});
