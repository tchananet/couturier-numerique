import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ClientPortalLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>

        <div className="flex justify-end">
            <Skeleton className="h-10 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}
