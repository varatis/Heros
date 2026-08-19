import { Suspense } from "react";
import StoryPlayer from "@/components/story/StoryPlayer";
import { Loader2 } from "lucide-react";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <StoryPlayer storyId={id} />
    </Suspense>
  );
}
