import { Providers } from "./providers";
import "./globals.css";
import "../css/style.css";

export const metadata = {
  title: "Map",
  description: "Map Selector by shahyad karimi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
