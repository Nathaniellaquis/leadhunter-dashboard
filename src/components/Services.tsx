import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TbUsers, TbSend, TbAutomation } from "react-icons/tb";
import cubeLeg from "../assets/cube-leg.png";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Targeted Outreach",
    description:
      "Reach the right prospects with targeted email campaigns, ensuring your message resonates and drives engagement.",
    icon: <TbSend size={24} className="text-primary" />,
  },
  {
    title: "Team Collaboration",
    description:
      "Enable your sales team to work together seamlessly, share insights, and strategize effectively from a unified dashboard.",
    icon: <TbUsers size={24} className="text-primary" />,
  },
  {
    title: "Automated Workflows",
    description:
      "Automate repetitive tasks, schedule follow-ups, and let Leadhunter handle the heavy lifting, so you can focus on closing deals.",
    icon: <TbAutomation size={24} className="text-primary" />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Leadhunter’s suite of services empowers your sales team to operate efficiently, stay organized, and drive consistent growth.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeLeg}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="Services illustration"
        />
      </div>
    </section>
  );
};
