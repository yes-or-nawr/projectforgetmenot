/**
 * The script of "The Memory Cube".
 *
 * To add a finished clip: drop the video in, then set `video` on its scene
 * (and optionally `poster`). Scenes without a `video` show a styled placeholder
 * with the scene direction, so the story reads end-to-end before clips exist.
 */

export type Line = { speaker: "Girl" | "Mom" | "Narrator" | "InSight"; text: string };

export type VideoScene = {
  kind: "video";
  id: string;
  number: number;
  title: string;
  /** What happens on screen — shown on the placeholder until the clip exists. */
  direction: string;
  /** Subtitles shown under the clip. Edit to match the final voice-over. */
  lines: Line[];
  video?: string;
  poster?: string;
  /** Renders the clip inside the cube's holographic projection. */
  hologram?: boolean;
};

export type TextScene = {
  kind: "text";
  id: string;
  eyebrow: string;
  paragraphs: string[];
};

export type FlipbookScene = {
  kind: "flipbook";
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
};

export type Scene = VideoScene | TextScene | FlipbookScene;

export const story: Scene[] = [
  {
    kind: "video",
    id: "garage",
    number: 1,
    title: "The garage",
    direction: "A little girl dusts shelves in a sun-striped garage. Dust drifts through the light.",
    lines: [],
  },
  {
    kind: "text",
    id: "dust",
    eyebrow: "Saturday morning",
    paragraphs: [
      "Nobody had cleaned the garage in years. Dust covered everything: the boxes, the old bicycle, the things nobody remembered.",
      "Dust settles on everything we forget. Sometimes it settles on things that once mattered very much.",
      "This is where our story begins.",
    ],
  },
  {
    kind: "video",
    id: "cube",
    number: 2,
    title: "The cube",
    direction:
      "Behind a box she finds a small metal cube with a single glowing button. She presses it. Light pours out and a hologram opens above the cube. She sets it down and watches.",
    lines: [],
  },
  {
    kind: "video",
    id: "insight",
    number: 3,
    title: "A lander called InSight",
    direction:
      "On the hologram: NASA's InSight lander on Mars. Each day, red dust settles on its solar panels. Its power fades until it can no longer talk to Earth.",
    hologram: true,
    lines: [
      { speaker: "Narrator", text: "In November 2018, a lander named InSight touched down on Mars to listen to the planet's heartbeat." },
      { speaker: "Narrator", text: "Its seismometer felt more than 1,300 marsquakes. But every day, a little more dust settled on its solar panels." },
      { speaker: "InSight", text: "My power's really low, so this may be the last image I can send." },
      { speaker: "Narrator", text: "On December 15, 2022, InSight sent its last message home." },
    ],
  },
  {
    kind: "video",
    id: "tears",
    number: 4,
    title: "Tears",
    direction: "Close on the girl's face, lit blue by the hologram. Her eyes fill with tears.",
    lines: [],
  },
  {
    kind: "video",
    id: "mom",
    number: 5,
    title: "Mom",
    direction: "Mom steps into the garage and sees what her daughter is watching. She smiles softly.",
    lines: [{ speaker: "Mom", text: "Oh, you're watching this? I was part of that team." }],
  },
  {
    kind: "video",
    id: "why",
    number: 6,
    title: "Why?",
    direction: "The girl turns to her mom, still teary.",
    lines: [{ speaker: "Girl", text: "Why couldn't you save it?" }],
  },
  {
    kind: "video",
    id: "remember",
    number: 7,
    title: "How we remember",
    direction:
      "Mom kneels beside her and explains: there was no way to brush the dust off from millions of kilometers away. NASA honors these machines and keeps a record of all of them so they're never forgotten.",
    lines: [
      { speaker: "Mom", text: "Mars is very far away, sweetheart. Nobody could go there and brush the dust off its panels." },
      { speaker: "Mom", text: "But NASA doesn't forget its explorers. There's a whole record of the machines we left behind, so we can remember them." },
    ],
  },
  {
    kind: "video",
    id: "archive",
    number: 8,
    title: "Into the archive",
    direction:
      "The girl wipes her eyes and asks to see the other machines. Mom opens the NASA archive on the hologram.",
    lines: [
      { speaker: "Girl", text: "Then I want to know about all of them. They show how hard the engineers worked." },
      { speaker: "Mom", text: "Let's look together." },
    ],
  },
  {
    kind: "flipbook",
    id: "flipbook",
    eyebrow: "The archive",
    title: "Abandoned, but not forgotten",
    intro:
      "Each page is one machine we left on the Moon or Mars, put together from official NASA sources. Turn the pages the way she did.",
  },
  {
    kind: "video",
    id: "dream",
    number: 9,
    title: "When I grow up",
    direction:
      "The girl looks up at her mom with shining eyes. Mom hugs her. The hologram glows between them as the scene fades out.",
    lines: [
      {
        speaker: "Girl",
        text: "Wow, Mom. I want to grow up and build these too. And make them so good they can come home with their memories, so everyone can see them just like I did.",
      },
      { speaker: "Mom", text: "Sure, honey." },
    ],
  },
];

/** Closing words from the creator, shown after the final scene. */
export const endingNotes = {
  title: "A note from the creator",
  paragraphs: [
    "Placeholder: replace this with your own ending notes. Say why you chose this story, what the abandoned machines mean to you, and who you made it for.",
  ],
  signature: "— Team name",
};
