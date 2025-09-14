'use client';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

type CustomToastProps = {
  error?: string | undefined;
};

export default function ErrorToast({ error, ...props }: CustomToastProps) {
  console.log('ErrorToast', error);
  useEffect(() => {
    console.log('Get here');
    if (error && error === 'invalid_email') {
      // the error msg may show up twice when the error happens because useEffect runs twice in development mode, but only one in production.
      console.log('error', error);
      toast.error('Only SJSU emails are allowed', {
        duration: 4000,
        closeButton: true,
        style: {
          backgroundColor: 'red',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
        },
        ...props,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  return <Toaster />;
}
