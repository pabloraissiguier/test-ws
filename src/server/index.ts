import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { procedure, router } from "@/server/trpc";

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
        console.log({ fn: 'onAdd', data})
        // emit data to client
        emit.next(data);
      };
      ee.on("message", onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("message", onAdd);
      };
    });
  }),

  sendMessage: procedure
    .input(
      z.object({
        id: z.string().uuid(),
        user: z.string().min(3),
        text: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const message = { ...opts.input };
      /* [..] add to db */
      ee.emit("message", message);
      return message;
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;
