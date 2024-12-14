import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-white w-full">
      <hr className="w-11/12 mx-auto border-gray-200" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center text-black"
          >
            <span className="mr-2">
                <LogoIcon />
            </span>
            Leadhunter
          </a>
        </div>

        <div className="flex flex-col gap-2 text-gray-700">
          <h3 className="font-bold text-lg text-black">Follow Us</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              GitHub
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Twitter
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-700">
          <h3 className="font-bold text-lg text-black">Platforms</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Web
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Mobile
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Integrations
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-700">
          <h3 className="font-bold text-lg text-black">About</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Features
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#pricing"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Pricing
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-700">
          <h3 className="font-bold text-lg text-black">Community</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              YouTube
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Discord
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Twitch
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center text-gray-700">
        <h3>
          &copy; {new Date().getFullYear()} Leadhunter. Built with passion by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/leopoldo-miranda/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Leo Miranda
          </a>
        </h3>
      </section>
    </footer>
  );
};
