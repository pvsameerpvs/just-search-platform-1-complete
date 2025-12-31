import "./globals.css";

export const metadata = {
  title: "Just Search | Admin & Sales",
  description: "Lead Automation & Client CRM Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
