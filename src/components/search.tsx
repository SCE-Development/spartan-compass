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
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, BookOpen, Hash, Rocket } from "lucide-react";

export default function Search({ result }: { result: CourseResult[] }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourseNumber, setSelectedCourseNumber] = useState("");

  const router = useRouter();

  addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && selectedSemester && selectedSubject && selectedCourseNumber) {
      event.preventDefault();
      handleSubmit();
    }
  });

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
    <div className="container mx-auto h-[75vh] flex flex-col items-center justify-center">
      <div className="flex items-center justify-center p-10 text-2xl md:text-3xl">
        <h1 className="font-bold">Select a class:</h1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 flex-col md:flex-row">
      <Select
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger className="w-[200px] md:w-[220px] dark:border-white/30 border-black/30">
            <Calendar className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semesters</SelectLabel>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
            onValueChange={handleSubjectChange}
            disabled={!selectedSemester}
        >
          <SelectTrigger className="w-[200px] md:w-[220px] dark:border-white/30 border-black/30 ">
            <BookOpen className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={setSelectedCourseNumber}
          disabled={!selectedSemester || !selectedSubject}
          value={selectedCourseNumber}
        >
          <SelectTrigger className="w-[200px] md:w-[220px] dark:border-white/30 border-black/30">
            <Hash className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
            <SelectValue placeholder="Select a course number" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Course Numbers</SelectLabel>
              {courseNumbers.map((number) => (
                <SelectItem key={number} value={number.toString()}>
                  {number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={!selectedSemester || !selectedSubject || !selectedCourseNumber}
          className="w-[100px] flex justify-between"
        >
          <Rocket className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
          Submit
        </Button>
      </div>
    </div>
  );
}
