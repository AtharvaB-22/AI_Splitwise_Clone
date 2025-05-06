import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="flex justify-end mb-4">
        <ThemeToggle />
      </header>
      <main className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">AI Splitwise Clone</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Active</Badge>
              <span className="text-muted-foreground">Member since 2025</span>
            </div>
            <Input placeholder="Enter your name" />
            <Button>Save Profile</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}