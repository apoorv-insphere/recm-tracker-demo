import type { Metadata, Viewport } from 'next';
import "react-datepicker/dist/react-datepicker.css";
import { primaryFont, SecondaryFont } from '../config/fonts';
import CustomLayout from '../components/Layouts/CustomLayout';
import '../styles/globals.scss';


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Jinsafe App',
  description: 'Jinsafe App'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          suppressHydrationWarning={true}
          className={`admin-mainWrapper ${primaryFont.variable} ${SecondaryFont.variable}`}
        >
          <CustomLayout>
              {children}
          </CustomLayout>
        </body>
      </html>
    </div>
  );
}
