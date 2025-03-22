export type PlanetData = {
  id: string;
  name: string;
  description: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // days
  rotationPeriod: number; // hours
  moons: number;
  color: string;
  texture: string;
  model?: {
    position: [number, number, number];
    scale: number;
  };
};

export const planets: PlanetData[] = [
  {
    id: "mercury",
    name: "Mercury",
    description:
      "Mercury is the smallest and innermost planet in the Solar System. It has no natural satellites and no substantial atmosphere.",
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    rotationPeriod: 1408,
    moons: 0,
    color: "#BAA79C",
    texture: "/textures/mercury.jpg",
    model: {
      position: [10, 0, 0],
      scale: 0.4,
    },
  },
  {
    id: "venus",
    name: "Venus",
    description:
      "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. It&apos;s often called Earth&apos;s sister planet due to their similar size and mass.",
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 224.7,
    rotationPeriod: 5832,
    moons: 0,
    color: "#E0CDBA",
    texture: "/textures/venus.jpg",
    model: {
      position: [15, 0, 0],
      scale: 0.9,
    },
  },
  {
    id: "earth",
    name: "Earth",
    description:
      "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It&apos;s the densest planet in the Solar System.",
    diameter: 12742,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.2,
    rotationPeriod: 24,
    moons: 1,
    color: "#2E75FF",
    texture: "/textures/earth.jpg",
    model: {
      position: [20, 0, 0],
      scale: 1,
    },
  },
  {
    id: "mars",
    name: "Mars",
    description:
      "Mars is the fourth planet from the Sun. It is often referred to as the &apos;Red Planet&apos; due to its reddish appearance, caused by iron oxide on its surface.",
    diameter: 6779,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    rotationPeriod: 24.6,
    moons: 2,
    color: "#FF6E4A",
    texture: "/textures/mars.jpg",
    model: {
      position: [25, 0, 0],
      scale: 0.6,
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    description:
      "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun.",
    diameter: 139820,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    rotationPeriod: 9.9,
    moons: 79,
    color: "#D8CA9D",
    texture: "/textures/jupiter.jpg",
    model: {
      position: [35, 0, 0],
      scale: 2.5,
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    description:
      "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is known for its prominent ring system.",
    diameter: 116460,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    rotationPeriod: 10.7,
    moons: 82,
    color: "#E4D7A8",
    texture: "/textures/saturn.jpg",
    model: {
      position: [45, 0, 0],
      scale: 2.2,
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    description:
      "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
    diameter: 50724,
    distanceFromSun: 2871,
    orbitalPeriod: 30687,
    rotationPeriod: 17.2,
    moons: 27,
    color: "#C1E7E7",
    texture: "/textures/uranus.jpg",
    model: {
      position: [55, 0, 0],
      scale: 1.8,
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    description:
      "Neptune is the eighth and farthest known planet from the Sun. It is the fourth-largest planet by diameter and the third-most-massive.",
    diameter: 49244,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    rotationPeriod: 16.1,
    moons: 14,
    color: "#5B6DFF",
    texture: "/textures/neptune.jpg",
    model: {
      position: [65, 0, 0],
      scale: 1.7,
    },
  },
  {
    id: "sun",
    name: "Sun",
    description:
      "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma and is by far the most important source of energy for life on Earth.",
    diameter: 1392000,
    distanceFromSun: 0,
    orbitalPeriod: 0,
    rotationPeriod: 609.6,
    moons: 0,
    color: "#FDB813",
    texture: "/textures/sun.jpg",
    model: {
      position: [0, 0, 0],
      scale: 5,
    },
  },
];
