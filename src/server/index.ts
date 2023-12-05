import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { procedure, router } from "@/server/trpc";

interface Message {
  emitter: string;
  text: string;
}

const ee = new EventEmitter();

export const appRouter = router({
  testWs: procedure.subscription(() => {
    return observable<Message>((emit) => {
      const onAdd = (data: Message) => {
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
        id: z.string().uuid().optional(),
        text: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const message = { ...opts.input }; /* [..] add to db */
      ee.emit("message", message);
      return message;
    }),

  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
