import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TbSearch, TbFolders, TbRobot, TbTrendingUp } from "react-icons/tb";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <TbSearch size={40} className="text-primary" />,
    title: "Identify Prospects",
    description:
      "Use Leadhunter’s advanced search filters and data insights to discover high-quality leads tailored to your target market.",
  },
  {
    icon: <TbFolders size={40} className="text-primary" />,
    title: "Organize & Segment",
    description:
      "Group leads into segments for personalized outreach campaigns, ensuring the right message hits the right audience.",
  },
  {
    icon: <TbRobot size={40} className="text-primary" />,
    title: "Automate Outreach",
    description:
      "Leverage automated workflows to schedule follow-ups, send drip campaigns, and nurture leads through every stage of the pipeline.",
  },
  {
    icon: <TbTrendingUp size={40} className="text-primary" />,
    title: "Convert & Scale",
    description:
      "Monitor engagement, track conversions, and refine your approach. Scale your efforts as you turn prospects into loyal customers.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32 w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        — A Simple 4-Step Process
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Leadhunter streamlines your lead generation journey. Follow these steps to achieve consistent sales growth.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
