import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";

const modamLight = localFont({
  src: "./fonts/ModamFaNumWeb-Light.woff2",
  variable: "--font-modam-light",
  weight: "200", // Light weight
});

const modamRegular = localFont({
  src: "./fonts/ModamFaNumWeb-Regular.woff2",
  variable: "--font-modam-regular",
  weight: "400", // Regular. weight
});
const modamMedium = localFont({
  src: "./fonts/ModamFaNumWeb-Medium.woff2",
  variable: "--font-modam-medium",
  weight: "400", // Medium weight
});

const modamSemiBold = localFont({
  src: "./fonts/ModamFaNumWeb-SemiBold.woff2",
  variable: "--font-modam-semibold",
  weight: "600", // SemiBold weight
});

const modamBlack = localFont({
  src: "./fonts/ModamFaNumWeb-Black.woff2",
  variable: "--font-modam-black",
  weight: "800", // Black weight
});
export const metadata: Metadata = {
  title: "Mini Shop Task",
  description: "E-commerce project with Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${modamLight.variable} ${modamMedium.variable} ${modamSemiBold.variable} ${modamBlack.variable} ${modamRegular.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>
      </body>
    </html>
  );
}
