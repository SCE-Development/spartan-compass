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

export default function Search({ result }: { result: CourseResult[] }) {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourseNumber, setSelectedCourseNumber] = useState("");

  const router = useRouter();

  const semesters = useMemo(() => {
    return Array.from(new Set(result.map((course) => course.semester.split('-')[0] + " " + course.semester.split('-')[1])));
  }, [result]);

  const subjects = useMemo(() => {
    //return Array.from(new Set(result.map((course) => course.subject)));
    return Array.from(new Set(result.filter((course) => course.semester === selectedSemester.replace(' ', '-')).map((course) => course.subject)));
  }, [result, selectedSemester]);

  const courseNumbers = useMemo(() => {
    return Array.from(
      new Set(
        result
          .filter(
            (course) => !selectedSubject || course.subject === selectedSubject,
          )
          .map((course) => course.courseNumber),
      ),
    );
  }, [result, selectedSubject]);

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
    if (selectedSubject && selectedCourseNumber) {
      const selectedCourse = result.find(
        (course) =>
          course.subject === selectedSubject &&
          course.courseNumber === selectedCourseNumber,
      );
      if (selectedCourse) {
        router.push(`/courses/${selectedCourse.id}`);
      }
    }
  }, [selectedSubject, selectedCourseNumber, result, router]);

  return (
    <div className="container mx-auto h-[75vh] flex flex-col items-center justify-center">
      <div className="flex items-center justify-center p-10">
        <h1 className="text-3xl font-bold">Select a class:</h1>
      </div>
      <div className="flex flex-row items-center space-x-4">
      <Select
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger className="w-[200px] dark:border-white/30 border-black/30">
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semester</SelectLabel>
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
          <SelectTrigger className="w-[200px] dark:border-white/30 border-black/30 ">
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
          disabled={!selectedSubject}
          value={selectedCourseNumber}
        >
          <SelectTrigger className="w-[200px] dark:border-white/30 border-black/30">
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
          disabled={!selectedSubject || !selectedCourseNumber}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
