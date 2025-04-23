"use client";

import { Input } from "@/components/ui/input";
import { Search, SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";
import smartSearch from "@/app/actions";
import { usePathname } from "next/navigation";

export default function SmartSearch({ type }: { type: "full" | "half" }) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  const handleSearch = useCallback(() => {
    smartSearch(query);
  }, [query]);
  return (
    <>
      {type === "full" && (
        <form
          className="ml-auto flex-initial dark:border-white/30 border-black/30"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for courses and professors..."
              className="pl-8 w-[300px] md:w-[440px] "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />{" "}
          </div>
        </form>
      )}
      {type === "half" && pathname !== "/" && (
        <form
          className="ml-auto flex-initial"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-[120px] md:w-[200px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      )}
      {type === "half" && pathname === "/" && (
        <span className="ml-auto flex-initial"></span>
      )}
    </>
  );
}
