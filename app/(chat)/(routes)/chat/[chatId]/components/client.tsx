"use client"
import { useCompletion } from "ai/react";
import { ChatHeader } from "@/components/chat-header";
import { Companion, Message } from "@prisma/client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

interface ChatClientProps{
    companion: Companion & {
        messages: Message[],
        _count: {
            messages: number;
        };
    };
};

export const ChatClient = ({
    companion
}: ChatClientProps) => {
    // add some hooks, states and functionalities that we need
    
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
 // yahn ai hook se ye ye particular cheeze lenge then fir define krenge api call
    const { 
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput
    } = useCompletion({
        api: `/api/chat/${companion.id}`,
        // we have to use the prompt but sidhe completion prompt nhi de skte otherwise wo completion ko hi prompt samaj lega

        onFinish(prompt, completion) {
            const systemMessage: ChatMessageProps = {
                role: "system",
                content: completion,    
            };
            setMessages((current) => [...current, systemMessage]);
            setInput("");

            router.refresh();
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage :ChatMessageProps = {
            role: "user",
            content: input,
        };
        setMessages((current) => [...current, userMessage]);
        handleSubmit(e);
    }


    return (
      <div className="flex flex-col h-full p-4 space-y-2">
        <ChatHeader companion={companion} />
        <ChatMessages
          isLoading={isLoading}
          companion={companion}
          messages={messages}
        />
        <ChatForm
          isLoading ={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
        />
      </div>
    );
}
