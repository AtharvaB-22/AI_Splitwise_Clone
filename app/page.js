import { FEATURES, ICONS, STEPS } from "@/lib/Landing";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col pt-16">
      <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Split expenses. Simplify life.
          </Badge>

          <h1 className="gradient-title mx-auto max-w-4xl text-4xl font-bold md:text-7xl">
            The smartest way to split expenses with friends
          </h1>

          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Track shared expenses, split bills effortlessly, and settle up
            quickly. Never worry about who owes who again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size={"lg"}
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[16/9] ">
            <Image
              src="/logos/hero.png"
              width={1280}
              height={720}
              alt="Splitr Hero Image"
              className="rounded-lg mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Features
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Everything you need to split expenses
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Our platform provides all the tools you need to handle shared
            expenses with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {FEATURES.map((feature, index) => {
              const Icon = ICONS[feature.icon]; // Dynamically get the icon
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg ${feature.bg} shadow-md`}
                >
                  <div className={`text-4xl ${feature.color}`}>
                    <Icon />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-gray-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-teal-100 text-teal-700">
            How It Works
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Splitting expenses has never been easier
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Follow these easy steps to start splitting expenses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  step.label === "2" ? "bg-green-100" : "bg-teal-100"
                } shadow-md`}
              >
                <div
                  className={`text-4xl ${
                    step.label === "2" ? "text-green-600" : "text-teal-600"
                  } font-bold`}
                >
                  {step.label}
                </div>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-gradient-to-r from-green-500 to-teal-500 py-20 text-center text-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to simplify expense sharing?
          </h2>
          <p className="mt-4 text-lg md:text-xl">
            Join thousands of users who have made splitting expenses stress-free.
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg shadow-md"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm">
            All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}