"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Form = React.forwardRef<HTMLFormElement, React.HTMLAttributes<HTMLFormElement>>(
  ({ className, children, ...props }, ref) => (
    <form
      ref={ref}
      className={cn(
        "",
        className
      )}
      {...props}
    >
      {children}
    </form>
  ),
);
Form.displayName = "Form";

const FormContent = React.forwardRef<HTMLInputElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "absolute z-50 max-h-80 min-w-[8rem] overflow-scroll rounded-md border bg-popover text-popover-foreground shadow-md ",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);
FormContent.displayName = "FormContent";

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-2 text-sm overflow-hidden outline-none focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    />
  ),
);
FormItem.displayName = "FormItem";

const FormText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-8 pr-2 text-sm overflow-hidden outline-none",
        className
      )}
      {...props}
    />
  ),
);
FormText.displayName = "FormText";

export { Form, FormContent, FormItem, FormText };