import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { signIn } from "next-auth/react";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32 px-2"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Unleash the Power of
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Language Models{" "}
            </span>
            with Ease
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Effortlessly connect to diverse AI models and transform your projects with LLMify's seamless interface. Discover the future of AI-driven innovation today!
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button className="w-full md:mr-4 md:w-auto" onClick={() => signIn()} >No more scrolling, Get Started</Button>
          <Link
            // variant="outline"
            className={`w-full md:w-auto ${buttonVariants({
              variant: "outline",
            })}}`}
            href="#features"
          >
            View All Features
          </Link>
        </div>
      </div>
    </section>
  );
};