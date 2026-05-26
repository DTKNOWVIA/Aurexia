import "./globals.css";

export const metadata = {
  title: "Aurexia - Institutional Capital Platform",
  description: "Critical mineral investment platform for Southern Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
