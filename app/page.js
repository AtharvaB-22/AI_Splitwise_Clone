import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


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
            Track shared expenses, split bills effortlessly, and settle up quickly. Never worry about who owes who again.
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
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <div>

          </div>
        </div>
      </section>
    </div>
  );
}