'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ReviewInput() {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [course, setCourse] = useState('')
  const [professor, setProfessor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ course, professor, rating, review })
  }

  return (
    <Card className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 border-white/20 mx-auto">
      <CardHeader>
        <CardTitle>Add a Review</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 w-full">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs101">CS 101: Introduction to Programming</SelectItem>
                <SelectItem value="cs201">CS 201: Data Structures</SelectItem>
                <SelectItem value="cs301">CS 301: Algorithms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="professor">Professor</Label>
            <Select value={professor} onValueChange={setProfessor}>
              <SelectTrigger id="professor">
                <SelectValue placeholder="Select a professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smith">Dr. Smith</SelectItem>
                <SelectItem value="johnson">Prof. Johnson</SelectItem>
                <SelectItem value="williams">Dr. Williams</SelectItem>
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
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
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
        <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto">Add Review</Button>
      </CardFooter>
    </Card>
  )
}