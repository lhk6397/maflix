import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineLike, AiOutlineDislike, AiOutlineDown } from "react-icons/ai";
import { HiPlay } from "react-icons/hi2";
import { useRouter } from "next/router";

import { makeImagePath } from "@/libs/client/makeImagePath";
import { IMovie } from "@/types";
import genres from "@/data/genres";
import MovieModal from "../global/MovieModal";

interface SliderProps {
  data: IMovie[];
  topic: string;
}

const rowVariants = {
  hidden: (isForward: boolean) => ({
    x:
      typeof window !== "undefined"
        ? isForward
          ? window.innerWidth + 5
          : -window.innerWidth - 5
        : 0,
  }),
  visible: {
    x: 0,
  },
  exit: (isForward: boolean) => ({
    x:
      typeof window !== "undefined"
        ? isForward
          ? -window.innerWidth - 5
          : window.innerWidth + 5
        : 0,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const Slider = ({ data, topic }: SliderProps) => {
  const [isForward, setIsForward] = useState<boolean | null>(null);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();
  const loopIndex = useCallback(
    (isForward: boolean) => {
      if (data) {
        if (leaving) return;
        toggleLeaving();
        const totalItems = data.length - 1;
        const maxIndex = Math.floor(totalItems / offset) - 1;

        isForward
          ? setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
          : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    },
    [data, leaving]
  );

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (item: IMovie) => router.push(`/?movieId=${item.id}`);

  const onOverlayClick = () => router.push("/");

  return (
    <>
      <div className="h-[150px] relative -top-[13vw] mb-[80px] space-y-3 lg:space-y-5">
        <h4 className="text-white font-light text-lg lg:text-2xl px-[30px]">
          {topic}
        </h4>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={isForward}
        >
          <motion.div
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={isForward}
            transition={{ type: "tween", duration: 1 }}
            className="h-[150px] grid gap-[10px] grid-cols-6 absolute px-[30px]"
          >
            {data
              ?.slice(1)
              .slice(offset * index, offset * index + offset)
              .map((item: IMovie) => (
                <motion.div
                  layoutId={item.id + ""}
                  key={item.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  className="cursor-pointer relative bg-cover bg-center h-[200px] text-[66px] first:origin-left last:origin-right hover:z-10 rounded-md overflow-hidden"
                >
                  <motion.img
                    src={makeImagePath(item.backdrop_path, "w500")}
                    variants={infoVariants}
                    alt={item.title}
                    width={500}
                    height={200}
                  />
                  <motion.div
                    variants={infoVariants}
                    className="p-[10px] bg-primary-black-600 text-white opacity-0 absolute w-full bottom-0 flex flex-col space-y-3"
                  >
                    <h4 className="text-base">
                      {item.title ?? item.original_title}
                    </h4>
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <div className="p-2 bg-primary-white-600 rounded-full text-primary-black-600 border-2 border-white hover:bg-primary-white-300">
                          <HiPlay className="w-4 h-4" />
                        </div>
                        <div className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300">
                          <AiOutlineLike className="w-4 h-4" />
                        </div>
                        <div className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300">
                          <AiOutlineDislike className="w-4 h-4" />
                        </div>
                      </div>
                      <div
                        onClick={() => onBoxClicked(item)}
                        className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
                      >
                        <AiOutlineDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xs flex space-x-2">
                      <span className="text-green-700">
                        평점: {item.vote_average}
                      </span>
                      {item.adult && <span>19+</span>}
                    </div>
                    <div className="text-xs flex space-x-1 flex-wrap">
                      {item.genre_ids.map((genre, idx) => {
                        const obj = genres.find((g) => g.id === genre);
                        if (obj)
                          return (
                            <span key={obj.id}>
                              {obj.name}{" "}
                              {idx !== item.genre_ids.length - 1 && "•"}
                            </span>
                          );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>
          <IoChevronBack
            className="absolute left-0 bg-primary-black opacity-70 cursor-pointer flex justify-center items-center h-full w-7 lg:w-14 text-white"
            onClick={() => {
              setIsForward(false);
              loopIndex(false);
            }}
          />
          <IoChevronForward
            className="absolute right-0 bg-primary-black opacity-70 cursor-pointer flex justify-center items-center h-full w-7 lg:w-14 text-white"
            onClick={() => {
              setIsForward(true);
              loopIndex(true);
            }}
          />
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {router.query.movieId && (
          <>
            <motion.div
              className="fixed top-0 w-full h-full bg-black/50 opacity-0"
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
            <motion.div layoutId={router.query.movieId as string}>
              <MovieModal />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Slider;
