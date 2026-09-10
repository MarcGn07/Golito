import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Golito — Solo football quizzes",
  description:
    "Play football quizzes on your own: rank top-10 lists, order events in time, sort clubs by the numbers, and guess transfer fees.",
};

// Runs before paint to avoid a light/dark flash. Reads the stored
// preference (or system preference) and sets the class on <html>.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('golito-theme');
    var theme = stored ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
