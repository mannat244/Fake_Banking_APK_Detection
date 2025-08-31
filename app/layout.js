import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '700'], 
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['400', '700'], 
  variable: "--font-montserrat",
});

export const metadata = {
  title: "FraudRakshak - Secure Banking App Detection",
  description: "AI-powered system that detects and stops fake banking apps before they reach your phone. Protect your money with advanced fraud detection technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased overflow-x-hidden`}
        style={{
          background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)",
          minHeight: '100vh',
          width: '100%',
        }}
      >
      <ToastContainer
            position="top-right"
            autoClose={5000}
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
        {children}
      </body>
    </html>
  );
}