import { useState } from "react";
import { Button } from "@/components/ui/button";

type Rating = "Skip" | "Timepass" | "Go for it" | "Perfection";

interface ReviewFormProps {
  onSubmit: (rating: Rating, review: string) => void;
}

const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [selected, setSelected] = useState<Rating | null>(null);
  const [review, setReview] = useState("");

  const ratings: Rating[] = ["Skip", "Timepass", "Go for it", "Perfection"];

  const ratingColors: Record<Rating, string> = {
    Skip: "bg-meter-skip",
    Timepass: "bg-meter-timepass text-background",
    "Go for it": "bg-meter-goforit",
    Perfection: "bg-accent",
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            U
          </div>
          <span className="text-foreground font-medium">@user</span>
        </div>

        <div className="flex gap-2">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selected === r
                  ? ratingColors[r]
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
        maxLength={1000}
        className="w-full bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-3 min-h-[80px]"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">{review.length}/1000</span>
        <Button
          onClick={() => selected && onSubmit(selected, review)}
          disabled={!selected}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
