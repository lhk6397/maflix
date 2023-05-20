import Layout from "@/components/layout";
import axios from "axios";
import { NextPageContext } from "next";
import React from "react";
import { motion } from "framer-motion";
import { makeImagePath } from "@/libs/client/makeImagePath";
import { HiPlay } from "react-icons/hi2";
import { AiOutlineDislike, AiOutlineDown, AiOutlineLike } from "react-icons/ai";
import { IMovie, ITv, isMovie } from "@/types";
import { useRouter } from "next/router";
import genresList from "@/data/genresList";
import Image from "next/image";

export async function getServerSideProps(ctx: NextPageContext) {
  const { query, page } = ctx.query;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.TMDB_API_KEY}&page=${page}`;
  const tvUrl = `https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${process.env.TMDB_API_KEY}&page=${page}`;
  const movieSearchedData = await (await axios.get(movieUrl)).data.results;
  const tvSearchedData = await (await axios.get(tvUrl)).data.results;

  return {
    props: {
      movieSearchedData,
      tvSearchedData,
    },
  };
}

interface Props {
  movieSearchedData: IMovie[];
  tvSearchedData: ITv[];
}

const Search = ({ movieSearchedData, tvSearchedData }: Props) => {
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

  const onBoxClicked = (data: IMovie | ITv) =>
    router.push(isMovie(data) ? `?movieId=${data.id}` : `?seriesId=${data.id}`);

  return (
    <Layout>
      <div className="space-y-10 px-[30px] py-[200px]">
        <h3 className="text-xl text-zinc-500">
          검색결과:
          <span className="text-primary-white-300"> {router.query.query}</span>
        </h3>
        {movieSearchedData.length > 0 && (
          <>
            <h3 className="text-2xl text-primary-white-300">영화</h3>
            <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
              {movieSearchedData.map((movie) => (
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
                        const obj = genresList.find((g) => g.id === genre);
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
        )}
        {tvSearchedData.length > 0 && (
          <>
            <h3 className="text-2xl text-primary-white-300">시리즈</h3>
            <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
              {tvSearchedData.map((tv) => (
                <motion.div
                  layoutId={tv.id + ""}
                  key={tv.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  className="cursor-pointer relative bg-cover bg-center h-[150px] text-[66px] first:origin-left last:origin-right hover:z-10 rounded-md overflow-hidden"
                >
                  {tv.backdrop_path ? (
                    <Image
                      src={makeImagePath(tv?.backdrop_path, "w500")}
                      alt={tv.name}
                      fill
                    />
                  ) : tv.poster_path ? (
                    <Image
                      src={makeImagePath(tv.poster_path, "w500")}
                      alt={tv.name}
                      fill
                    />
                  ) : (
                    "No Image"
                  )}
                  <motion.div
                    variants={infoVariants}
                    className="p-[10px] bg-primary-black-600 text-white opacity-0 absolute w-full bottom-0 flex flex-col space-y-3"
                  >
                    <h4 className="text-base">{tv.name}</h4>
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
                        onClick={() => onBoxClicked(tv)}
                        className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
                      >
                        <AiOutlineDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xs flex space-x-2">
                      <span className="text-green-700">
                        평점: {tv.vote_average}
                      </span>
                    </div>
                    <div className="text-xs flex space-x-1 flex-wrap">
                      {tv.genre_ids.map((genre, idx) => {
                        const obj = genresList.find((g) => g.id === genre);
                        if (obj)
                          return (
                            <span key={obj.id}>
                              {obj.name}{" "}
                              {idx !== tv.genre_ids.length - 1 && "•"}
                            </span>
                          );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {movieSearchedData.length === 0 && tvSearchedData.length === 0 && (
          <h3 className="text-primary-white-300 text-center text-xl">
            검색 결과가 없습니다.
          </h3>
        )}
      </div>
    </Layout>
  );
};

export default Search;
