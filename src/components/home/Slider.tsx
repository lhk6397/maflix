import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { IMovie, ITv } from "@/types";
import useCurrentUser from "@/hooks/useCurrentUser";
import { rowVariants } from "@/data/variatns";
import ItemCard from "../ItemCard";

interface SliderProps {
  data: IMovie[] | ITv[];
  topic: string;
}

const offset = 6;

const Slider = ({ data, topic }: SliderProps) => {
  const { data: currentUser } = useCurrentUser();
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

  return (
    <>
      {currentUser && (
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
                className="h-[12vw] grid gap-[10px] grid-cols-6 absolute px-[30px]"
              >
                {data
                  ?.slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((item: IMovie | ITv) => (
                    <ItemCard key={item.id} item={item} />
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
        </>
      )}
    </>
  );
};

export default Slider;
