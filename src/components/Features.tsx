import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "AI-Powered Insights",
    description:
      "Leverage AI to identify high-value leads, uncover patterns, and prioritize outreach for maximum impact.",
    image: image,
  },
  {
    title: "Intuitive User Interface",
    description:
      "Navigate Leadhunter’s dashboard with ease. Quickly apply filters, track progress, and manage campaigns effortlessly.",
    image: image3,
  },
  {
    title: "Responsive & Scalable",
    description:
      "Access Leadhunter anywhere—desktop, tablet, or mobile—and scale as your business grows, without any performance trade-offs.",
    image: image4,
  },
];

const featureList: string[] = [
  "AI Insights",
  "Advanced Filtering",
  "Real-Time Analytics",
  "CRM Integrations",
  "Automated Follow-Ups",
  "Custom Segments",
  "Responsive Design",
  "Team Collaboration",
  "Dedicated Support",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Unlock{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Powerful Features
        </span>{" "}
        for Lead Generation
      </h2>

      <p className="text-muted-foreground text-xl md:text-center md:w-3/4 mx-auto">
        Leadhunter is packed with features designed to simplify your sales process and supercharge your conversions.
      </p>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt={title}
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
