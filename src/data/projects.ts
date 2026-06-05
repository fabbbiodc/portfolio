interface Project {
  id: string;
  title: string;
  tags: string[];
  thumbnail: string;
  content: string;
}

export const projects: Project[] = [
  {
    id: "project_01",
    title: "Project Nexus: Urban Canopy Optimizer",
    tags: ["React", "TypeScript", "3D Visualization"],
    thumbnail: "/projects/thumbnails/project_01.jpg",
    content: "/projects/project_01.md",
  },
  {
    id: "project_02",
    title: "EcoSync: Smart Building Energy Management",
    tags: ["Node.js", "Python", "IoT"],
    thumbnail: "/projects/thumbnails/project_02.jpg",
    content: "/projects/project_02.md",
  },
];
