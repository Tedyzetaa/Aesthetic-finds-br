import type { Metadata, Viewport } from "next";
import "./globals.css";
import StickyAdBanner from "@/components/StickyAdBanner";
import SideAdBanner from "@/components/SideAdBanner";
import PwaRegister from "@/components/PwaRegister";

const AADS_UNIT_STICKY = process.env.NEXT_PUBLIC_AADS_UNIT_STICKY;
const AADS_UNIT_SIDE_LEFT = process.env.NEXT_PUBLIC_AADS_UNIT_SIDE_LEFT;
const AADS_UNIT_SIDE_RIGHT = process.env.NEXT_PUBLIC_AADS_UNIT_SIDE_RIGHT;

export const metadata: Metadata = {
  title: "Aesthetic Finds Br",
  description: "Vitrine",
  applicationName: "Aesthetic Finds Br",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/icons/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aesthetic Finds"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2F6E60"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        {children}
        <StickyAdBanner unitId={AADS_UNIT_STICKY} />
        <SideAdBanner unitId={AADS_UNIT_SIDE_LEFT} side="left" />
        <SideAdBanner unitId={AADS_UNIT_SIDE_RIGHT} side="right" />
        <PwaRegister />
      </body>
    </html>
  );
}
