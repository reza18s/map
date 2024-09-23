import { Providers } from "./providers";
import { connectDB } from "@/configs/db";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "../css/style.css";
export const metadata = {
  title: "Map",
  description: "Map Selector by shahyad karimi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
