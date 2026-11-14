import ambientTrack from "@/assets/media/initial-ambient.mp3.asset.json";

/**
 * The script of "The Memory Cube", in the order it plays.
 * Edit the text here; the player renders whatever this file says.
 * Space / Enter / click moves on. Inside a letter, the same inputs scroll the
 * page first; inside the archive they turn pages; inside the quiz they move
 * to the next question once one is answered.
 */

export type VideoScene = {
  kind: "video";
  id: string;
  /** Read out by screen readers only; nothing is written on screen. */
  description: string;
  video?: string;
  poster?: string;
  /** Plays inside the cube's holographic frame. */
  hologram?: boolean;
  /** Plays the soundtrack from the first clip quietly underneath. */
  ambient?: boolean;
};

export type LetterScene = {
  kind: "letter";
  id: string;
  /** Small line at the top right, e.g. a place and date. */
  dateline?: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  /** Initials pressed into the wax seal. */
  seal: string;
};

export type FlipbookScene = {
  kind: "flipbook";
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index into `options` of the right answer (0 = first). */
  answer: number;
  /** Shown after the viewer picks an option. */
  explanation?: string;
};

export type QuizScene = {
  kind: "quiz";
  id: string;
  /** The pop-up shown before the quiz starts. */
  prompt: { title: string; body: string; yes: string; no: string };
  questions: QuizQuestion[];
};

export type Scene = VideoScene | LetterScene | FlipbookScene | QuizScene;

/** Soundtrack lifted from the first clip; plays under scenes marked `ambient`. */
export const ambientAudio: string = ambientTrack.url;

export const story: Scene[] = [
  {
    kind: "video",
    id: "initial",
    description: "...",
    video: "/media/initial.mp4",
  },
  {
    kind: "letter",
    id: "letter-1",
    dateline: "",
    salutation: "Dear {name},",
    paragraphs: [
      "You have lucked out!",
      "You now have the opportunity to be part of the next big history.",
      "Before I tell you any further, you should check out the cube sent as well. Look at it in a darkened room for better viewing experience.",
      "Best of luck!",
    ],
    closing: "With hope,",
    signature: "Traveller",
    seal: "T",
  },
  {
    kind: "video",
    id: "scene-1",
    description: "...",
    video: "/media/scene-1.mp4",
    ambient: true,
  },
  {
    kind: "video",
    id: "ingenuity",
    description: "Ingenuity infogram",
    video: "https://youtu.be/45mOijC1foY"
    hologram: true,
  },
  {
    kind: "video",
    id: "scene-3",
    description: "...",
    video: "/media/scene-3.mp4",
    ambient: true,
  },
  {
    kind: "letter",
    id: "letter-2",
    dateline: "",
    salutation: "Dear {name},",
    paragraphs: [
      "If you are reading this, you have met me, Ingenuity. I flew over the Martial lands for three years, exceeding all expectations. I was NASA's beloved Ginny.",
      "I still wake up today, logging in information to my system. Waiting. But alas! Not many people know of me today.",
      "And it is not just me. So many of my kins are alone in the vast space, lost, injured, or dead. But what hurts the most is being forgotten.",
      "So, {name}, if you would, I want you to remember me. And my kins. And perhaps, one day come and meet me.",
    ],
    closing: "Waiting,",
    signature: "Ginny",
    seal: "G",
  },
  {
    kind: "flipbook",
    id: "flipbook",
    eyebrow: "",
    title: "The Abandoned Archive",
    intro: "Remembering Ingenuity and the other abandoned equipments",
  },
  {
    kind: "quiz",
    id: "quiz",
    prompt: {
      title: "Would you like to challenge yourself?",
      body: "Five quick questions about the machines you just met.",
      yes: "Yes, let's go",
      no: "No, thanks",
    },
    // Draft questions taken from the archive pages. Replace them with your own.
    questions: [
      {
        question: "Which machine was visited by Apollo 12 astronauts on the Moon?",
        options: ["Surveyor 3", "Viking 1", "Phoenix", "Spirit"],
        answer: 0,
        explanation: "Pete Conrad and Alan Bean walked over to Surveyor 3 and brought parts of it back to Earth.",
      },
      {
        question: "Opportunity was built to work for 90 Martian days. How long did it actually last?",
        options: ["About 6 months", "Nearly 15 years", "2 years", "90 days exactly"],
        answer: 1,
        explanation: "Opportunity kept driving for nearly 15 years, until a planet-wide dust storm in 2018.",
      },
      {
        question: "What did InSight listen for on Mars?",
        options: ["Radio signals from aliens", "Wind on the poles", "Marsquakes", "Rain"],
        answer: 2,
        explanation: "Its seismometer felt more than 1,300 marsquakes: the heartbeat of Mars.",
      },
      {
        question: "What made Ingenuity famous?",
        options: [
          "It drilled the deepest hole on Mars",
          "It was the first aircraft to fly on another planet",
          "It found liquid water",
          "It returned to Earth",
        ],
        answer: 1,
        explanation: "Ingenuity was planned for up to 5 flights and made 72.",
      },
      {
        question: "What does the mirror left by Apollo 11 tell us?",
        options: [
          "The Moon is slowly drifting away from Earth",
          "The Moon is getting hotter",
          "The Moon has an ocean",
          "The Moon is spinning faster",
        ],
        answer: 0,
        explanation: "Laser pulses bounced off it show the Moon moves about 3.8 centimeters farther away each year.",
      },
    ],
  },
];

/** Closing words from the creator, shown after the quiz. */
export const endingNotes = {
  title: "",
  paragraphs: [
    "Spirit, Opportunity and many other explorers and the people behind them have given their all in the quest of knowing the space.",
    "Ingenuity is waiting for the next rover or explorer to take over. The baton must be passed.",
    "Wouldn't you like to be part of the journey?"
  ],
  signature: "",
};
