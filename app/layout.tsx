import "./globals.css";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Eastbrook Youth AI Well-Being Dashboard",
  description: "AS-IS vs TO-BE analysis of AI dependence and youth well-being (synthetic user-day dataset)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
