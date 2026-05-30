// 组装入口——脊柱穿过所有 section，每个 section 在自己内部布置节点。
// 这里只负责顺序与节点位置（0→1）的全局编排。

import { Spine } from "@/components/Spine";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ProjectSection } from "@/components/sections/ProjectSection";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";
import { getAllProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const projects = getAllProjects();
  const posts = getAllPosts();

  return (
    <>
      <Spine />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        {projects.map((project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
        <Writing posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
