import { trpc } from "@/utils/ws-trpc";

import { v4 as uuidv4 } from "uuid";

import { Message } from "@/server";

import { useState } from "react";

export default function IndexPage() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  const addMessageToList = (message: Message) => {
    setMessageList([...messageList, message]);
  };

  const addMessage = trpc.sendMessage.useMutation();

  trpc.onSend.useSubscription(undefined, {
    onData(message) {
      // agrego un mensaje a la lista
      console.log({ fn: "onData", message });
      if (message.user !== user) {
        addMessageToList(message);
      }
      // addMessages([message]);
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
      <ul>
        {messageList.map((message) => (
          <li
            key={message.id}
            className={message.user === user ? " text-red-500" : ""}
          >
            {message.text} by {message.user}
          </li>
        ))}
      </ul>
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
