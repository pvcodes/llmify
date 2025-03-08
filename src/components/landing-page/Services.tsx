import { JSX } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import cubeLeg from "../../../public/assets/cube-leg.png";
import Image from "next/image";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Diverse Model Access",
    description:
      "Connect with a broad range of AI models to suit various project needs and maximize creativity.",
    icon: <ChartIcon />,
  },
  {
    title: "Effortless Integration",
    description:
      "Quickly integrate your projects using personal API keys or our global key for a streamlined experience.",
    icon: <WalletIcon />,
  },
  {
    title: "Enhanced Productivity",
    description:
      "Boost efficiency by automating repetitive tasks with AI-driven solutions tailored to your workflow.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              LLMify{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Elevate your projects with AI-powered capabilities and seamless integration tailored to your needs.
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

        <Image
          src={cubeLeg}
          alt="About services"
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
        />
      </div>
    </section>
  );
};