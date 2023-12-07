import { Message } from "@/utils/types";
import React from "react";

interface ChatMessageProps {
  message: Message;
  isYou: boolean;
}

const ChatMessage: React.FC<
  ChatMessageProps & React.HTMLProps<HTMLDivElement>
> = ({ message, isYou }) => {
  const isYouClass = isYou ? "self-end" : "";
  return (
    <div className={`flex items-start mb-4 ${isYouClass}`}>
      <div>
        <div className="flex items-center mb-1">
          <span className="font-bold mr-2">{message.user}</span>
        </div>
        <div className="bg-gray-200 rounded-lg p-2">{message.text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
