import { db } from '@/lib/db';
import { reviewsTable } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseID, rating, professorId, reviewText } = body;

    console.log('Attempting to submit review with: ', {
      courseID,
      rating,
      professorId,
      reviewText,
    });

    if (!courseID || !professorId || !reviewText || !rating) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields, check again',
        }),
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({
          error: '❌ Rating must be between 1 and 5!',
        }),
        { status: 400 },
      );
    }

    await db.insert(reviewsTable).values({
      courseId: courseID,
      professorId,
      rating,
      review: reviewText,
    });

    console.log(
      `✅ Review added: Course ${courseID}, Professor ${professorId}, Rating ${rating}`,
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Error inserting review:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert review' }), {
      status: 500,
    });
  }
}
