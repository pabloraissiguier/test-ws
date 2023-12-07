import { trpc } from "@/utils/ws-trpc";

import { v4 as uuidv4 } from "uuid";

import { Message } from "@/utils/types";

import { useEffect, useState } from "react";
import ChatMessage from "@/components/ChatMessage";

export default function IndexPage() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);

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

  const send = () => {
    const messageObj = {
      id: uuidv4(),
      user,
      text: message,
    };

    addMessageToList(messageObj);

    addMessage.mutateAsync(messageObj);
  };

  if (error) return <div>{error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <input type="text" onChange={(evt) => setUser(evt.target.value)} />

      <div className="flex flex-col max-w-[300px]">
        {messageList.map((message) => (
          <ChatMessage
            key={message.id}
            isYou={message.user === user}
            message={message}
          />
        ))}
      </div>
      <input
        type="text"
        name=""
        id=""
        onChange={(evt) => setMessage(evt.target.value)}
      />
      <button onClick={send}>send message</button>
    </div>
  );
}
