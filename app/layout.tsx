import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "薛譞杰 — 视觉设计总监 / XJ Portfolio",
  description: "薛譞杰的视觉设计作品集：品牌、活动、海报、出版、包装与数字界面。",
  openGraph: {
    title: "薛譞杰 — 视觉设计总监",
    description: "视觉，有其引力。",
    images: [{ url: "/og.png", width: 1792, height: 931 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
