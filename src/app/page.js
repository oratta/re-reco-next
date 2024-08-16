import Image from "next/image";
import Link from "next/link";

const BigButton = ({ text, href }) => (
    <Link href={href} passHref>
      <button className="bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 w-full text-sm sm:text-base">
        {text}
      </button>
    </Link>
);

const ImageContainer = ({ src, alt }) => (
    <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{
          objectFit: "contain"
        }} />
    </div>
);

const Layout = ({ children, reverse = false }) => (
    <div className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4 mb-4`}>
      {children}
    </div>
);

export default function Home() {
  return (
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
        <Layout>
          <div className="w-1/2">
            <ImageContainer src="/concierge.png" alt="Concierge" />
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <BigButton text="Order" href="/order" />
            <BigButton text="Report" href="/recommend" />
          </div>
        </Layout>
        <Layout reverse>
          <div className="w-1/2">
            <ImageContainer src="/rumor.png" alt="Rumor" />
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <BigButton text="Cast Rumor" href="/recommend" />
            <BigButton text="Shop Rumor" href="/recommend" />
          </div>
        </Layout>
      </div>
  );
}