import "./globals.css";

import type { AppType } from "next/app";
import { trpc } from "@/utils/ws-trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="h-screen max-w-[500px] mx-auto px-4">
      <Component {...pageProps} />
    </div>
  );
};
export default trpc.withTRPC(MyApp);
