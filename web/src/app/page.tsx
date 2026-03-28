"use client";

import Navbar from "@/components/Navbar";
import { Globe, Shuffle, Sparkles, Video } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "@/components/Footer";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import VideoRoom from "@/components/VideoRoom";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "waiting" | "chatting">("idle");
  const [roomId, setRoomId] = useState<string | null>(null);

  const socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        transports: ["websocket"],
      }),
    []
  );

  const startChat = () => {
    socket.emit("start");
    setStatus("waiting");
  };

  const handleNext = () => {
    socket.emit("next");
    window.location.reload();
  };

  useEffect(() => {
    const handleMatched = ({ roomId }: { roomId: string }) => {
      setRoomId(roomId);
      setStatus("chatting");
    };

    const handleWaiting = () => {
      setStatus("waiting");
    };

    const handlePartnerLeft = () => {
      window.location.reload();
    };

    socket.on("matched", handleMatched);
    socket.on("waiting", handleWaiting);
    socket.on("partner_left", handlePartnerLeft);

    return () => {
      socket.off("matched", handleMatched);
      socket.off("waiting", handleWaiting);
      socket.off("partner_left", handlePartnerLeft);
    };
  }, [socket]);

  return (
    <>
      <Navbar show={status !== "chatting"} />

      <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur"
              >
                <Sparkles size={48} color="white" />
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              >
                Welcome to Icognito
              </motion.h1>

              <motion.p
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                className="max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl"
              >
                Connect with strangers around the world anonymously through
                secure video or voice chat.
              </motion.p>

              <motion.button
                type="button"
                onClick={startChat}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0px 20px 50px rgba(255,255,255,0.18)",
                }}
                whileTap={{
                  scale: 0.92,
                  y: 1,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.9 }}
                className="group relative mt-10 inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-white via-zinc-100 to-zinc-200 px-8 py-4 text-lg font-semibold text-black shadow-xl transition-all duration-200 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 transition duration-300 group-hover:bg-black/15">
                    <Video size={22} />
                  </span>
                  <span>Start Anonymous Chat</span>
                </span>
              </motion.button>
            </motion.div>
          )}

          {status === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              <motion.h2
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
              >
                Looking for a stranger...
              </motion.h2>
              <motion.p
                className="mt-2 text-zinc-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
              >
                Please wait while we find someone for you...
              </motion.p>
            </motion.div>
          )}

          {status === "chatting" && roomId && (
            <motion.div
              key="chatting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="fixed inset-0 z-20 flex flex-col bg-black"
              >
                <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-4 backdrop-blur sm:px-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Globe size={16} />
                    Icognito | connected
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 font-medium text-white"
                    onClick={handleNext}
                  >
                    <Shuffle size={16} />
                    Next
                  </motion.button>
                </div>

                <div className="relative flex-1">
                  <VideoRoom roomId={roomId} />
                </div>
              </motion.div>

              <motion.h2
                className="mt-6 text-xl font-semibold text-green-400"
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
                transition={{
                  repeat: Infinity,
                  ease: "easeInOut",
                  duration: 1.2,
                }}
              >
                You are now chatting!
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}