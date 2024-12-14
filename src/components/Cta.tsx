import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32">
      <div className="container lg:grid lg:grid-cols-2 place-items-center gap-8">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold">
            All Your
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Leads & Prospects{" "}
            </span>
            In One Dashboard
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Streamline your outreach efforts, customize workflows, and automate follow-ups.
            Leadhunter centralizes your lead generation process to help you close deals faster than ever.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button className="w-full md:mr-4 md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
            Request a Demo
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            View All Features
          </Button>
        </div>
      </div>
    </section>
  );
};
