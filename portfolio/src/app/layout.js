import "./globals.css";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

// Load fonts
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" });

export const metadata = {
  title: "Mohammad Aakib Bhat - Portfolio",
  description: "Cybersecurity Engineer & Web Developer",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammad Aakib Bhat",
  url: "https://mohammadaakib.dev",
  image: "https://mohammadaakib.dev/profile.jpg",
  jobTitle: "Cybersecurity Engineer & Web Developer",
  worksFor: {
    "@type": "CollegeOrUniversity",
    name: "C.V. Raman Global University",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "C.V. Raman Global University",
  },
  sameAs: [
    "https://www.linkedin.com/in/mohammad-aakib-bhat",
    "https://github.com/bhataakib02",
  ],
  knowsAbout: ["Cybersecurity", "Web Development", "Java Servlets", "Flask APIs"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
