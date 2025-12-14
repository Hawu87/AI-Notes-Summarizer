import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Navigation } from "@/components/navigation";
import { HowItWorks } from "@/components/how-it-works";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroGeometric
        badge="AI Note Summarizer"
        title1="Turn messy notes"
        title2="into clear summaries"
        description="Paste long text and get a clean summary + bullet points in seconds."
      >
        <Button size="lg" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/signup">Create account</Link>
        </Button>
      </HeroGeometric>

      {/* How it works section */}
      <HowItWorks />
    </div>
  );
}
