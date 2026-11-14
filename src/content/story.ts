video: "/media/initial.mp4",
video: "/media/scene 2.mp4",
video: "/media/scene 3.mp4",
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

/** Soundtrack lifted from the first clip; loops under scenes marked `ambient`. */
export const ambientAudio = ambientTrack.url;

export const story: Scene[] = [
  {
    kind: "video",
    id: "initial",
    description: "A little girl walks to the red mailbox outside her house and finds a letter inside.",
    video: initialClip.url,
  },
  {
    kind: "letter",
    id: "letter-1",
    dateline: "Delivered by hand",
    salutation: "Dear {name},",
    paragraphs: [
      "Waiting for you indoors is a small cube. Please handle it gently. It holds the memories of machines that travelled farther from home than any of us ever will.",
      "They were built by people who stayed up through long nights, tested every bolt twice, and cheered in quiet control rooms when a faint signal arrived from another world.",
      "Some of those machines landed on the Moon. Some crossed the red dust of Mars. Almost none of them ever came home.",
      "When you are ready, press the button on the cube and let them tell you their story.",
    ],
    closing: "With respect and hope,",
    signature: "Ginny",
    seal: "G",
  },
  {
    kind: "video",
    id: "scene-2",
    description: "The girl carries the letter inside to her bedroom, finds the glowing cube and presses its button. A hologram opens in the air.",
    video: scene2Clip.url,
    ambient: true,
  },
  {
    kind: "video",
    id: "insight",
    description:
      "On the hologram: NASA's InSight lander on Mars. Each day, red dust settles on its solar panels, and its power fades until it can no longer talk to Earth.",
    hologram: true,
    ambient: true,
  },
  {
    kind: "video",
    id: "scene-3",
    description: "The girl sets the cube on her nightstand, sits on her bed and reads the letter again.",
    video: scene3Clip.url,
    ambient: true,
  },
  {
    kind: "letter",
    id: "letter-2",
    dateline: "A second page, folded inside the first",
    salutation: "{name},",
    paragraphs: [
      "If you are reading this, you have met InSight. It listened to the heartbeat of Mars for four years, until the dust grew too thick for its solar panels to wake it.",
      "InSight is not alone. On the Moon and on Mars, other machines still stand exactly where they stopped, keeping silent watch over the places they explored.",
      "The pages that follow hold one machine each, written from NASA's own records. Turn them slowly. Every one of them was somebody's life's work.",
      "They were abandoned, but they do not have to be forgotten.",
    ],
    closing: "Waiting,",
    signature: "Ginny",
    seal: "G",
  },
  {
    kind: "flipbook",
    id: "flipbook",
    eyebrow: "The archive",
    title: "Abandoned, but not forgotten",
    intro: "One page for each machine we left on the Moon and Mars, put together from official NASA sources.",
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
  title: "A note from the creator",
  paragraphs: [
    "Placeholder: replace this with your own ending notes. Say why you chose this story, what the abandoned machines mean to you, and who you made it for.",
  ],
  signature: "— Team name",
};
