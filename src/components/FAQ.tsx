import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  interface FAQProps {
    question: string;
    answer: string;
    value: string;
  }
  
  const FAQList: FAQProps[] = [
    {
      question: "Is Leadhunter free to try?",
      answer: "Yes! We offer a Free plan for you to test out core functionalities.",
      value: "item-1",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Absolutely. You can adjust your subscription as your needs change, without long-term commitments.",
      value: "item-2",
    },
    {
      question: "How does Leadhunter ensure the quality of leads?",
      answer:
        "We use AI-driven insights and data verification to surface high-quality leads, reducing time spent on unqualified prospects.",
      value: "item-3",
    },
    {
      question: "Does Leadhunter integrate with my CRM?",
      answer:
        "Yes, we support popular CRM integrations, ensuring seamless data sync and streamlined workflows.",
      value: "item-4",
    },
    {
      question: "Is support available if I run into issues?",
      answer:
        "We offer email support on our Free plan and priority support on paid plans. You can also access community resources.",
      value: "item-5",
    },
  ];
  
  export const FAQ = () => {
    return (
      <section
        id="faq"
        className="container py-24 sm:py-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Questions
          </span>
        </h2>
  
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {FAQList.map(({ question, answer, value }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
              className="bg-white border border-gray-200 rounded-lg mb-2 transition-colors"
            >
              <AccordionTrigger className="text-left px-4 py-2 rounded-t-lg bg-white hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
                {question}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4 py-2 rounded-b-lg">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
  
        <h3 className="font-medium mt-4">
          Still have questions?{" "}
          <a
            rel="noreferrer noopener"
            href="#"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact us
          </a>
        </h3>
      </section>
    );
  };
  