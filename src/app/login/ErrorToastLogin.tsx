"use client";

import ErrorToast from "@/components/error-toast";
import { useSearchParams } from "next/navigation";

export default function ErrorToastLogin() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <ErrorToast error={error ?? undefined} />
}