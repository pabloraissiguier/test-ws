import { useState, FC } from "react";

interface MessageFormProps {
  onSubmit: Function;
}

const MessageForm: FC<MessageFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows={4}
        name="comment"
        id="comment"
        value={message}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 w-full mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default MessageForm;
