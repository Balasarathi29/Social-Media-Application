export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-400 ${sizeClasses[size]}`}
      />
    </div>
  );
}
