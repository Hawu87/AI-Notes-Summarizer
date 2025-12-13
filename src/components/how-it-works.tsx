import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Save } from "lucide-react";

/**
 * How it works section component
 */
export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Paste or write a note",
      description: "Add your long-form text, notes, or content that needs summarizing.",
    },
    {
      icon: Sparkles,
      title: "Click Summarize",
      description: "Get an AI-powered summary with key bullet points in seconds.",
    },
    {
      icon: Save,
      title: "Save and revisit later",
      description: "All your summaries are saved and ready to access anytime.",
    },
  ];

  return (
    <section id="how" className="bg-white py-24 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Three simple steps to transform your notes
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="group border-zinc-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 focus-within:ring-2 focus-within:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-zinc-950/40 dark:focus-within:ring-zinc-600"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 transition-colors duration-300 group-hover:bg-black dark:bg-zinc-800 dark:group-hover:bg-white">
                    <Icon className="h-6 w-6 text-zinc-700 transition-colors duration-300 group-hover:text-white dark:text-zinc-300 dark:group-hover:text-black" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

