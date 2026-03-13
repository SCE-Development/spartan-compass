'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import smartSearch from '@/app/actions';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import type { Course, Professor } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

// Updated SearchResult type to handle combined results
export type SearchResult =
  | {
      type: 'combined';
      data: {
        courses: Course[];
        professors: Professor[];
      };
    }
  | {
      type: 'none';
      data: [];
    }
  | {
      type: 'empty';
      data: [];
    };

export default function SmartSearch({
  type,
}: {
  type: 'page' | 'full' | 'half';
}) {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  async function updateResult(value: string) {
    const result = await smartSearch(value);
    setResult(result);
  }

  function handleInputChange(value: string) {
    setInputValue(value);
  }

  useEffect(() => {
    // Extract query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
      updateResult(query);
    }
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      updateResult(inputValue);
      console.log('Fetching data...');
    }, 300);
    return () => clearTimeout(getData);
  }, [inputValue]);

  return (
    <div className="ml-auto flex-initial">
      <div
        className={cn(
          'relative rounded-lg border shadow-md',
          type === 'page'
            ? 'w-[400px] md:w-[1000px]'
            : type === 'full'
              ? 'w-[300px] md:w-[440px]'
              : 'w-[120px] md:w-[200px]',
        )}
      >
        <Command>
          <CommandInput
            placeholder={`Search ${type === 'full' || type === 'page' ? 'for courses and professors' : ''}`}
            value={inputValue}
            onValueChange={handleInputChange}
            className="h-8 bg-popover"
          />
          <CommandList
            className={cn(
              'absolute w-full rounded-md bg-background border',
              type === 'half' ? 'mt-12' : 'mt-[40px]',
            )}
          >
            {result && result.type === 'combined' && (
              <>
                {result.data.courses.length > 0 && (
                  <CommandGroup heading="Courses">
                    {result.data.courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        passHref
                      >
                        <CommandItem
                          className={cn(
                            'pl-2',
                            type === 'half' ? 'text-sm' : '',
                          )}
                        >
                          {`${course.subject} ${course.courseNumber} - ${course.title} | ${course.classNumber}`}
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                )}
                {result.data.courses.length > 0 &&
                  result.data.professors.length > 0 && <CommandSeparator />}
                {result.data.professors.length > 0 && (
                  <CommandGroup heading="Professors">
                    {result.data.professors.map((professor) => (
                      <Link
                        key={professor.id}
                        href={`/professors/${professor.id}`}
                        passHref
                      >
                        <CommandItem
                          className={cn(
                            'pl-2',
                            type === 'half' ? 'text-sm' : '',
                          )}
                        >
                          {`${professor.name} - ${professor.department}`}
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
