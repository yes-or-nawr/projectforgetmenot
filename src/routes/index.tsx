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
      {
        name: "description",
        },
      { property: "og:title", content: "Project ForgetMeNot" },
      {
        property: "og:description",
        content:
          "A click-through experience aimed at educating children about NASA's abandoned rovers and landers, and the people who built them. Made for the  NASA Space Apps 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
