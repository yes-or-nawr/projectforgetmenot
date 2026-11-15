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
      { name: "description", content: "A click-through story teaching children about NASA's abandoned rovers and landers, made for NASA Space Apps 2026. AI disclosure: videos and audio are AI-generated and the code was written with AI assistance. Data sourced from NASA, but this is not a NASA website." },
      { property: "og:title", content: "Project ForgetMeNot" },
      {
        property: "og:description",
        content: "A click-through story teaching children about NASA's abandoned rovers and landers, made for NASA Space Apps 2026. AI disclosure: videos and audio are AI-generated and the code was written with AI assistance. Data sourced from NASA, but this is not a NASA website.",
      },
      { name: "ai-disclosure", content: "Video and audio are AI-generated; code was written with AI assistance. Data sourced from NASA, but this is not a NASA website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
