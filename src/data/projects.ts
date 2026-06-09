interface ProjectLink {
  text: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  tags: string[];
  thumbnail: string;
  content: string;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: "project_01",
    title: "Project Nexus: Urban Canopy Optimizer",
    tags: ["React", "TypeScript", "3D Visualization"],
    thumbnail: "/projects/thumbnails/project_01.jpg",
    content: "/projects/project_01.md",
    links: [
      { text: "View Live Demo", url: "https://example.com/nexus" },
      { text: "View Source Code", url: "https://example.com/nexus/source" },
    ],
  },
  {
    id: "project_02",
    title: "EcoSync: Smart Building Energy Management",
    tags: ["Node.js", "Python", "IoT"],
    thumbnail: "/projects/thumbnails/project_02.jpg",
    content: "/projects/project_02.md",
    links: [
      { text: "View Live Demo", url: "https://example.com/ecosync" },
      { text: "View Source Code", url: "https://example.com/ecosync/source" },
    ],
  },
  {
    id: "tourlane",
    title: "Tourlane Self Scheduling",
    tags: ["UX Design", "Product Design", "Material Design 3"],
    thumbnail: "/projects/thumbnails/tourlane.png",
    content: "/projects/tourlane.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/tourlane" },
    ],
  },
  {
    id: "cgm",
    title: "CGM Vaccine Registration",
    tags: ["UX Design", "Healthcare", "Regulatory Compliance"],
    thumbnail: "/projects/thumbnails/cgm.png",
    content: "/projects/cgm.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/cgm" },
    ],
  },
  {
    id: "tresor",
    title: "Tresor: Treasure Hunt",
    tags: ["UX Design", "AR", "Game Design"],
    thumbnail: "/projects/thumbnails/tresor.png",
    content: "/projects/tresor.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/tresor" },
    ],
  },
  {
    id: "studybuddy",
    title: "Study Buddy: Student Collaboration",
    tags: ["UI Design", "Web App", "EdTech"],
    thumbnail: "/projects/thumbnails/studybuddy.png",
    content: "/projects/studybuddy.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/studybuddy" },
    ],
  },
  {
    id: "skypong",
    title: "SkyPong: Multiplayer Pong",
    tags: ["Next.js", "Babylon.js", "WebSockets", "Microservices"],
    thumbnail: "/projects/thumbnails/skypong.png",
    content: "/projects/skypong.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/skypong" },
      { text: "Play Now", url: "http://fabbbiodc.github.io/skypong" },
    ],
  },
  {
    id: "cub3d",
    title: "Cub3D: Raycasting Engine",
    tags: ["C", "Raycasting", "Game Engine", "Graphics Programming"],
    thumbnail: "/projects/thumbnails/cub3d.png",
    content: "/projects/cub3d.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/cub3d" },
    ],
  },
];
