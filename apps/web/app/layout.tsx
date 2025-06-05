import { Instrument_Sans } from "next/font/google";
import './globals.css';

const instrumentSans = Instrument_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={instrumentSans.className}>
          {children}
      </body>
    </html>
  );
}
