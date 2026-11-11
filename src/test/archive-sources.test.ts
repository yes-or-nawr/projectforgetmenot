import { describe, expect, it } from "vitest";
import { artifacts } from "@/content/artifacts";

// Every archive page must be built from official NASA sources.
describe("Archive pages", () => {
  it("cite only official NASA websites", () => {
    for (const a of artifacts) {
      expect(a.sources.length, a.name).toBeGreaterThan(0);
      for (const s of a.sources) {
        const host = new URL(s.url).hostname;
        expect(host === "nasa.gov" || host.endsWith(".nasa.gov"), `${a.name}: ${s.url}`).toBe(true);
      }
    }
  });

  it("use photos from the NASA image library", () => {
    for (const a of artifacts) {
      expect(new URL(a.image.src).hostname, a.name).toBe("images-assets.nasa.gov");
    }
  });
});
