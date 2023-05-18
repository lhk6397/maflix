import Layout from "@/components/layout";
import axios from "axios";
import { NextPageContext } from "next";
import React from "react";
import { motion } from "framer-motion";
import { makeImagePath } from "@/libs/client/makeImagePath";
import { HiPlay } from "react-icons/hi2";
import { AiOutlineDislike, AiOutlineDown, AiOutlineLike } from "react-icons/ai";
import { ISearchedMovie } from "@/types";
import { useRouter } from "next/router";
import genres from "@/data/genres";
import Image from "next/image";

export async function getServerSideProps(ctx: NextPageContext) {
  const { query, page } = ctx.query;
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.TMDB_API_KEY}&page=${page}`;
  const searchedData = await (await axios.get(url)).data.results;
  console.log(searchedData);
  return {
    props: {
      data: searchedData,
    },
  };
}

interface Props {
  data: ISearchedMovie[];
}

const Search = ({ data }: Props) => {
  const router = useRouter();
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

  const onBoxClicked = (item: ISearchedMovie) =>
    router.push(`/?movieId=${item.id}`);

  return (
    <Layout>
      <div className="space-y-10 px-[30px] py-[200px]">
        {data.length > 0 ? (
          <>
            <h3 className="text-xl text-zinc-500">
              검색결과:
              <span className="text-primary-white-300">
                {" "}
                {router.query.query}
              </span>
            </h3>
            <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
              {data.map((movie) => (
                <motion.div
                  layoutId={movie.id + ""}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  className="cursor-pointer relative bg-cover bg-center h-[150px] text-[66px] first:origin-left last:origin-right hover:z-10 rounded-md overflow-hidden"
                >
                  {movie.backdrop_path ? (
                    <Image
                      src={makeImagePath(movie?.backdrop_path, "w500")}
                      alt={movie.title}
                      fill
                    />
                  ) : movie.poster_path ? (
                    <Image
                      src={makeImagePath(movie.poster_path, "w500")}
                      alt={movie.title}
                      fill
                    />
                  ) : (
                    "No Image"
                  )}
                  <motion.div
                    variants={infoVariants}
                    className="p-[10px] bg-primary-black-600 text-white opacity-0 absolute w-full bottom-0 flex flex-col space-y-3"
                  >
                    <h4 className="text-base">
                      {movie.title ?? movie.original_title}
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
                        onClick={() => onBoxClicked(movie)}
                        className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
                      >
                        <AiOutlineDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xs flex space-x-2">
                      <span className="text-green-700">
                        평점: {movie.vote_average}
                      </span>
                      {movie.adult && <span>19+</span>}
                    </div>
                    <div className="text-xs flex space-x-1 flex-wrap">
                      {movie.genre_ids.map((genre, idx) => {
                        const obj = genres.find((g) => g.id === genre);
                        if (obj)
                          return (
                            <span key={obj.id}>
                              {obj.name}{" "}
                              {idx !== movie.genre_ids.length - 1 && "•"}
                            </span>
                          );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-primary-white-300 text-center text-xl">
            검색 결과가 없습니다.
          </h3>
        )}
      </div>
    </Layout>
  );
};

export default Search;
