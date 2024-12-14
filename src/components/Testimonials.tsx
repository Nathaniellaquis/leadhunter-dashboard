import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=15",
    name: "Sarah Thompson",
    userName: "@sarah_sells",
    comment: "Leadhunter revolutionized how we find and engage prospects. Highly recommended!",
  },
  {
    image: "https://i.pravatar.cc/150?img=12",
    name: "Mark Rodriguez",
    userName: "@mark_growth",
    comment:
      "The AI-driven insights helped us focus on quality leads rather than chasing empty prospects. Our conversions soared.",
  },
  {
    image: "https://i.pravatar.cc/150?img=45",
    name: "Emily Parker",
    userName: "@emily_leads",
    comment:
      "I love how streamlined the outreach process is now. Automations saved us countless hours!",
  },
  {
    image: "https://i.pravatar.cc/150?img=32",
    name: "Michael Chen",
    userName: "@mike_close",
    comment:
      "Leadhunter’s integrations fit perfectly into our existing CRM. We ramped up our sales process with minimal effort.",
  },
  {
    image: "https://i.pravatar.cc/150?img=23",
    name: "Lisa Kim",
    userName: "@lisa_convert",
    comment:
      "We’ve seen a 30% increase in qualified leads since using Leadhunter. The data insights are a game-changer.",
  },
  {
    image: "https://i.pravatar.cc/150?img=28",
    name: "Ravi Singh",
    userName: "@ravi_revenue",
    comment:
      "From discovery to conversion, Leadhunter streamlined every step. Couldn’t imagine prospecting without it now!",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        See Why{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Customers Love
        </span>{" "}
        Leadhunter
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Hear directly from the businesses that have transformed their sales pipelines with our platform.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2 lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt={`${name}'s avatar`}
                    src={image}
                  />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
