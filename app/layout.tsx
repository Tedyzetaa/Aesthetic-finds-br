import type { Metadata } from "next";
import "./globals.css";
import StickyAdBanner from "@/components/StickyAdBanner";
import SideAdBanner from "@/components/SideAdBanner";

const AADS_UNIT_STICKY = process.env.NEXT_PUBLIC_AADS_UNIT_STICKY;
const AADS_UNIT_SIDE_LEFT = process.env.NEXT_PUBLIC_AADS_UNIT_SIDE_LEFT;
const AADS_UNIT_SIDE_RIGHT = process.env.NEXT_PUBLIC_AADS_UNIT_SIDE_RIGHT;

export const metadata: Metadata = { title: "Aesthetic Finds Br", description: "Vitrine" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        {children}
        <StickyAdBanner unitId={AADS_UNIT_STICKY} />
        <SideAdBanner unitId={AADS_UNIT_SIDE_LEFT} side="left" />
        <SideAdBanner unitId={AADS_UNIT_SIDE_RIGHT} side="right" />
      </body>
    </html>
  );
}
