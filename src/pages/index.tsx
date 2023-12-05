import { trpc } from "@/utils/trpc";

import { trpc as wsClient } from "@/utils/trpc";

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: "pablo" });

  const wsHello = wsClient.sendMessage.useMutation({
    id: "user1",
    text: "pablo",
  });

  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-black">
      <p>{hello.data.greeting}</p>
    </div>
  );
}
