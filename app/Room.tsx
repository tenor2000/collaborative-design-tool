"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/Loader";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_Te7u-tZ2v_cOTI2AvFP1hxL7WJ5y0cv9JscRml8TuDm6na71T96qeb96KXu981n6"}>
      <RoomProvider 
        id="my-room" 
        initialPresence={{ 
          cursor: null, cursorColor: null, editingText: null 
        }}
        initialStorage={{
          canvasObjects: new LiveMap(),
        }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}