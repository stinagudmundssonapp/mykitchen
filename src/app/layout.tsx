import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { RefrigeratorProvider } from "@/context/RefrigeratorContext";
import AppShell from "@/components/AppShell";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyKitchen — Smart kjøkkenassistent",
  description:
    "Hold orden på kjøleskapet, planlegg middager med AI, og handle smartere.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="no" className={geist.variable}>
      <body className="min-h-dvh bg-cream text-ink antialiased">
        <RefrigeratorProvider>
          <AppShell>{children}</AppShell>
        </RefrigeratorProvider>
      </body>
    </html>
  );
}
