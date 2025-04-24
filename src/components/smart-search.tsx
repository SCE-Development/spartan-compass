"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import smartSearch from "@/app/actions";
import { cn } from "@/lib/utils";
import { Course, Professor } from "@/lib/db/schema";

// Updated SearchResult type to handle combined results
export type SearchResult =
  | {
      type: "combined";
      data: {
        courses: Course[];
        professors: Professor[];
      };
    }
  | {
      type: "none";
      data: [];
    }
  | {
      type: "empty";
      data: [];
    };

export default function SmartSearch({ type }: { type: "full" | "half" }) {
  const [result, setResult] = useState<SearchResult | null>(null);

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    return smartSearch(e.target.value).then((res) => {
      console.log(res);
      setResult(res);
    });
  }

  function handleClick(id: number, resultType: "course" | "professor") {
    const basePath = resultType === "course" ? "/courses/" : "/professors/";
    window.location.href = basePath + id;
  }

  return (
    <div className="ml-auto flex-initial">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
        <Input
          type="search"
          placeholder={`Search ${type === "full" ? "for courses and professors" : ""}`}
          className={cn(
            "pl-8",
            type === "full"
              ? "w-[300px] md:w-[440px]"
              : "w-[120px] md:w-[200px]",
          )}
          onChange={(e) => handleQueryChange(e)}
        />
        {result && result.type !== "empty" && (
          <div className="absolute mt-2 w-full rounded-md border bg-background">
            {result.type === "combined" && (
              <>
                {result.data.courses.length > 0 && (
                  <div>
                    <h3 className="p-2 font-bold">Courses</h3>
                    {result.data.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-2 cursor-pointer hover:bg-primary"
                        onClick={() => handleClick(course.id, "course")}
                      >
                        <p
                          className={cn(type === "half" ? "text-sm" : "")}
                        >{`${course.subject} ${course.courseNumber} - ${course.title}`}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.data.professors.length > 0 && (
                  <div>
                    <h3 className="p-2 font-bold">Professors</h3>
                    {result.data.professors.map((professor) => (
                      <div
                        key={professor.id}
                        className="p-2 cursor-pointer hover:bg-primary"
                        onClick={() => handleClick(professor.id, "professor")}
                      >
                        <p
                          className={cn(type === "half" ? "text-sm" : "")}
                        >{`${professor.name} - ${professor.department}`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {result.type === "none" && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
