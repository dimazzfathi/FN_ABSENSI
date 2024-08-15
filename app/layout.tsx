import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from './components/layout/footer/page';
import Navbar from './components/layout/navbar/page';
import Sidebar from './components/layout/sidebar/page';

const poppins = Poppins({ weight: ["300", "400", "400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextjs Authentication",
  description: "Nextjs Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={poppins.className}>
      {children}
     
        </body>
        
    </html>
  );
}
