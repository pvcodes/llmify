// import { Github } from "lucide-react";
import { Button } from "../ui/button";
// import { buttonVariants } from "../ui/button";
import { HeroCards } from "./HeroCards";
// import { GITHUB_REPO_URL } from "@/lib/constant";
import { signIn } from "next-auth/react";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              LLMs
            </span>{" "}
            under one
          </h1>{" "}
          <h2>
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              roof
            </span>{" "}
            together
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Access diverse LLMs effortlessly with all the tools you need for your project.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3" onClick={() => signIn()}>Get Started</Button>

          {/* <a
            rel="noreferrer noopener"
            href={GITHUB_REPO_URL}
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
            <Github className="ml-2 w-5 h-5" />
          </a> */}
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section >
  );
};
