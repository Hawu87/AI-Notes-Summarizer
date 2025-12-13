import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Navigation } from "@/components/navigation";
import { HowItWorks } from "@/components/how-it-works";

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
      />

      {/* How it works section */}
      <HowItWorks />
    </div>
  );
}
