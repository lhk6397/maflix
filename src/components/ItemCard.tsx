import React from "react";
import { motion } from "framer-motion";

import { makeImagePath } from "@/libs/client/makeImagePath";
import { boxVariants, infoVariants } from "@/data/variatns";
import { IGenre, IMovie, ITv, isMovie } from "@/types";
import useCurrentUser from "@/hooks/useCurrentUser";
import Info from "./global/Info";

type Props = {
  item: IMovie | ITv;
  genres?: IGenre[];
};

const ItemCard = ({ item, genres }: Props) => {
  const { data: current } = useCurrentUser();

  return (
    <motion.div
      key={item.id}
      whileHover="hover"
      initial="normal"
      variants={boxVariants}
      transition={{ type: "tween" }}
      className="cursor-pointer relative bg-cover bg-center h-[12vw] text-[66px] first:origin-left last:origin-right hover:z-10 rounded-md"
    >
      {item.backdrop_path ? (
        <motion.img
          src={makeImagePath(item.backdrop_path, "w500")}
          variants={infoVariants}
          alt={isMovie(item) ? item.title : item.name}
        />
      ) : (
        "No Image"
      )}
      {current && (
        <Info
          data={item}
          likeMovies={current.profile.likeMovies}
          likeSeries={current.profile.likeSeries}
          genres={genres}
        />
      )}
    </motion.div>
  );
};

export default ItemCard;
