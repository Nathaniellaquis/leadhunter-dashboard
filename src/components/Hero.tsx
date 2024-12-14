import { Button } from "./ui/button";
import { CobeGlobe } from "./CobeGlobe";

export const Hero = () => {
  return (
    <section className="container w-full py-16 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 place-items-center">
        <div className="text-center lg:text-left space-y-6 max-w-full lg:max-w-xl mx-auto lg:mx-0">
          <main className="font-bold leading-tight">
            <h1 className="text-center lg:text-left">
              <span className="block text-3xl sm:text-4xl md:text-5xl font-bold">
                Reach The World
              </span>
              <span className="flex items-baseline justify-center lg:justify-start space-x-2">
                <span className="text-green-600 text-5xl sm:text-6xl md:text-8xl font-bold">
                  Leadhunter
                </span>
              </span>
            </h1>
          </main>

          {/* Hidden on screens smaller than md */}
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 hidden md:block">
            Leadhunter streamlines your prospecting efforts with powerful automation. Discover quality leads, engage
            efficiently, and close deals faster.
          </p>

          {/* Button visible on desktop and above (md and up), aligned left below the text */}
          <div className="hidden md:flex items-center justify-center lg:justify-start md:space-x-4">
            <Button className="w-full md:w-auto">
              Get Started
            </Button>
          </div>
        </div>

        <div className="w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <CobeGlobe />
          </div>
        </div>
      </div>

      {/* Button visible on mobile only (below the globe) */}
      <div className="flex justify-center mt-8 md:hidden">
        <Button className="w-full">
          Get Started
        </Button>
      </div>
    </section>
  );
};
