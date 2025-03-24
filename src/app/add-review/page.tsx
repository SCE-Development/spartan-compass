"use client";

import { useState, useEffect } from "react";
import { submitReview } from "@/lib/actions/reviews";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure cn function is imported


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from "@/components/ui/command";

import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddReviewPage() {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const gradeOptions = [
    "A+", "A", "A-",
    "B+", "B", "B-",
    "C+", "C", "C-",
    "D+", "D", "D-",
    "F", "Audit / No Grade", "Drop / Withdrawal"
  ];
  const tags = [
    "Tough Grader",
    "Get Ready To Read",
    "Participation Matters",
    "Extra Credit",
    "Group Projects",
    "Amazing Lectures",
    "Clear Grading Criteria",
    "Gives Good Feedback",
    "Inspirational",
    "Lots Of Homework",
    "Hilarious",
    "Beware Of Pop Quizzes",
    "So Many Papers",
    "Caring",
    "Respected",
    "Lecture Heavy",
    "Test Heavy",
    "Graded By Few Things",
    "Accessible Outside Class",
    "Online Savvy"
  ]

  const courseId = searchParams.get('courseID');
  


  const [selectedGrade, setSelectedGrade] = useState("Select Grade");
  const [selectedCourse, setSelectedCourse] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<
  { id: number; title: string; subject: string; courseNumber: string }[]
>([]);

  const [selectedTags, setSelectedTag] = useState<String[]>([]);
  const [open, setOpen] = useState(false); // to see if the tag is checked or not

  


  useEffect(() => {
    if (!courseId) {
      setSelectedCourse("Invalid Course");
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const course = await res.json();
          
        setSelectedCourse(
          `${course.subject} ${course.courseNumber} - ${course.title}`
        );
        document.title = `Spartan Compass | Add Review - ${course.subject} ${course.courseNumber}`
      } catch (error) {
        console.error("Error fetching course:", error);
        setSelectedCourse("Error Loading Course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);


  const handleSelect = (tag: string | String) => {
    setSelectedTag((prev) =>
    prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!courseId) {
      alert("Invalid course ID.");
      setIsSubmitting(false);
      return;
    }

    try {
      await submitReview(Number(courseId), rating, difficulty, reviewText);
      alert("Review submitted successfully");
      router.push("/");
    } catch (error) {
      alert("Failed to submit");
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
          <h1 className="text-3xl font-semibold text-center">Add Your Review</h1>

          {/* Select Course Code */}
          <div>
            <h2 className="text-lg font-medium">Selected Course Code</h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-200 px-3 py-2 rounded-md dark:bg-gray-700 mt-2">
                {loading ? "Loading..." : selectedCourse}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start" side="bottom">
                <DropdownMenuLabel>Choose Course</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {courses.length > 0 ? (
  courses.map((course) => (
    <DropdownMenuItem
      key={course.id}
      onClick={() =>
        setSelectedCourse(
          `${course.subject} ${course.courseNumber} - ${course.title}`
        )
      }
    >
      {course.subject} {course.courseNumber} - {course.title}
    </DropdownMenuItem>
  ))
) : (
  <DropdownMenuItem disabled>No courses available</DropdownMenuItem>
)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <br/>

          {/* Rate Your Professor */}
          <div>
  <h2 className="text-lg font-medium">Rate Your Professor</h2>
  <Slider
    value={[rating]}
    max={5}
    step={1}
    min={1}
    onValueChange={(val) => setRating(val[0])}
    className="mt-3"
  />
  <div className="relative w-full mt-2">
    <div className="absolute inset-x-0 flex justify-between text-gray-600 dark:text-gray-400 text-sm">
      {[1, 2, 3, 4, 5].map((val) => (
        <span key={val} className="w-8 text-center">{val === 1 ? "1 - Poor" : val === 3 ? "3 - Average" : val === 5 ? "5 -    Excellent   " : val}</span>
      ))}
    </div>
  </div>
  <br/>
  <br/>
  <p className="text-center mt-2 font-semibold">Selected: {rating}</p>
</div>

<br/>

{/* Difficulty Level */}
<div>
  <h2 className="text-lg font-medium">How difficult was this professor?</h2>
  <Slider
    value={[difficulty]}
    max={5}
    step={1}
    min={1}
    onValueChange={(val) => setDifficulty(val[0])}
    className="mt-3"
  />
  <div className="relative w-full mt-2">
    <div className="absolute inset-x-0 flex justify-between text-gray-600 dark:text-gray-400 text-sm">
      {[1, 2, 3, 4, 5].map((val) => (
        <span key={val} className="w-12 text-center">{val === 1 ? "1 - Very Easy" : val === 3 ? "3 - Average" : val === 5 ? "5 - Rocket Science Level" : val}</span>
      ))}
    </div>
  </div>
  <br/>
  <br/>
  
  <p className="text-center mt-2 font-semibold">Selected: {difficulty}</p>
</div>

          <br/>
          {/* Would You Take Again? */}
          <div>
            <h2 className="text-lg font-medium">Would you take this professor again?</h2>
            <RadioGroup defaultValue="yes" className="space-y-3 mt-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" />
                <label htmlFor="yes" className="text-md font-medium">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" />
                <label htmlFor="no" className="text-md font-medium">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>
          <br/>
          <div>
            <h2 className="text-lg font-medium">Was this class taken for credit?</h2>
            <RadioGroup defaultValue="yes" className="space-y-3 mt-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" />
                <label htmlFor="yes" className="text-md font-medium">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" />
                <label htmlFor="no" className="text-md font-medium">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>
          <br/>

          <div>
            <h2 className="text-lg font-medium">Did this professor use textbooks?</h2>
            <RadioGroup defaultValue="yes" className="space-y-3 mt-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" />
                <label htmlFor="yes" className="text-md font-medium">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" />
                <label htmlFor="no" className="text-md font-medium">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>
          <br/>

          <div>
            <h2 className="text-lg font-medium">Was attendance mandatory?</h2>
            <RadioGroup defaultValue="yes" className="space-y-3 mt-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" />
                <label htmlFor="yes" className="text-md font-medium">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" />
                <label htmlFor="no" className="text-md font-medium">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>
          <br/>
          {/* Select Grade */}

          <div>
      <h2 className="text-lg font-medium">Select grade received</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            className="w-full mt-2 justify-between bg-gray-300 dark:bg-gray-700 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {selectedGrade}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <Command>
            <CommandInput placeholder="Search grade..." />
            <CommandEmpty>No matching grade found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <div className="grid grid-cols-3 gap-2">
                  {gradeOptions.map((grade) => (
                    <CommandItem
                      key={grade}
                      onSelect={() => {
                        setSelectedGrade(grade);
                        setOpen(false);
                      }}
                      className="cursor-pointer flex items-center justify-between p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {grade}
                      {selectedGrade === grade && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
          <br/>
          
          <div className="flex flex-col gap-4">
      {/* Tag Buttons */}

      <h2 className="text-lg font-medium">Select up to 3 tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
        
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleSelect(tag)}
              className={`text-sm px-3 py-2 rounded-lg min-w-[150px] ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {tag}
            </Button>
          );
        })}
      </div>

      {/* Selected Tags Display */}
      <div className="flex gap-2 flex-wrap">
        {selectedTags.map((tag) => (
          <Badge key={String(tag)} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white">
            {tag}
            <X className="w-4 h-4 cursor-pointer ml-1" onClick={() => handleSelect(tag)} />
          </Badge>
        ))}
      </div>
    </div>

          {/* Review Textarea */}
          <div>
            <h2 className="text-lg font-medium">Write Your Review</h2>
            <textarea
              name="review"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="border p-3 w-full rounded-md dark:bg-gray-700 dark:border-gray-600 mt-2 h-28"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
          <Button
  type="button" // Prevents accidental form submission
  onClick={() => {
    setReviewText(""); // Reset review text
    setRating(3); // Reset rating
    setDifficulty(3); // Reset difficulty
    setSelectedTag([]); // Clear selected tags
    setSelectedGrade("Select Grade"); // Reset grade
    router.back(); // Navigate back
  }}
  className="w-full min-w-[140px] bg-red-500 text-white hover:bg-red-600"
>
  Cancel
</Button>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
}