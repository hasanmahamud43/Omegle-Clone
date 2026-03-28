"use client";

import React, { useEffect, useRef } from "react";

type VideoRoomProps = {
  roomId: string;
};

function VideoRoom({ roomId }: VideoRoomProps) {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      const container = containerRef.current;

      if (!container || !roomId) return;

      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("Zego environment variables are missing.");
        return;
      }

      try {
        const { ZegoUIKitPrebuilt } = await import(
          "@zegocloud/zego-uikit-prebuilt"
        );

        if (!isMounted) return;

        const userId = crypto.randomUUID();

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          "stranger"
        );

        if (!isMounted) return;

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        zp.joinRoom({
          container,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          showTextChat: true,
          maxUsers: 2,
        });
      } catch (error) {
        console.error("Failed to start video room:", error);
      }
    };

    start();

    return () => {
      isMounted = false;

      if (zpRef.current) {
        try {
          zpRef.current.leaveRoom();
          zpRef.current.destroy();
        } catch (error) {
          console.error("Failed to clean up video room:", error);
        } finally {
          zpRef.current = null;
        }
      }
    };
  }, [roomId]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default VideoRoom;