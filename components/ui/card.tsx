import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Card Component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-neutral-200 bg-gradient-to-br from-gray-50 to-gray-100 text-neutral-900 shadow-md transition hover:shadow-lg dark:border-neutral-700 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-50",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// CardHeader with Image
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative p-4", className)} {...props}>
    {/* Image at the top of the card with padding */}
    <Image
      height={400}
      width={400}
      src="/path-to-your-image.jpg" // Replace with dynamic image path or props.src
      alt="Card Image"
      className="w-full object-cover rounded-lg"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
    <div className="relative pt-4 text-white">{children}</div>
  </div>
));
CardHeader.displayName = "CardHeader";

// CardTitle
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// CardDescription
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-neutral-500 dark:text-neutral-400",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// CardContent
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

// CardFooter
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
