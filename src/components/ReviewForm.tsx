import { useState } from "react";
import { Button } from "@/components/ui/button";

type Rating = "Skip" | "Timepass" | "Go for it" | "Perfection";

interface ReviewFormProps {
  onSubmit: (rating: Rating, review: string) => void;
  username?: string;
}

const ratingEmoji: Record<Rating, string> = {
  Skip: "👎",
  Timepass: "😐",
  "Go for it": "👍",
  Perfection: "🤩",
};

const ReviewForm = ({ onSubmit, username }: ReviewFormProps) => {
  const [selected, setSelected] = useState<Rating | null>(null);
  const [review, setReview] = useState("");

  const ratings: Rating[] = ["Skip", "Timepass", "Go for it", "Perfection"];

  const ratingColors: Record<Rating, string> = {
    Skip: "bg-meter-skip text-foreground border-meter-skip",
    Timepass: "bg-meter-timepass text-background border-meter-timepass",
    "Go for it": "bg-meter-goforit text-foreground border-meter-goforit",
    Perfection: "bg-accent text-accent-foreground border-accent",
  };

  const displayName = username || "Guest";
  const initial = displayName[0]?.toUpperCase() || "G";

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {initial}
        </div>
        <span className="text-foreground font-medium">@{displayName}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-3">How did this movie make you feel?</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {ratings.map((r) => (
          <button
            key={r}
            onClick={() => setSelected(r)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              selected === r
                ? ratingColors[r]
                : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
            }`}
          >
            <span className="mr-1.5">{ratingEmoji[r]}</span>
            {r}
          </button>
        ))}
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
