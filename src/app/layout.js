import Link from 'next/link';
import Image from 'next/image';
import '@/styles/globals.css';
import {Inconsolata} from 'next/font/google';

const font = Inconsolata({subsets: ['latin']});

export const metadata = {
    title: 're-reco',
    description: 'application for reserve recommends',
}

export default function RootLayout({children}) {
    return(
        <html lang="ja">
        <body className={font.className}>
        <h1 className="text-4xl text-gray-800 font-bold my-2">
            <div className="flex">
                <div className="">
                    <Image
                        src="/logo.png"
                        alt="logo image"
                        width={64}
                        height={64}
                    />
                </div>
                <div className="items-center flex">
                    re-reco
                </div>
            </div>
        </h1>
        <ul className="flex bg-gray-500 mb-4 pl-2">
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/">
                    Dashboard
                </Link>
            </li>
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/job-order">
                    JobOrder
                </Link>
            </li>
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/recommend">
                    Recommend
                </Link>
            </li>
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/settings">
                    Settings
                </Link>
            </li>
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/job-reservation-rate-list">
                    ReReLi
                </Link>
            </li>
            <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                <Link className="no-underline text-blue-300" href="/job-listing-list?type=listing">
                    LiLi
                </Link>
            </li>
        </ul>
        <div className="ml-2">
            {children}
        </div>
        </body>
        </html>
    );
};