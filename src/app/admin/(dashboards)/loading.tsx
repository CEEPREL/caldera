import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Skeleton className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></Skeleton>
    </div>
  );
}
