import type { Metadata } from "next";
import { BranchGlobeHero } from "@/components/branch-globe-hero";
import { BranchExplorer } from "@/components/branch-explorer";
import { Breadcrumb, DemoNote, PageIntro, SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "شعب و باجه‌ها" };

export default function BranchesPage() {
  return <SiteShell>
    <Breadcrumb items={[{ label: "شعب و باجه‌ها" }]}/>
    <BranchGlobeHero/>
    <div id="branch-search-area"><BranchExplorer/></div>
    <div className="container"><DemoNote/></div>
  </SiteShell>;
}
