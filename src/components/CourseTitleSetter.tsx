// app/components/CourseTitleSetter.tsx
"use client";

import { useEffect } from "react";

export default function CourseTitleSetter({
  courseTitle,
}: {
  courseTitle: string;
}) {
  useEffect(() => {
    document.title = `Spartan Compass | ${courseTitle}`;
  }, [courseTitle]);

  return null; // doesn't render anything
}