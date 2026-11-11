import { createFileRoute } from "@tanstack/react-router";
import { StoryPlayer } from "@/components/story/StoryPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Memory Cube: a story of NASA machines left on the Moon, Mars and beyond" },
      {
        name: "description",
        content:
          "A girl finds a glowing cube in the garage and learns the story of InSight and the other NASA explorers left behind on the Moon and Mars.",
      },
      { property: "og:title", content: "The Memory Cube" },
      {
        property: "og:description",
        content:
          "A click-through story about NASA's abandoned rovers and landers, and the people who built them. NASA Space Apps 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPlayer,
});
