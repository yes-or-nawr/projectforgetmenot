import { createFileRoute } from "@tanstack/react-router";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { PlayerNameProvider } from "@/components/story/PlayerName";
function Home() {
  return (
    <PlayerNameProvider>
      <StoryPlayer />
    </PlayerNameProvider>
  );
}
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project ForgetMeNot" },
      { name: "description", content: "A click-through story teaching children about NASA's abandoned rovers and landers, made for NASA Space Apps 2026. AI disclosure: videos, audio, and parts of the code and content were made with the help of AI and checked against official NASA sources." },
      { property: "og:title", content: "Project ForgetMeNot" },
      {
        property: "og:description",
        content: "A click-through story teaching children about NASA's abandoned rovers and landers, made for NASA Space Apps 2026. AI disclosure: videos, audio, and parts of the code and content were made with the help of AI and checked against official NASA sources.",
      },
      { name: "ai-disclosure", content: "Video and audio are AI-generated; code and data were written with AI assistance. Archive facts come from official NASA sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
