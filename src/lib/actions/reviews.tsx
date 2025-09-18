'use server';

import { db } from '@/lib/db';
import { reviewsTable } from '@/lib/db/schema';

export async function submitReview(
  courseId: number,
  rating: number,
  professorId: number,
  reviewText: string,
) {
  try {
    console.log('Attempting to submit review with: ', {
      courseId,
      rating,
      professorId,
      reviewText,
    });
    if (!courseId || !professorId || !rating || !reviewText) {
      throw new Error(
        '❌ Missing required fields! Check courseId, professorId, rating, and reviewText.',
      );
    }

    if (rating < 1 || rating > 5) {
      throw new Error('❌ Rating must be between 1 and 5!');
    }

    await db.insert(reviewsTable).values({
      courseId,
      professorId,
      rating,
      review: reviewText,
    });
    console.log(
      `Review added: Course ${courseId},Professor ${professorId}, Rating ${rating}, Review: ${reviewText}`,
    );
  } catch (error) {
    console.error('error inserting review:', error);
    throw new Error('Failed to insert review');
  }
}
