"use client";

import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      )}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating.toFixed(1)} / 5
      </span>
    </div>
  );
}
