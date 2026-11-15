/**
 * Pages of the NASA archive flipbook — one machine (or matched pair) per page.
 * The list follows the "NASA Data & Resources" tab of the Space Apps 2026
 * challenge "Abandoned but not Forgotten". Every fact is drawn from the
 * official NASA sources listed in `sources` (NSSDCA catalog, science.nasa.gov,
 * nasa.gov, jpl.nasa.gov); images are public-domain NASA photos from images.nasa.gov.
 */

export type Source = { label: string; url: string };

/** Which part of the book a page belongs to. */
export type Region = "Moon" | "Mars" | "Beyond";

export type Artifact = {
  id: string;
  name: string;
  kind: string;
  region: Region;
  /** Where it is, in a word or two (shown at the top of the page). */
  world: string;
  /** Year shown in the contents list. */
  year: string;
  resting: string;
  /** Label for the `arrived` fact; defaults to "Arrived". */
  arrivedLabel?: string;
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

const nssdca = (id: string, name: string): Source => ({
  label: `NSSDCA catalog: ${name}`,
  url: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`,
});

export const artifacts: Artifact[] = [
  // ───────────────────────── The Moon ─────────────────────────
  {
    id: "apollo-11-eagle",
    name: "Apollo 11 Lunar Module",
    kind: "Crewed lander descent stage",
    region: "Moon",
    world: "Moon",
    year: "1969",
    resting: "Tranquility Base, Sea of Tranquility",
    arrived: "July 20, 1969",
    lastHeard: "Science package: August 27, 1969",
    plannedLife: "One landing, one launch",
    actualLife: "Its laser mirror: 55+ years and counting",
    image: {
      src: img("as11-40-5927"),
      alt: "The Apollo 11 lunar module Eagle resting on the Moon while Buzz Aldrin prepares the science package",
      credit: "NASA / Apollo 11",
      nasaId: "as11-40-5927",
    },
    hook: "The launch pad the first Moon walkers left behind.",
    builtTo:
      "Carry Neil Armstrong and Buzz Aldrin from lunar orbit down to the surface. Its bottom half, the descent stage, was designed to stay behind as the launch pad for the top half.",
    discovered:
      "Next to it, the crew set up a small science package with a seismometer and a mirror for lasers. Laser pulses bounced off that mirror show the Moon is drifting away from Earth, about 3.8 centimeters a year.",
    ending:
      "After 21 hours and 36 minutes on the Moon, the top half lifted off and the descent stage stayed. The seismometer stopped accepting commands on August 27, 1969. The mirror needs no power, and observatories still aim at it.",
    engineers:
      "Thousands of people designed, built and tested the lunar module so it could land softly on a world no one had ever touched.",
    didYouKnow:
      "A plaque on the leg left behind reads: \"We came in peace for all mankind.\"",
    sources: [
      nssdca("1969-059C", "Apollo 11 Lunar Module / EASEP"),
      { label: "NASA: Apollo 11", url: "https://www.nasa.gov/mission/apollo-11/" },
      details("as11-40-5927"),
    ],
  },
  {
    id: "lunar-roving-vehicles",
    name: "Lunar Roving Vehicles",
    kind: "Three crewed electric rovers",
    region: "Moon",
    world: "Moon",
    year: "1971",
    resting: "Apollo 15, 16 and 17 landing sites",
    arrived: "July 30, 1971 (Apollo 15); two more in 1972",
    lastHeard: "Last driven December 1972 (Apollo 17)",
    plannedLife: "Three moonwalks per mission",
    actualLife: "Apollo 15 alone: 27.9 km of traverses",
    image: {
      src: img("as15-86-11603"),
      alt: "Astronaut James Irwin working beside the Lunar Roving Vehicle with Mount Hadley behind",
      credit: "NASA / Apollo 15",
      nasaId: "as15-86-11603",
    },
    hook: "The first cars ever driven on another world.",
    builtTo:
      "Let astronauts travel much farther from their lander, carrying tools, cameras, and the rocks they collected.",
    discovered:
      "On Apollo 15, Dave Scott and Jim Irwin drove to the edge of Hadley Rille and explored up to 5 km from their lander, collecting 77 kg of rock and soil.",
    ending:
      "When each crew went home, its rover stayed parked on the Moon. All three \"moon buggies\" are still there.",
    engineers:
      "It folded up like origami to fit on the side of the lunar module. Its wheels were made of woven wire mesh because rubber tires wouldn't survive the Moon.",
    didYouKnow: "Each of its four wheels had its own electric motor, powered by batteries.",
    sources: [
      nssdca("1971-063C", "Apollo 15 Lunar Module / ALSEP"),
      { label: "NASA: Apollo 15", url: "https://www.nasa.gov/mission/apollo-15/" },
      { label: "NASA: Apollo 17", url: "https://www.nasa.gov/mission/apollo-17/" },
      details("as15-86-11603"),
    ],
  },
  {
    id: "alsep",
    name: "ALSEP Science Stations",
    kind: "Apollo Lunar Surface Experiments Packages",
    region: "Moon",
    world: "Moon",
    year: "1969",
    resting: "Five Apollo landing sites (Apollo 12, 14, 15, 16, 17)",
    arrived: "November 19, 1969 (Apollo 12)",
    lastHeard: "September 30, 1977",
    plannedLife: "Years, on nuclear power",
    actualLife: "Apollo 12 station: nearly 8 years",
    image: {
      src: img("as12-47-6918"),
      alt: "Parts of the Apollo 12 science station set up on the grey lunar surface",
      credit: "NASA / Apollo 12",
      nasaId: "as12-47-6918",
    },
    hook: "Science stations that kept listening after the astronauts left.",
    builtTo:
      "Keep doing science after the crews flew home: feel the Moon shake, measure the solar wind and magnetic field, and radio everything back to Earth.",
    discovered:
      "Their seismometers recorded the Moon's crust and interior shaking, giving scientists a look inside another world for years.",
    ending:
      "On September 30, 1977, NASA shut down all the stations together. The equipment still stands where the astronauts set it up.",
    engineers:
      "Each station ran on a small generator. Astronauts slid a plutonium fuel rod into it by hand, and it made about 70 watts of power.",
    didYouKnow: "Apollo 12 landed within about 180 meters of the robot lander Surveyor 3, the next page in this book.",
    sources: [
      nssdca("1969-099C", "Apollo 12 Lunar Module / ALSEP"),
      nssdca("1971-063C", "Apollo 15 Lunar Module / ALSEP"),
      details("as12-47-6918"),
    ],
  },
  {
    id: "surveyor-3",
    name: "Surveyor 3",
    kind: "Robotic lander",
    region: "Moon",
    world: "Moon",
    year: "1967",
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
    hook: "The robot lander that got a visit from astronauts.",
    builtTo:
      "Prove that a soft landing on the Moon was possible, and find out whether the ground was firm enough for astronauts. It dug little trenches with a scoop to test the soil.",
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

  // ───────────────────────── Mars ─────────────────────────
  {
    id: "viking",
    name: "Viking 1 & 2 Landers",
    kind: "Twin robotic landers",
    region: "Mars",
    world: "Mars",
    year: "1976",
    resting: "Chryse Planitia (Viking 1) and Utopia Planitia (Viking 2)",
    arrived: "July 20 and September 3, 1976",
    lastHeard: "Viking 2: April 1980 · Viking 1: November 1982",
    plannedLife: "90 days",
    actualLife: "About 3½ and more than 6 years",
    image: {
      src: img("PIA00563", "orig"),
      alt: "The first color photograph from the surface of Mars, showing an orange rocky plain under a pale sky",
      credit: "NASA/JPL",
      nasaId: "PIA00563",
    },
    hook: "America's first landers to work on Mars.",
    builtTo:
      "Take the first pictures from the Martian surface and run experiments to look for signs of life in the soil.",
    discovered:
      "The two landers sent home 4,500 photos of their landing sites, about 6,460 km apart, plus years of Mars weather. Their tests for life were inconclusive.",
    ending:
      "Viking 2 kept sending data until April 12, 1980. In 1982 a command from Earth accidentally overwrote the software that pointed Viking 1's antenna home, and it was never heard from again.",
    engineers:
      "Both landers were renamed after team members: Viking 1 is the Thomas A. Mutch Memorial Station, Viking 2 the Gerald Soffen Memorial Station.",
    didYouKnow: "Viking 1 landed exactly seven years after Apollo 11 touched down on the Moon.",
    sources: [
      { label: "NASA Science: Viking 1", url: "https://science.nasa.gov/mission/viking-1/" },
      { label: "NASA Science: Viking 2", url: "https://science.nasa.gov/mission/viking-2/" },
      details("PIA00563"),
    ],
  },
  {
    id: "sojourner",
    name: "Sojourner & Pathfinder",
    kind: "First Mars rover + lander",
    region: "Mars",
    world: "Mars",
    year: "1997",
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
      "The lander's battery wore out and its transmissions stopped. Sojourner is now permanently parked nearby.",
    engineers:
      "The rover was about the size of a microwave oven. Its success led to every Mars rover since. The lander was renamed the Carl Sagan Memorial Station.",
    didYouKnow: "Pathfinder landed by bouncing across Mars inside giant airbags, like a beach ball.",
    sources: [
      { label: "NASA Science: Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
      details("PIA01551"),
    ],
  },
  {
    id: "spirit-opportunity",
    name: "Spirit & Opportunity",
    kind: "Twin Mars Exploration Rovers",
    region: "Mars",
    world: "Mars",
    year: "2004",
    resting: "Gusev Crater (Spirit) and Endeavour Crater (Opportunity)",
    arrived: "January 3 and 24, 2004",
    lastHeard: "Spirit: March 2010 · Opportunity: June 10, 2018",
    plannedLife: "90 Martian days each",
    actualLife: "6+ years and nearly 15 years",
    image: {
      src: img("PIA17759"),
      alt: "Self-portrait of the Opportunity rover, its solar panels coated in reddish dust",
      credit: "NASA/JPL-Caltech/Cornell/Arizona State Univ.",
      nasaId: "PIA17759",
    },
    hook: "Twin robot geologists sent to opposite sides of Mars.",
    builtTo: "Land at two places that looked shaped by water and find out whether liquid water really flowed there.",
    discovered:
      "Opportunity's tiny round \"blueberries\" and the nearly pure silica Spirit scraped up with a stuck wheel showed water once soaked parts of Mars.",
    ending:
      "Spirit got stuck in soft sand and went silent in 2010. Opportunity kept going until a planet-wide dust storm blocked the Sun from its solar panels in June 2018.",
    engineers:
      "Spirit drove 7.7 km. Opportunity drove 45.16 km, an off-Earth record that stood until Perseverance passed it on October 11, 2026.",
    didYouKnow: "The last wake-up song the team played for Opportunity was \"I'll Be Seeing You.\"",
    sources: [
      {
        label: "NASA Science: Spirit and Opportunity",
        url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
      },
      { label: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
      details("PIA17759"),
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    kind: "Polar lander",
    region: "Mars",
    world: "Mars",
    year: "2008",
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
    region: "Mars",
    world: "Mars",
    year: "2018",
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
    didYouKnow: "The photo on this page is its final selfie. You can see how thick the dust on its solar panels had become.",
    sources: [
      { label: "NASA Science: InSight", url: "https://science.nasa.gov/mission/insight/" },
      details("PIA25287"),
    ],
  },
  {
    id: "ingenuity",
    name: "Ingenuity",
    kind: "Mars helicopter",
    region: "Mars",
    world: "Mars",
    year: "2021",
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
      "On its 72nd flight a rotor blade was damaged during landing. It can no longer fly, and it rests where it last touched down as a stationary artifact.",
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

  // ───────────────────────── Beyond ─────────────────────────
  {
    id: "pioneer",
    name: "Pioneer 10 & 11",
    kind: "Deep-space probes",
    region: "Beyond",
    world: "Deep space",
    year: "1972",
    resting: "Drifting out of the solar system",
    arrivedLabel: "Launched",
    arrived: "March 2, 1972 and April 6, 1973",
    lastHeard: "Pioneer 11: 1995 · Pioneer 10: January 23, 2003",
    plannedLife: "Pioneer 10: 21 months",
    actualLife: "Pioneer 10: more than 30 years",
    image: {
      src: img("ARC-1969-AC72-1351"),
      alt: "Artist illustration of Pioneer 10 flying past Jupiter",
      credit: "NASA Ames",
      nasaId: "ARC-1969-AC72-1351",
    },
    hook: "The first messengers sent toward the stars.",
    builtTo:
      "Fly through the asteroid belt and take the first close look at Jupiter. Pioneer 11 then swung on to Saturn.",
    discovered:
      "Pioneer 10 was the first to cross the asteroid belt and fly past Jupiter. Pioneer 11 was the first to fly past Saturn, and found a narrow new ring, the F ring.",
    ending:
      "Their nuclear power slowly faded. Pioneer 11 last spoke in 1995. Pioneer 10's final faint signal came from 12.23 billion km away and took 11 hours 20 minutes to reach Earth.",
    engineers:
      "Both carry a golden plaque, Carl Sagan's idea, designed with Frank Drake and drawn by Linda Salzman Sagan, telling anyone who finds them who sent them and from where.",
    didYouKnow: "Pioneer 10 is heading toward the red star Aldebaran and should pass it in about two million years.",
    sources: [
      { label: "NASA Science: Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" },
      { label: "NASA Science: Pioneer 11", url: "https://science.nasa.gov/mission/pioneer-11/" },
      details("ARC-1969-AC72-1351"),
    ],
  },
  {
    id: "near-shoemaker",
    name: "NEAR Shoemaker",
    kind: "Asteroid orbiter",
    region: "Beyond",
    world: "Asteroid Eros",
    year: "2000",
    resting: "Surface of asteroid 433 Eros, near the Himeros saddle",
    arrived: "Orbit February 14, 2000; landed February 12, 2001",
    lastHeard: "February 28, 2001",
    plannedLife: "Never designed to land",
    actualLife: "About two weeks of data after touchdown",
    image: {
      src: img("PIA18177"),
      alt: "Artist's view of the NEAR spacecraft approaching the long, cratered asteroid Eros",
      credit: "NASA/JPL",
      nasaId: "PIA18177",
    },
    hook: "It landed on an asteroid it was never built to land on.",
    builtTo: "Orbit asteroid Eros and study its shape, minerals, interior and magnetic field.",
    discovered:
      "Eros has no magnetic field. NEAR mapped most of its surface and sent home 160,000 images, about 10 times more data than planned.",
    ending:
      "At the end it was steered slowly down, touching Eros at about 6.4 km/h. It survived and kept sending data for two weeks, until the extreme cold (−173 °C) silenced it.",
    engineers:
      "It was renamed NEAR Shoemaker to honor geologist Eugene Shoemaker, and was the first mission of NASA's low-cost Discovery program.",
    didYouKnow: "It was the first spacecraft ever to orbit an asteroid, and the first to land on one.",
    sources: [
      { label: "NASA Science: NEAR Shoemaker", url: "https://science.nasa.gov/mission/near-shoemaker/" },
      details("PIA18177"),
    ],
  },
  {
    id: "dawn",
    name: "Dawn",
    kind: "Ion-powered explorer",
    region: "Beyond",
    world: "Ceres orbit",
    year: "2015",
    resting: "Silent orbit around dwarf planet Ceres",
    arrived: "Vesta July 16, 2011; Ceres March 6, 2015",
    lastHeard: "Missed its calls home October 31 – November 1, 2018",
    plannedLife: "Visit two worlds",
    actualLife: "11 years in flight",
    image: {
      src: img("PIA20919", "orig"),
      alt: "Artist's view of the Dawn spacecraft with long solar wings above the grey dwarf planet Ceres",
      credit: "NASA/JPL-Caltech",
      nasaId: "PIA20919",
    },
    hook: "It circled two worlds in the asteroid belt.",
    builtTo:
      "Visit Vesta and Ceres, the two largest bodies in the asteroid belt between Mars and Jupiter, to learn about the solar system's earliest days.",
    discovered:
      "It mapped both small worlds up close and photographed the mysterious bright regions inside Ceres' Occator Crater.",
    ending:
      "It ran out of hydrazine, the fuel that kept it pointed at Earth, and stopped answering. It will keep circling Ceres, unpowered, for decades.",
    engineers:
      "Its ion engines pushed gently with xenon gas, building speed over months. The team said it turned science fiction into science fact.",
    didYouKnow: "Its two solar wings stretched almost 20 meters from tip to tip.",
    sources: [
      { label: "NASA Science: Dawn", url: "https://science.nasa.gov/mission/dawn/" },
      nssdca("2007-043A", "Dawn"),
      {
        label: "NASA JPL: Dawn mission comes to end",
        url: "https://www.jpl.nasa.gov/news/nasas-dawn-mission-to-asteroid-belt-comes-to-end/",
      },
      details("PIA20919"),
    ],
  },
  {
    id: "kepler",
    name: "Kepler",
    kind: "Planet-hunting space telescope",
    region: "Beyond",
    world: "Orbiting the Sun",
    year: "2009",
    resting: "Drifting in an orbit that trails Earth around the Sun",
    arrivedLabel: "Launched",
    arrived: "March 6, 2009",
    lastHeard: "Retired October 2018",
    plannedLife: "About 3½ years",
    actualLife: "9 years",
    image: {
      src: img("PIA11825", "orig"),
      alt: "Artist's view of the Kepler space telescope against a field of stars",
      credit: "NASA/JPL",
      nasaId: "PIA11825",
    },
    hook: "It showed us there are more planets than stars.",
    builtTo:
      "Stare at about 150,000 stars in the constellation Cygnus and catch the tiny dip in light when a planet crosses in front of its star.",
    discovered:
      "More than 2,600 planets beyond our solar system. Between 20 and 50 percent of the stars we can see may have small, possibly rocky planets where liquid water could exist.",
    ending:
      "In 2013 a second pointing wheel failed. Engineers used the pressure of sunlight to keep it steady and started a second mission, K2. In 2018 it ran out of fuel and was retired in a safe orbit, away from Earth.",
    engineers:
      "Its founding scientist, William Borucki: \"When we started conceiving this mission 35 years ago, we didn't know of a single planet outside our solar system.\"",
    didYouKnow: "The team hoped the leftover fuel would last 10 K2 campaigns. It managed 19.",
    sources: [
      { label: "NASA Science: Kepler", url: "https://science.nasa.gov/mission/kepler/" },
      details("PIA11825"),
    ],
  },
];
