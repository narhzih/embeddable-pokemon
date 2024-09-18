import { Circle } from "lucide-react";

export const Loader = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="relative w-16 h-16 animate-bounce">
                <Circle className="w-full h-full text-red-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-1 bg-white rounded-full" />
                </div>
                <Circle className="absolute inset-0 w-6 h-6 m-auto text-white" />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
                {text ?? "Loading..."}
            </p>
        </div>
    );
};
