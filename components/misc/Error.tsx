import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";

export function Error({ errorText }: { errorText?: string }) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {errorText ?? "An error occurred 😩 !Please try again later."}
            </AlertDescription>
        </Alert>
    );
}
