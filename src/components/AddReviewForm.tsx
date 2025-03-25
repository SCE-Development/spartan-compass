"use client"; // Ensures the component can use useState

import { useState } from "react";
import { submitReview } from "@/lib/actions/reviews";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useParams,useRouter } from "next/navigation";

export default function AddReviewForm() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  return (
    <div className="fixed bottom-4 right-4">
      {/* ✅ Redirects to new page when clicked */}
      <button
        onClick={() => router.push(`/add-review?courseID=${courseId}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Add Review
      </button>
    </div>
  );
}