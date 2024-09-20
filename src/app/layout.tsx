import { Providers } from "./providers";
import "./globals.css";
import "../css/style.css";
import { connectDB } from "@/configs/db";

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
