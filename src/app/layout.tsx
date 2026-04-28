// Root layout — required by Next.js App Router even when [locale] holds the
// real <html>/<body>. Acts as a thin pass-through (no <html> here, that lives
// in the [locale]/layout.tsx so next-intl can set lang).
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
