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
    id: "dominguette",
    title: "Studio Dominguette",
    tags: ["Web", "Framer"],
    thumbnail: "/projects/thumbnails/dominguette.png",
    content: "/projects/dominguette.md",
    links: [
      { text: "View website", url: "https://studiodominguette.com/" },
    ],
  },
  {
    id: "tourlane",
    title: "Tourlane Self Scheduling",
    tags: ["Design", "UX/UI"],
    thumbnail: "/projects/thumbnails/tourlane.png",
    content: "/projects/tourlane.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/tourlane" },
    ],
  },
  {
    id: "cgm",
    title: "CGM Vaccine Registration",
    tags: ["Design", "UX/UI"],
    thumbnail: "/projects/thumbnails/cgm.png",
    content: "/projects/cgm.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/cgm" },
    ],
  },
  {
    id: "tresor",
    title: "Tresor: Treasure Hunt",
    tags: ["Design", "UX/UI"],
    thumbnail: "/projects/thumbnails/tresor.png",
    content: "/projects/tresor.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/tresor" },
    ],
  },
  {
    id: "studybuddy",
    title: "Study Buddy: Student Collaboration",
    tags: ["Design", "UX/UI"],
    thumbnail: "/projects/thumbnails/studybuddy.png",
    content: "/projects/studybuddy.md",
    links: [
      { text: "View Case Study", url: "https://fabiodicecca.framer.website/studybuddy" },
    ],
  },
  {
    id: "skypong",
    title: "SkyPong: Multiplayer Pong",
    tags: ["Coding", "Next.js", "Babylon.js"],
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
    tags: ["Coding", "C", "Raycasting"],
    thumbnail: "/projects/thumbnails/cub3d.png",
    content: "/projects/cub3d.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/cub3d" },
    ],
  },
  {
    id: "fdf",
    title: "Fdf: Wireframe Renderer",
    tags: ["Coding", "C", "3D Projection"],
    thumbnail: "/projects/thumbnails/fdf.png",
    content: "/projects/fdf.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/fdf" },
    ],
  },
  {
    id: "inception",
    title: "Inception: Docker Infrastructure",
    tags: ["Coding", "Docker", "DevOps"],
    thumbnail: "/projects/thumbnails/inception.png",
    content: "/projects/inception.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/inception" },
    ],
  },
  {
    id: "webserv",
    title: "Webserv: HTTP Server",
    tags: ["Coding", "C++", "HTTP"],
    thumbnail: "/projects/thumbnails/webserv.png",
    content: "/projects/webserv.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/webserv" },
    ],
  },
  {
    id: "minishell",
    title: "Minishell: Unix Shell",
    tags: ["Coding", "C", "Shell"],
    thumbnail: "/projects/thumbnails/minishell.png",
    content: "/projects/minishell.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/minishell" },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio — fabiodicec.ca",
    tags: ["Coding", "Astro", "Three.js"],
    thumbnail: "/projects/thumbnails/portfolio.png",
    content: "/projects/portfolio.md",
    links: [
      { text: "Live Site", url: "https://fabiodicec.ca" },
    ],
  },
  {
    id: "mapdot",
    title: "mapdot",
    tags: ["Coding", "Vue", "Three.js"],
    thumbnail: "/projects/thumbnails/mapdot.png",
    content: "/projects/mapdot.md",
    links: [
      { text: "Git Repo", url: "https://github.com/fabbbiodc/mapdot" },
      { text: "Live Preview", url: "https://fabbbiodc.github.io/mapdot/" },
    ],
  },
];
