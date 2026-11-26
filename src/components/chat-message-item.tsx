import React from "react";

import { differenceInMinutes, format, formatDistanceToNow } from "date-fns";
import { Bot, User } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/types/chats.types";

export const MessageItem = ({ message }: { message: ConversationMessage }) => {
  const isRecent =
    differenceInMinutes(new Date(), new Date(message.createdAt)) < 60;

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full",
        message.type === "user" ? "flex-row-reverse" : "",
      )}
    >
      <Avatar
        className={cn(
          "h-8 w-8 flex justify-center items-center shrink-0",
          message.type === "user" ? "dark:bg-primary bg-zinc-900" : "bg-muted",
        )}
      >
        {message.type === "user" ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%] min-w-0",
          message.type === "user" ? "items-end" : "",
        )}
      >
        <div
          className={cn(
            "rounded-lg p-3 text-sm flex flex-col min-w-0 max-w-full overflow-x-auto overscroll-x-contain w-full",
            message.type === "user"
              ? "dark:bg-primary bg-zinc-900 text-primary-foreground"
              : "bg-muted dark:bg-zinc-800",
          )}
        >
          {message.type === "user" ? (
            <div className="whitespace-pre-wrap leading-relaxed break-words">
              {message.message}
            </div>
          ) : (
            <MarkdownRenderer content={message.message} />
          )}
        </div>

        {message.createdAt && (
          <p className="text-xs dark:text-gray-500 text-gray-600 pl-1 shrink-0">
            {isRecent
              ? `${formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}`
              : format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
          </p>
        )}
      </div>
    </div>
  );
};
