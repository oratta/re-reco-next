import '@/styles/globals.css';
import {Inconsolata} from 'next/font/google';
import ContentProvider from "@/commons/components/contexts/ContentProvider";
import RootLayoutClient from "@/app/RootLayoutClient";

const font = Inconsolata({subsets: ['latin']});

export const metadata = {
    title: 're-reco',
    description: 'application for reserve recommends',
}

export default function RootLayout({children}) {
    return(
        <html lang="ja">
        <body className={font.className}>
        <ContentProvider>
            <RootLayoutClient>
                {children}
            </RootLayoutClient>
        </ContentProvider>
        </body>
        </html>
    );
};