import "@/styles/globals.css";
import "@/styles/dataTables.dataTables.css";
import "@/styles/responsive.dataTables.min.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "400",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={plusJakartaSans.className}>
      <Component {...pageProps} />
    </main>
  );
}
