/**
 * Pages of the NASA archive flipbook — one machine per page.
 * Every fact is drawn from official NASA sources listed in `sources`;
 * images are public-domain NASA photos from images.nasa.gov.
 * Re-check numbers against the sources before presenting.
 */

export type Source = { label: string; url: string };

export type Artifact = {
  id: string;
  name: string;
  kind: string;
  world: "Moon" | "Mars";
  resting: string;
  arrived: string;
  lastHeard: string;
  plannedLife: string;
  actualLife: string;
  image: { src: string; alt: string; credit: string; nasaId: string };
  /** One-line hook shown big on the page. */
  hook: string;
  builtTo: string;
  discovered: string;
  ending: string;
  /** Honoring the people behind it. */
  engineers: string;
  /** A small detail kids remember. */
  didYouKnow: string;
  sources: Source[];
};

const img = (id: string, size: "medium" | "orig" = "medium") =>
  `https://images-assets.nasa.gov/image/${id}/${id}~${size}.jpg`;

const details = (id: string): Source => ({
  label: `NASA Image Library: ${id}`,
  url: `https://images.nasa.gov/details/${id}`,
});

export const artifacts: Artifact[] = [
  {
    id: "surveyor-3",
    name: "Surveyor 3",
    kind: "Robotic lander",
    world: "Moon",
    resting: "Ocean of Storms (Oceanus Procellarum)",
    arrived: "April 20, 1967",
    lastHeard: "May 4, 1967",
    plannedLife: "One lunar day",
    actualLife: "About two weeks",
    image: {
      src: img("AS12-48-7133"),
      alt: "Apollo 12 astronaut Pete Conrad standing beside the Surveyor 3 lander on the Moon, with the lunar module in the distance",
      credit: "NASA / Apollo 12",
      nasaId: "AS12-48-7133",
    },
    hook: "The lander that got a visit from astronauts.",
    builtTo:
      "Find out whether the Moon's ground was firm enough for astronauts to land on. It dug little trenches with a scoop to test the soil.",
    discovered:
      "The lunar soil could hold a spacecraft's weight, which gave Apollo engineers the go-ahead. It also sent home thousands of photos of the surface.",
    ending:
      "When the long, freezing lunar night came, Surveyor 3 went quiet. Two and a half years later, Apollo 12 landed close by, and astronauts Pete Conrad and Alan Bean walked over to it.",
    engineers:
      "They took its TV camera and other parts back to Earth so engineers could study how materials hold up after years on the Moon.",
    didYouKnow: "Its engines didn't shut off in time, so Surveyor 3 bounced on the Moon before it settled.",
    sources: [
      { label: "NASA Science: Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
      { label: "NASA: Apollo 12", url: "https://www.nasa.gov/mission/apollo-12/" },
      details("AS12-48-7133"),
    ],
  },
  {
    id: "apollo-11-easep",
    name: "Apollo 11 Science Station",
    kind: "Seismometer & laser reflector",
    world: "Moon",
    resting: "Sea of Tranquility, beside Tranquility Base",
    arrived: "July 20, 1969",
    lastHeard: "Seismometer: August 1969 (reflector still in use)",
    plannedLife: "Weeks to months",
    actualLife: "Reflector: 55+ years and counting",
    image: {
      src: img("as11-40-5951"),
      alt: "Buzz Aldrin setting up the Passive Seismic Experiment package on the lunar surface during Apollo 11",
      credit: "NASA / Apollo 11",
      nasaId: "as11-40-5951",
    },
    hook: "A mirror on the Moon that still answers back.",
    builtTo:
      "Listen for moonquakes and meteorite impacts with a seismometer, and give scientists on Earth a mirror to bounce lasers off.",
    discovered:
      "Laser pulses bounced off the reflector show that the Moon is slowly drifting away from Earth, about 3.8 centimeters a year.",
    ending:
      "The solar-powered seismometer stopped responding to commands about three weeks after the astronauts left. The laser reflector needs no power, and observatories still aim at it today.",
    engineers:
      "Buzz Aldrin set it up by hand in his bulky, stiff spacesuit, a short walk from the lunar module Eagle.",
    didYouKnow:
      "A plaque left on the lander's leg reads: \"We came in peace for all mankind.\"",
    sources: [
      { label: "NASA: Apollo 11", url: "https://www.nasa.gov/mission/apollo-11/" },
      details("as11-40-5951"),
    ],
  },
  {
    id: "apollo-15-lrv",
    name: "Lunar Roving Vehicle",
    kind: "Crewed electric rover",
    world: "Moon",
    resting: "Hadley–Apennine region",
    arrived: "July 30, 1971",
    lastHeard: "August 2, 1971",
    plannedLife: "Three moonwalks",
    actualLife: "Three moonwalks, about 28 km driven",
    image: {
      src: img("as15-86-11603"),
      alt: "Astronaut James Irwin working beside the Lunar Roving Vehicle with Mount Hadley behind",
      credit: "NASA / Apollo 15",
      nasaId: "as15-86-11603",
    },
    hook: "The first car ever driven on another world.",
    builtTo:
      "Let astronauts travel much farther from their lander, carrying tools, cameras, and the rocks they collected.",
    discovered:
      "Dave Scott and Jim Irwin could explore the edge of Hadley Rille and the foothills of the Apennine Mountains, places too far to reach on foot.",
    ending:
      "When the crew went home, the rover stayed parked on the Moon. Two more rovers followed on Apollo 16 and 17, and all three are still there.",
    engineers:
      "It folded up like origami to fit on the side of the lunar module. Its wheels were made of woven wire mesh because rubber tires wouldn't survive the Moon.",
    didYouKnow: "Each of its four wheels had its own electric motor, powered by batteries.",
    sources: [
      { label: "NASA: Apollo 15", url: "https://www.nasa.gov/mission/apollo-15/" },
      details("as15-86-11603"),
    ],
  },
  {
    id: "viking-1",
    name: "Viking 1 Lander",
    kind: "Robotic lander",
    world: "Mars",
    resting: "Chryse Planitia",
    arrived: "July 20, 1976",
    lastHeard: "November 1982",
    plannedLife: "90 days",
    actualLife: "More than 6 years",
    image: {
      src: img("PIA00563", "orig"),
      alt: "The first color photograph from the surface of Mars, showing an orange rocky plain under a pale sky",
      credit: "NASA/JPL",
      nasaId: "PIA00563",
    },
    hook: "America's first safe landing on Mars.",
    builtTo:
      "Take the first pictures from the Martian surface and run experiments to look for signs of life in the soil.",
    discovered:
      "It showed a rocky, rust-colored desert under a pinkish sky, and spent years reporting Mars weather. Its life-detection results are still debated.",
    ending:
      "In 1982 a command sent from Earth accidentally overwrote the software that pointed its antenna home. After that, Earth never heard from it again.",
    engineers:
      "It was built to work for 90 days and kept going for six years. NASA renamed it the Thomas A. Mutch Memorial Station after a scientist on the team.",
    didYouKnow: "It landed exactly seven years after Apollo 11 touched down on the Moon.",
    sources: [
      { label: "NASA Science: Viking 1", url: "https://science.nasa.gov/mission/viking-1/" },
      details("PIA00563"),
    ],
  },
  {
    id: "sojourner",
    name: "Sojourner & Pathfinder",
    kind: "First Mars rover + lander",
    world: "Mars",
    resting: "Ares Vallis",
    arrived: "July 4, 1997",
    lastHeard: "September 27, 1997",
    plannedLife: "Rover: 7 days",
    actualLife: "83 days",
    image: {
      src: img("PIA01551", "orig"),
      alt: "The small Sojourner rover on Martian soil next to the Pathfinder lander's deflated airbags",
      credit: "NASA/JPL",
      nasaId: "PIA01551",
    },
    hook: "The first wheels to roll on Mars.",
    builtTo:
      "Prove that a cheap lander could bounce down on airbags and that a tiny rover could drive around and study rocks.",
    discovered:
      "Sojourner studied rocks with names like Barnacle Bill and Yogi and found clues that Mars may once have been warmer and wetter.",
    ending:
      "The lander's battery wore out and its transmissions stopped. Sojourner probably kept circling nearby, waiting for messages that never came.",
    engineers:
      "The rover was about the size of a microwave oven. Its success led to every Mars rover since. The lander was renamed the Carl Sagan Memorial Station.",
    didYouKnow: "Pathfinder landed by bouncing across Mars inside giant airbags, like a beach ball.",
    sources: [
      { label: "NASA Science: Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
      details("PIA01551"),
    ],
  },
  {
    id: "spirit",
    name: "Spirit",
    kind: "Mars Exploration Rover",
    world: "Mars",
    resting: "Gusev Crater, near Home Plate",
    arrived: "January 4, 2004",
    lastHeard: "March 22, 2010",
    plannedLife: "90 Martian days",
    actualLife: "More than 6 years",
    image: {
      src: img("PIA07371"),
      alt: "Self-portrait mosaic of the Spirit rover's dusty deck and solar panels seen from above",
      credit: "NASA/JPL/Cornell",
      nasaId: "PIA07371",
    },
    hook: "The rover that made a discovery with a broken wheel.",
    builtTo: "Search for rocks and soils that would show whether water once shaped Gusev Crater.",
    discovered:
      "After a front wheel stopped turning, Spirit drove backward, dragging it. The stuck wheel scraped up bright, nearly pure silica, a sign of ancient hot springs or steam vents.",
    ending:
      "In 2009 Spirit got stuck in soft sand. It couldn't tilt its solar panels toward the winter Sun, and it went silent in March 2010.",
    engineers:
      "For months, engineers on Earth tested escape moves with a twin rover in a sandbox before they finally said goodbye in 2011.",
    didYouKnow: "Spirit was built for 90 days and worked for over six years.",
    sources: [
      { label: "NASA Science: Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" },
      details("PIA07371"),
    ],
  },
  {
    id: "opportunity",
    name: "Opportunity",
    kind: "Mars Exploration Rover",
    world: "Mars",
    resting: "Perseverance Valley, Endeavour Crater",
    arrived: "January 25, 2004",
    lastHeard: "June 10, 2018",
    plannedLife: "90 Martian days",
    actualLife: "Nearly 15 years",
    image: {
      src: img("PIA17759"),
      alt: "Self-portrait of the Opportunity rover, its solar panels coated in reddish dust",
      credit: "NASA/JPL-Caltech/Cornell/Arizona State Univ.",
      nasaId: "PIA17759",
    },
    hook: "It ran a marathon on Mars.",
    builtTo: "Find out whether liquid water ever flowed on the plains of Meridiani Planum.",
    discovered:
      "Tiny round grains nicknamed \"blueberries\" and other rocks showed that water once soaked this part of Mars.",
    ending:
      "In 2018 a dust storm wrapped the whole planet and blocked the Sun from its solar panels. NASA sent more than a thousand wake-up calls before saying goodbye in February 2019.",
    engineers:
      "It drove more than 45 kilometers, longer than a marathon. The team picked a wake-up song each Martian morning. The last one they played for it was \"I'll Be Seeing You.\"",
    didYouKnow:
      "\"My battery is low and it's getting dark\" was a reporter's poetic summary of its last data, not a real message, but it captured how people felt.",
    sources: [
      { label: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
      details("PIA17759"),
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    kind: "Polar lander",
    world: "Mars",
    resting: "Vastitas Borealis, Martian arctic",
    arrived: "May 25, 2008",
    lastHeard: "November 2, 2008",
    plannedLife: "90 Martian days",
    actualLife: "About 5 months",
    image: {
      src: img("PIA10793"),
      alt: "Phoenix lander's solar panel and robotic arm against the flat Martian arctic plain",
      credit: "NASA/JPL-Caltech/University of Arizona/Texas A&M University",
      nasaId: "PIA10793",
    },
    hook: "It touched water ice on Mars.",
    builtTo: "Dig into the frozen ground near Mars' north pole and check whether it could ever have supported life.",
    discovered:
      "Its scoop exposed bright chunks of water ice that slowly disappeared in sunlight. It also watched snow falling from Martian clouds.",
    ending:
      "As arctic winter came, the Sun sank and Phoenix lost power. Later photos from orbit showed a solar panel broken, probably by the weight of carbon dioxide frost.",
    engineers:
      "It was named after the mythical bird because it was partly built from hardware of earlier missions that had been cancelled.",
    didYouKnow: "The snow it saw evaporated before it reached the ground.",
    sources: [
      { label: "NASA Science: Phoenix", url: "https://science.nasa.gov/mission/phoenix/" },
      details("PIA10793"),
    ],
  },
  {
    id: "insight",
    name: "InSight",
    kind: "Geophysics lander",
    world: "Mars",
    resting: "Elysium Planitia",
    arrived: "November 26, 2018",
    lastHeard: "December 15, 2022",
    plannedLife: "About 2 Earth years",
    actualLife: "4 years",
    image: {
      src: img("PIA25287"),
      alt: "InSight's final selfie, its solar panels heavily covered in red Martian dust",
      credit: "NASA/JPL-Caltech",
      nasaId: "PIA25287",
    },
    hook: "It listened to the heartbeat of Mars.",
    builtTo: "Study the inside of Mars (its crust, mantle, and core) by feeling marsquakes and measuring how the planet wobbles.",
    discovered:
      "Its seismometer detected 1,319 marsquakes, enough to work out how thick the Martian crust is and how big the core is.",
    ending:
      "Dust built up on its solar panels until there was too little power to stay awake. Its last message came on December 15, 2022.",
    engineers:
      "Its heat probe, \"the mole,\" was meant to dig 5 meters down. The soil clumped, so engineers spent nearly two years trying clever fixes from Earth.",
    didYouKnow: "This is the mission the girl's mom worked on.",
    sources: [
      { label: "NASA Science: InSight", url: "https://science.nasa.gov/mission/insight/" },
      details("PIA25287"),
    ],
  },
  {
    id: "ingenuity",
    name: "Ingenuity",
    kind: "Mars helicopter",
    world: "Mars",
    resting: "Jezero Crater, \"Valinor Hills\"",
    arrived: "February 18, 2021",
    lastHeard: "Final flight January 18, 2024",
    plannedLife: "Up to 5 flights in 30 days",
    actualLife: "72 flights over nearly 3 years",
    image: {
      src: img("PIA25881"),
      alt: "The small Ingenuity helicopter standing on rocky Martian ground, photographed by Perseverance",
      credit: "NASA/JPL-Caltech/ASU/MSSS",
      nasaId: "PIA25881",
    },
    hook: "The first aircraft to fly on another planet.",
    builtTo: "Prove that powered, controlled flight is possible in Mars' very thin air.",
    discovered:
      "Flight on Mars works. Ingenuity went on to scout routes ahead of the Perseverance rover.",
    ending:
      "On its 72nd flight a rotor blade was damaged during landing. It can no longer fly, and it rests where it last touched down.",
    engineers:
      "It weighs about as much as a bag of sugar. Its blades spin far faster than an Earth helicopter's to grip the thin air.",
    didYouKnow: "It carries a tiny piece of fabric from the Wright brothers' first airplane.",
    sources: [
      {
        label: "NASA Science: Ingenuity Mars Helicopter",
        url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      },
      details("PIA25881"),
    ],
  },
];
