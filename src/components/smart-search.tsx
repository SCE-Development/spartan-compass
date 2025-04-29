"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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

export default function SmartSearch({
  type,
}: {
  type: "page" | "full" | "half";
}) {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    return smartSearch(value).then((res) => {
      setResult(res);
    });
  }

  function handlePageQueryChange(term: string) {
    setInputValue(term);
    return smartSearch(term).then((res) => {
      setResult(res);
    });
  }

  function handleClick(id: number, resultType: "course" | "professor") {
    const basePath = resultType === "course" ? "/courses/" : "/professors/";
    window.location.href = basePath + id;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector(
      "input[type='search']",
    ) as HTMLInputElement;
    if (input) {
      window.location.href = "/search?query=" + input.value;
    }
  }

  useEffect(() => {
    // Extract query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    if (query) {
      setInputValue(query);
      handlePageQueryChange(query);
    }
  }, []);

  return (
    <div className="ml-auto flex-initial">
      <div className="relative">
        <form onSubmit={(e) => handleSubmit(e)}>
          <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
          <Input
            type="search"
            value={inputValue}
            placeholder={`Search ${type === "full" || type === "page" ? "for courses and professors" : ""}`}
            className={cn(
              "pl-8",
              type === "page"
                ? "w-[400px] md:w-[1000px]"
                : type === "full"
                  ? "w-[300px] md:w-[440px]"
                  : "w-[120px] md:w-[200px]",
            )}
            onChange={(e) => handleQueryChange(e)}
          />
        </form>

        {result && result.type !== "empty" && (
          <div
            className={cn(
              "absolute mt-2 w-full rounded-md bg-background",
              type === "page" ? "" : "border max-h-96 overflow-auto",
            )}
          >
            {type === "page" && <br />}

            {result.type === "combined" && (
              <>
                {result.data.courses.length > 0 && (
                  <div>
                    <h3
                      className={cn(
                        "font-bold p-2",
                        type === "page"
                          ? "text-xl"
                          : type === "full"
                            ? "text-md"
                            : "text-sm",
                      )}
                    >
                      Courses
                    </h3>
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
                {type === "page" && <br />}
                {result.data.professors.length > 0 && (
                  <div>
                    <h3
                      className={cn(
                        "font-bold p-2",
                        type === "page"
                          ? "text-xl"
                          : type === "full"
                            ? "text-md"
                            : "text-sm",
                      )}
                    >
                      Professors
                    </h3>
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
