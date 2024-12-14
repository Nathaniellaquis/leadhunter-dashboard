import React from "react";
import pilot from "@/assets/pilot.png";
import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center">
          <img
            src={pilot}
            alt="Leadhunter Pilot"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Leadhunter
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Leadhunter is a powerful lead generation platform designed to help you discover, engage, 
                and convert prospects with unprecedented efficiency. Harness our extensive data sources, 
                intelligent filtering tools, and customizable workflows to supercharge your sales pipeline.
              </p>
            </div>
            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
