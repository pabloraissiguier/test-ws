import { useUserStore } from "@/state/user";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function IndexPage() {
  const { setUser } = useUserStore();
  const [userName, setUserName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("USERNAME");
    if (user) {
      setUserName(user);
    }
  }, []);

  const setChatUser = () => {
    setUser(userName);
    localStorage.setItem("USERNAME", userName);

    router.push("/chat");
  };

  return (
    <div className="h-full flex justify-center">
      <div className="pt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-[200px]"
            src="https://i.giphy.com/7NoNw4pMNTvgc.webp"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to the chat
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Your user name
          </label>
          <div className="mt-2">
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
              value={userName}
              onChange={(evt) => setUserName(evt.target.value)}
            />
          </div>
        </div>

        <button
          onClick={setChatUser}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 w-full mt-4"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
