"use client";

import { Loader2, ServerCrash } from "lucide-react";
import { Member, Message, Profile } from "@prisma/client";
import { Fragment, useRef, ElementRef, useEffect } from "react";
import { format } from "date-fns";
import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

// Define the types for the message structure
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: (data as { pages: ChatResponse[] })?.pages[0]?.items?.length ?? 0,
  })

  // Automatically scroll to the bottom when new messages are loaded or added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [(data as { pages: ChatResponse[] })?.pages]);

  // Define the shape of the response
  interface ChatResponse {
    items: MessageWithMemberWithProfile[];
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading Messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {/* Display welcome message only if there are no previous messages */}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      
      {/* Button to load previous messages */}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      {/* Chat messages list */}
      <div className="flex flex-col mt-auto">
        {(data as { pages: ChatResponse[] })?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                member={message.member}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>

      {/* Always scroll to bottom */}
      <div ref={bottomRef} />
    </div>
  );
};
