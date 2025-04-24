"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import smartSearch from "@/app/actions";
import { cn } from "@/lib/utils";
import { Course } from "@/lib/db/schema";

export default function SmartSearch({ type }: { type: "full" | "half" }) {
  const [result, setResult] = useState<Course[]>([]);

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    return smartSearch(e.target.value).then((res) => {
      console.log(res);
      setResult(res);
    });
  }

  function handleClick(courseId: number) {
    window.location.href = "/courses/" + courseId;
  }

  return (
    <div className="ml-auto flex-initial">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
        <Input
          type="search"
          placeholder={`Search ${type === "full" ? "Courses and Professors" : ""}`}
          className={cn(
            "pl-8",
            type === "full"
              ? "w-[300px] md:w-[440px]"
              : "w-[120px] md:w-[200px]",
          )}
          onChange={(e) => handleQueryChange(e)}
        />
        {result.length > 0 && (
          <div className="absolute mt-2 w-full rounded-md border bg-background">
            {result.map((course) => (
              <div
                key={course.id}
                className=" p-2 cursor-pointer hover:bg-primary"
                onClick={() => handleClick(course.id)}
              >
                <p
                  className={cn(type === "half" ? "text-sm" : "")}
                >{`${course.subject} ${course.courseNumber} - ${course.title}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
