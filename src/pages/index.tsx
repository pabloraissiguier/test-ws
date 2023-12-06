import { trpc } from "@/utils/ws-trpc";

import { v4 as uuidv4 } from "uuid";

import { Message } from "@/server";

import { useEffect, useState } from "react";
import ChatMessage from "@/components/ChatMessage";

export default function IndexPage() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  const messages = trpc.fetchMessages.useQuery();

  useEffect(() => {
    if (messages.data) {
      setMessageList(messages.data);
    }
  }, [messages.data]);

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

  return (
    <div>
      <input type="text" onChange={(evt) => setUser(evt.target.value)} />
      <div className="flex flex-col max-w-[300px]">
        {messageList.map((message) => (
          <ChatMessage
            key={message.id}
            isYou={message.user === user}
            message={message}
          ></ChatMessage>
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
