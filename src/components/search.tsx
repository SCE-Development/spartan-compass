'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CourseResult } from '@/app/page';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Calendar, BookOpen, Hash, Rocket, Compass, Check, ChevronDown } from 'lucide-react';
import SmartSearch from './smart-search';

export default function Search({ result }: { result: CourseResult[] }) {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
  const [open, setOpen] = useState([false, false, false]);
  const router = useRouter();

  const semesters = useMemo(() => {
    return Array.from(
      new Set(
        result.map((course) => course.semester.replace('-', ' ').toUpperCase()),
      ),
    )
      .sort((a, b) => {
        const monthPriority: Record<string, number> = {
          SPRING: 0,
          SUMMER: 1,
          FALL: 2,
          WINTER: 3,
        };
        return monthPriority[a.split(' ')[0]] - monthPriority[b.split(' ')[0]];
      })
      .sort((a, b) => a.split(' ')[1].localeCompare(b.split(' ')[1]));
  }, [result]);

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        result
          .filter(
            (course) =>
              course.semester ===
              selectedSemester.replace(' ', '-').toLowerCase(),
          )
          .map((course) => course.subject),
      ),
    );
  }, [result, selectedSemester]);

  const courseNumbers = useMemo(() => {
    return Array.from(
      new Set(
        result
          .filter(
            (course) =>
              course.semester ===
                selectedSemester.replace(' ', '-').toLowerCase() &&
              (!selectedSubject || course.subject === selectedSubject),
          )
          .map((course) => course.courseNumber),
      ),
    ).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);

      if (numA !== numB) {
        return numA - numB;
      } else {
        return a.localeCompare(b);
      }
    });
  }, [result, selectedSemester, selectedSubject]);

  // const handleSemesterChange = useCallback((value: string) => {
  //   setSelectedSemester(value);
  //   setSelectedSubject('');
  //   setSelectedCourseNumber('');
  // }, []);

  // const handleSubjectChange = useCallback((value: string) => {
  //   setSelectedSubject(value);
  //   setSelectedCourseNumber('');
  // }, []);

  const handleSubmit = useCallback(() => {
    // to handle our search, we'll redirect to the course page with the corresponding id
    if (selectedSemester && selectedSubject && selectedCourseNumber) {
      const selectedCourse = result.find(
        (course) =>
          course.semester ===
            selectedSemester.replace(' ', '-').toLowerCase() &&
          course.subject === selectedSubject &&
          course.courseNumber === selectedCourseNumber,
      );
      if (selectedCourse) {
        router.push(`/courses/${selectedCourse.id}`);
      }
    }
  }, [selectedSemester, selectedSubject, selectedCourseNumber, result, router]);

  const SelectSearch = ({ className }: { className?: string }) => (
    <>
      <Input
        type="search"
        placeholder="Search..."
        className={cn('px-8', className)}
      />
      <SelectSeparator />
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-[75vh]">
      <div className="mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 flex-col md:flex-row">
          {/* <Select onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
              <Calendar className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
              <SelectValue placeholder="Select a semester" />
            </SelectTrigger>
            <SelectContent className="w-48 md:w-56">
              <SelectGroup>
                <SelectLabel>Semesters</SelectLabel>
                
                {semesters.map((semester) => (
                  <SelectItem
                    key={semester}
                    value={semester}
                    className="w-[11.4rem] md:w-[13.4rem]"
                  >
                    {semester}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}

          {/* <Select
            onValueChange={handleSubjectChange}
            disabled={!selectedSemester}
          >
            <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
              <BookOpen className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent className="w-48 md:w-56">
              <SelectGroup>
                <SelectLabel>Subjects</SelectLabel>
                
                {subjects.map((subject) => (
                  <SelectItem
                    key={subject}
                    value={subject}
                    className="w-[11.4rem] md:w-[13.4rem]"
                  >
                    {subject}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}

          {/* <Select
            onValueChange={setSelectedCourseNumber}
            disabled={!selectedSemester || !selectedSubject}
            value={selectedCourseNumber}
          >
            <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
              <Hash className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
              <SelectValue placeholder="Select a course number" />
            </SelectTrigger>
            <SelectContent className="w-48 md:w-56">
              <SelectGroup>
                <SelectLabel>Course Numbers</SelectLabel>
                <SelectSearch className="h-[36px] w-[11.4rem] md:w-[13.4rem]" />
                {courseNumbers.map((number) => (
                  <SelectItem
                    key={number}
                    value={number.toString()}
                    className="w-[11.4rem] md:w-[13.4rem]"
                  >
                    {number}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}

          <Popover open={open[0]} onOpenChange={(openthis) => setOpen([openthis, open[1], open[2]])}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open[0]}
                className="w-[200px] justify-between"
              >
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search course number..." />
                <CommandList>
                  <CommandEmpty>No course numbers found.</CommandEmpty>
                  <CommandGroup>
                    {semesters.map((semester) => (
                      <CommandItem
                        key={semester}
                        value={semester}
                        onSelect={(currentValue) => {
                          setSelectedSemester(currentValue === selectedSemester ? "" : currentValue)
                          setOpen([false, open[1], open[2]])
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSemester === semester ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {semester}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={open[1]} onOpenChange={(openthis) => setOpen([open[0], openthis, open[2]])}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open[1]}
                className="w-[200px] justify-between"
              >
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search course number..." />
                <CommandList>
                  <CommandEmpty>No subjects found.</CommandEmpty>
                  <CommandGroup>
                    {subjects.map((subject) => (
                      <CommandItem
                        key={subject}
                        value={subject}
                        onSelect={(currentValue) => {
                          setSelectedSubject(currentValue === selectedSubject ? "" : currentValue)
                          setOpen([open[0], false, open[2]])
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSubject === subject ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {subject}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={open[2]} onOpenChange={(openthis) => setOpen([open[0], open[1], openthis])}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open[2]}
                className="w-[200px] justify-between"
              >
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search course number..." />
                <CommandList>
                  <CommandEmpty>No course numbers found.</CommandEmpty>
                  <CommandGroup>
                    {courseNumbers.map((number) => (
                      <CommandItem
                        key={number}
                        value={number}
                        onSelect={(currentValue) => {
                          setSelectedCourseNumber(currentValue === selectedCourseNumber ? "" : currentValue)
                          setOpen([open[0], open[1], false])
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCourseNumber === number ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {number}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSubmit}
            disabled={
              !selectedSemester || !selectedSubject || !selectedCourseNumber
            }
            className="w-[100px] flex justify-between"
          >
            <Rocket className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
            Search
          </Button>
        </div>
      </div>
      <div className="py-10 flex items-center text-muted-foreground">
        <hr className="border w-24 md:w-48" />
        <Compass className="h-6 w-6" />
        <hr className="border w-24 md:w-48" />
      </div>
      <div className="mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-x-4 gap-y-4 flex-col md:flex-row">
          <SmartSearch type="full" />
        </div>
      </div>
    </div>
  );
}
