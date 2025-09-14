'use client';

import { useSearchParams } from 'next/navigation';
import ErrorToast from '@/components/error-toast';

export default function ErrorToastLogin() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return <ErrorToast error={error ?? undefined} />;
}
