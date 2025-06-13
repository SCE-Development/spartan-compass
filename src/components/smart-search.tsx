'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import smartSearch from '@/app/actions';
import { cn } from '@/lib/utils';
import { Course, Professor } from '@/lib/db/schema';
import Link from 'next/link';
import { addBasePath } from 'next/dist/client/add-base-path';

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

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    updateResult(value);
  }

  useEffect(() => {
    // Extract query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
      updateResult(query);
    }
  }, []);

  return (
    <div className="ml-auto flex-initial">
      <div className="relative">
        {/*TODO: change to Form component when upgrading to next 15*/}
        {/*https://nextjs.org/docs/app/api-reference/components/form*/}
        <form method="get" action={addBasePath('/search')}>
          <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
          <Input
            type="search"
            name="query"
            value={inputValue}
            placeholder={`Search ${type === 'full' || type === 'page' ? 'for courses and professors' : ''}`}
            className={cn(
              'pl-8',
              type === 'page'
                ? 'w-[400px] md:w-[1000px]'
                : type === 'full'
                  ? 'w-[300px] md:w-[440px]'
                  : 'w-[120px] md:w-[200px]',
            )}
            onChange={handleQueryChange}
          />
        </form>

        {result && result.type !== 'empty' && (
          <div
            className={cn(
              'absolute mt-2 w-full rounded-md bg-background',
              type === 'page' ? '' : 'border max-h-96 overflow-auto',
            )}
          >
            {type === 'page' && <br />}

            {result.type === 'combined' && (
              <div className='p-1'>
                {result.data.courses.length > 0 && (
                  <div>
                    <h3
                      className={cn(
                        'font-bold p-2',
                        type === 'page'
                          ? 'text-xl'
                          : type === 'full'
                            ? 'text-md'
                            : 'text-sm',
                      )}
                    >
                      Courses
                    </h3>
                    {result.data.courses.map((course) => (
                      <Link key={course.id} href={`/courses/${course.id}`}>
                        <div className="hover:bg-accent rounded-sm px-2 py-1.5">
                          <p className={cn(type === 'half' ? 'text-sm' : '')}>
                            {`${course.subject} ${course.courseNumber} - ${course.title}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {type === 'page' && <br />}
                {result.data.professors.length > 0 && (
                  <div>
                    <h3
                      className={cn(
                        'font-bold p-2',
                        type === 'page'
                          ? 'text-xl'
                          : type === 'full'
                            ? 'text-md'
                            : 'text-sm',
                      )}
                    >
                      Professors
                    </h3>
                    {result.data.professors.map((professor) => (
                      <Link key={professor.id} href={`/professors/${professor.id}`}>
                        <div className="hover:bg-accent rounded-sm px-2 py-1.5">
                          <p className={cn(type === 'half' ? 'text-sm' : '')}>
                            {`${professor.name} - ${professor.department}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {result.type === 'none' && (
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
