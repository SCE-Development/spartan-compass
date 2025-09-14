"use client";

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

export default function AddReviewForm() {
  // ...existing code from AddReviewPage...
  // Unique IDs for radio groups
  const yesId1 = useId();
  const noId1 = useId();
  const yesId2 = useId();
  const noId2 = useId();
  const yesId3 = useId();
  const noId3 = useId();
  const yesId4 = useId();
  const noId4 = useId();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const gradeOptions = [
    'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F',
    'Audit / No Grade', 'Drop / Withdrawal',
  ];
  const tags = [
    'Tough Grader', 'Get Ready To Read', 'Participation Matters', 'Extra Credit',
    'Group Projects', 'Amazing Lectures', 'Clear Grading Criteria', 'Gives Good Feedback',
    'Inspirational', 'Lots Of Homework', 'Hilarious', 'Beware Of Pop Quizzes',
    'So Many Papers', 'Caring', 'Respected', 'Lecture Heavy', 'Test Heavy',
    'Graded By Few Things', 'Accessible Outside Class', 'Online Savvy',
  ];

  const courseId = searchParams.get('courseID');

  const [selectedGrade, setSelectedGrade] = useState('Select Grade');
  const [selectedCourse, setSelectedCourse] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [courses, _setCourses] = useState<
    { id: number; title: string; subject: string; courseNumber: string }[]
  >([]);

  const [selectedTags, setSelectedTag] = useState<String[]>([]);
  const [open, setOpen] = useState(false); // to see if the tag is checked or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const response = await fetch('/api/session/validate');
      const { session } = await response.json();
      setIsLoggedIn(!!session);
    }
    checkSession();
  }, []);

  //can only add a review if the user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
    if (!courseId) {
      setSelectedCourse('Invalid Course');
      setLoading(false);
      return;
    }
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Failed to fetch course');
        const course = await res.json();
        setSelectedCourse(
          `${course.subject} ${course.courseNumber} - ${course.title}`,
        );
      } catch (error) {
        console.error('Error fetching course:', error);
        setSelectedCourse('Error Loading Course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleSelect = (tag: string | String) => {
    setSelectedTag((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 3
          ? [...prev, tag]
          : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!courseId) {
      alert('Invalid course ID.');
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID: Number(courseId), // match the API route param name
          professorId: 1, // you can make this dynamic later if needed
          rating,
          reviewText,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }
      alert('✅ Review submitted successfully!');
      router.push('/');
    } catch (error: any) {
      alert(`❌ ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="container mx-auto py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3x1 mx-auto flex flex-col space-y-6"
        >
          {/* Title */}
          <h1 className="text-3xl font-semibold text-center">
            Add Your Review
          </h1>
          {/* ...rest of the form code... */}
          {/* The rest of your form code from AddReviewPage goes here, unchanged. */}
          {/* ...existing code... */}
        </form>
      </div>
    </div>
  );
}
