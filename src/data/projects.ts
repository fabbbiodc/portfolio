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
];
