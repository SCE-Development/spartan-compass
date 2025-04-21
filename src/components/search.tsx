"use client";

import { useState, useMemo, useCallback } from "react";
import { CourseResult } from "@/app/page";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSearch
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, BookOpen, Hash, Rocket, SearchIcon, Compass } from "lucide-react";

export default function Search({ result }: { result: CourseResult[] }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourseNumber, setSelectedCourseNumber] = useState("");
  const [selectSearch, setSelectSearch] = useState("");

  const router = useRouter();

  const semesters = useMemo(() => {
    return Array.from(
      new Set(
        result
        .map((course) => course.semester.replace('-', ' ').toUpperCase())
      ))
      .sort((a, b) => {
        const monthPriority: Record<string, number> = {
          "SPRING": 0,
          "SUMMER": 1,
          "FALL": 2,
          "WINTER": 3
        };
        return monthPriority[a.split(' ')[0]] - monthPriority[b.split(' ')[0]];
      })
      .sort((a, b) => a.split(' ')[1].localeCompare(b.split(' ')[1]));
  }, [result]);

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        result
        .filter((course) => course.semester === selectedSemester.replace(' ', '-').toLowerCase())
        .map((course) => course.subject)
      ));
  }, [result, selectedSemester]);

  const courseNumbers = useMemo(() => {
    return Array.from(
      new Set(
        result
        .filter((course) => course.semester === selectedSemester.replace(' ', '-').toLowerCase() && (!selectedSubject || course.subject === selectedSubject))
        .map((course) => course.courseNumber)
      )
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

  const handleSemesterChange = useCallback((value: string) => {
    setSelectedSemester(value);
    setSelectedSubject("");
    setSelectedCourseNumber("");
  }, []);

  const handleSubjectChange = useCallback((value: string) => {
    setSelectedSubject(value);
    setSelectedCourseNumber("");
  }, []);

  const handleSelectSearch = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSelectSearch(e.currentTarget.value);
  }, []);

  const handleResetSelectSearch = useCallback((event?: Event) => {
    if (event) setSelectSearch("");
  }, []);

  const handleSubmit = useCallback(() => {
    // to handle our search, we'll redirect to the course page with the corresponding id
    if (selectedSemester && selectedSubject && selectedCourseNumber) {
      const selectedCourse = result.find(
        (course) =>
          course.semester === selectedSemester.replace(' ', '-').toLowerCase() &&
          course.subject === selectedSubject &&
          course.courseNumber === selectedCourseNumber
      );
      if (selectedCourse) {
        router.push(`/courses/${selectedCourse.id}`);
      }
    }
  }, [selectedSemester, selectedSubject, selectedCourseNumber, result, router]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[75vh]">
    <div className="mx-auto flex flex-col items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 flex-col md:flex-row">
      <Select
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
            <Calendar className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent className="w-48 md:w-56" onCloseAutoFocus={handleResetSelectSearch}>
            <SelectGroup>
              <SelectLabel>Semesters</SelectLabel>
              <SelectSearch className="h-[36px] w-[11.4rem] md:w-[13.4rem]" onChange={handleSelectSearch} />
              {(!selectSearch) ?
                semesters.map((semester) => (
                  <SelectItem key={semester} value={semester} className="w-[11.4rem] md:w-[13.4rem]">
                    {semester}
                  </SelectItem>
                ))
              :
                semesters.filter((semester) => semester.toLowerCase().includes(selectSearch.toLowerCase())).map((semester) => (
                  <SelectItem key={semester} value={semester} className="w-[11.4rem] md:w-[13.4rem]">
                    {semester}
                  </SelectItem>
                ))
              }

            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
            onValueChange={handleSubjectChange}
            disabled={!selectedSemester}
        >
          <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
            <BookOpen className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent className="w-48 md:w-56" onCloseAutoFocus={handleResetSelectSearch}>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              <SelectSearch className="h-[36px] w-[11.4rem] md:w-[13.4rem]" onChange={handleSelectSearch} />
              {(!selectSearch) ? 
                subjects.map((subject) => (
                  <SelectItem key={subject} value={subject} className="w-[11.4rem] md:w-[13.4rem]">
                    {subject}
                  </SelectItem>
                ))
              :
                subjects.filter((subject) => subject.toLowerCase().includes(selectSearch.toLowerCase())).map((subject) => (
                  <SelectItem key={subject} value={subject} className="w-[11.4rem] md:w-[13.4rem]">
                    {subject}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={setSelectedCourseNumber}
          disabled={!selectedSemester || !selectedSubject}
          value={selectedCourseNumber}
        >
          <SelectTrigger className="w-48 md:w-56 dark:border-white/30 border-black/30 text-start">
            <Hash className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a course number" />
          </SelectTrigger>
          <SelectContent className="w-48 md:w-56" onCloseAutoFocus={handleResetSelectSearch}>
            <SelectGroup>
              <SelectLabel>Course Numbers</SelectLabel>
              <SelectSearch className="h-[36px] w-[11.4rem] md:w-[13.4rem]" onChange={handleSelectSearch} />
              {(!selectSearch) ?
                courseNumbers.map((number) => (
                  <SelectItem key={number} value={number.toString()} className="w-[11.4rem] md:w-[13.4rem]">
                    {number}
                  </SelectItem>
                ))
              :
                courseNumbers.filter((number) => number.toString().includes(selectSearch)).map((number) => (
                  <SelectItem key={number} value={number.toString()} className="w-[11.4rem] md:w-[13.4rem]">
                    {number}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={!selectedSemester || !selectedSubject || !selectedCourseNumber}
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
        <form className="ml-auto flex-initial dark:border-white/30 border-black/30">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-0 bottom-0 m-auto h-4 w-4" />
            <Input type="search" placeholder="Search for courses and professors..." className="pl-8 w-[300px] md:w-[440px] dark:border-white/30 border-black/30" />
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
