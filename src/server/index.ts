import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { procedure, router } from "@/server/trpc";
import { getMessages, storeMessage } from "@/utils/mongodb";

export interface Message {
  id: string;
  user: string;
  text: string;
}

const ee = new EventEmitter();

export const appRouter = router({
  onSend: procedure.subscription(() => {
    return observable<Message>((emit) => {
      const onAdd = (data: Message) => {
        emit.next(data);
      };
      ee.on("message", onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("message", onAdd);
      };
    });
  }),

  fetchMessages: procedure.query(async () => {
    // Replace this with your MongoDB client code to fetch messages
    const messages = await getMessages();
    return messages;
  }),

  sendMessage: procedure
    .input(
      z.object({
        id: z.string().uuid(),
        user: z.string().min(3),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const message = { ...input };
      await storeMessage(message);
      ee.emit("message", message);
      return message;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
