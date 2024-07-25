import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex">
      {/* Welcome Part */}
      <div className="w-full flex-1 bg-cover h-full max-md:hidden text-center border-r-2 flex flex-col items-center bg-gradient-to-br from-blue-800 to-blue-500 dark:from-blue-950 dark:to-blue-900">
        <div className="p-3 text-white">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to NextChat!
          </h1>
          <p className="text-left text-xl lg:text-2xl font-semibold mt-10">
            Stay connected with those who matter. Add contacts, chat one-on-one,
            or create groups to bring everyone together in one place.
            <br />
            <br />
            Start your NextChat journey now! 💬
          </p>
        </div>
        <div className="w-full h-full relative flex items-center">
          <Image
            src={"/chat-app-bg.png"}
            alt="background image"
            fill
            priority
            quality={100}
            className="w-full object-contain"
          />
        </div>
      </div>
      {/* Login Form */}
      <>{children}</>
    </div>
  );
}
