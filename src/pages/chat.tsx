import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

import { trpc } from "@/utils/ws-trpc";
import { Message } from "@/utils/types";

import { useUserStore } from "@/state/user";

import ChatMessage from "@/components/ChatMessage";
import MessageForm from "@/components/MessageForm";

export default function ChatPage() {
  const { user } = useUserStore();
  const [messageList, setMessageList] = useState<Message[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const { data, error, isLoading } = trpc.fetchMessages.useQuery();

  useEffect(() => {
    if (data) {
      setMessageList(data);
    }
  }, [data]);

  const addMessageToList = (message: Message) => {
    setMessageList([...messageList, message]);
  };

  const addMessage = trpc.sendMessage.useMutation();

  trpc.onSend.useSubscription(undefined, {
    onData(message) {
      if (message.user !== user) {
        addMessageToList(message);
      }
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  const send = (messageText: string) => {
    const messageObj = {
      id: uuidv4(),
      user,
      text: messageText,
    };

    addMessageToList(messageObj);

    addMessage.mutateAsync(messageObj);
  };

  if (error) return <div>{error.message}</div>;

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col gap-4 py-4 justify-between h-full">
      <div className="flex flex-col h-full overflow-y-auto">
        {messageList.map((message) => (
          <ChatMessage
            key={message.id}
            isYou={message.user === user}
            message={message}
          />
        ))}
      </div>
      <MessageForm onSubmit={send} />
    </div>
  );
}
