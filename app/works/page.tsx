import type { Metadata } from "next";
import WorksOverview from "./WorksOverview";

export const metadata: Metadata = {
  title: "Works — Studio Almost",
  description: "Selected works by Studio Almost. 品牌、徽标、活动、展览、海报、图形、书籍、音乐装帧、包装、产品、商业与网站。",
};

export default function WorksPage() {
  return <WorksOverview />;
}
