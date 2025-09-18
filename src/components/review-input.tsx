'use client';

import { Star } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import type { CourseResult } from '@/app/review/page';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function Search({ result }: { result: CourseResult[] }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const professors = result.map((item) => ({
    id: item.professorId,
    name: item.professorName,
  }));

  // Filter unique professors based on professor ID
  const uniqueProfessors = Array.from(
    new Set(professors.map((prof) => prof.id)),
  ).map((id) => professors.find((prof) => prof.id === id));

  const professorId = useId();
  const courseId = useId();
  const reviewId = useId();

  useEffect(() => {
    if (selectedProfessor) {
      const courses = result
        .filter((item) => item.professorId === Number(selectedProfessor))
        .map((item) => ({
          displayName: `${item.courseSubject} ${item.courseNumber}`,
          id: item.courseId,
        }));
      setFilteredCourses(courses);
    } else {
      setFilteredCourses([]);
    }
  }, [selectedProfessor, result]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ rating, review, selectedProfessor, selectedCourse });
  }

  return (
    <Card className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 dark:border-white/20 border-black/20 shadow-lg mx-auto">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form className="space-y-3">
          <div className="flex gap-2 w-full">
            <div className="space-y-2">
              <Label htmlFor={professorId}>Professor</Label>
              <Select
                value={selectedProfessor}
                onValueChange={setSelectedProfessor}
              >
                <SelectTrigger id={professorId}>
                  <SelectValue placeholder="Select a professor" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueProfessors.map((professor) => (
                    <SelectItem
                      value={String(professor?.id) || ''}
                      key={professor?.id || ''}
                    >
                      {professor?.name || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={courseId}>Course</Label>
              <Select
                disabled={!selectedProfessor}
                value={selectedCourse}
                onValueChange={setSelectedCourse}
              >
                <SelectTrigger id={courseId}>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map((course) => (
                    <SelectItem
                      value={String(course?.id) || ''}
                      key={course.id}
                    >
                      {course.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={reviewId}>Review</Label>
            <Textarea
              id={reviewId}
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 500))}
              placeholder="Write your review here..."
              className="h-32"
            />
            <p className="text-sm text-gray-500">
              {review.length}/500 characters
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end px-4 sm:px-6">
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full sm:w-auto"
        >
          Add Review
        </Button>
      </CardFooter>
    </Card>
  );
}
