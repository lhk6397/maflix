import React from "react";
import Navbar from "./global/Navbar";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import DetailModal from "./global/DetailModal";
import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const onOverlayClick = () =>
    router.query.movieId !== undefined
      ? router.push("/")
      : router.push("/series");

  return (
    <div>
      <Head>
        <title>Netflix Clone</title>
      </Head>
      <Navbar />
      <main>{children}</main>
      <AnimatePresence>
        {router.query.movieId && (
          <>
            <motion.div
              className="fixed top-0 w-full h-full bg-black/50 opacity-0"
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
            <motion.div>
              <DetailModal />
            </motion.div>
          </>
        )}
        {router.query.seriesId && (
          <>
            <motion.div
              className="fixed top-0 w-full h-full bg-black/50 opacity-0"
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
            <motion.div>
              <DetailModal />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
