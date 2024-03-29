"use client"
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { BotAvatar } from "./bot-avatar";
import { UserAvatar } from "./user-avatar";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export interface ChatMessageProps{
    role: "system" | "user",
    content?: string;
    isLoading?: boolean;
    src?: string;
};

export const ChatMessage = ({
    role,
    content,
    isLoading,
    src
}: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    // this function is for copy the parent message mtlb ki jo a generated hoga

    const onCopy = () => {
        if (!content) {
            return;
        }
        navigator.clipboard.writeText(content);
        toast({
            description: "Message Copied to clipboard",
        })
    }

    return (
        
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
            // yadi role user hai means we are asking toh class is justify end means on lef tside
            // if robot speaking we want it on right side
            role === "user" && "justify-end"
        )}>
            {role !== "user" && src && <BotAvatar src={src} />}
            <div className="rounded-md px-4 py-2 mx-w-sm text-sm bg-primary/10">
                {
                    isLoading ? <BeatLoader size={5} color={theme === "light" ? "black" : "white"} /> : content
                }

            </div>

            {role === "user" && <UserAvatar />}
            {role !== "user" && !isLoading && (
                <Button onClick={onCopy} className="opacity-0 group-hover:opacity-100 transiton" size="icon" variant="ghost">
                    <Copy className="w-4 h-4"/>

                </Button>
            )}
        </div>
        
    )
}