import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { makeImagePath } from "@/libs/client/makeImagePath";
import { IMovie } from "@/types";

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

// const infoVariants = {
//   hover: {
//     opacity: 1,
//     transition: {
//       delay: 0.5,
//       duration: 0.1,
//       type: "tween",
//     },
//   },
// };

const offset = 6;

const Slider = ({ data, topic }: SliderProps) => {
  const [isForward, setIsForward] = useState<boolean | null>(null);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

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

  //   const onBoxClicked = (itemId: number) => {
  //     navigate(`/${curPage}/${itemId}`);
  //   };
  return (
    <div className="h-[150px] relative -top-[10vw] mb-[80px] space-y-3 lg:space-y-5">
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
                key={item.id}
                //   whileHover="hover"
                initial="normal"
                variants={boxVariants}
                transition={{ type: "tween" }}
                className="cursor-pointer"
              >
                <img
                  src={makeImagePath(item.backdrop_path, "w500")}
                  className="min-h-[150px] h-full object-cover object-center"
                  alt={item.title}
                />
                {/* <div>
                  <h4>{item.title ?? item.original_name}</h4>
                </div> */}
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
  );
};

export default Slider;
