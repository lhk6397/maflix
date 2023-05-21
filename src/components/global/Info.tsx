import React, { useEffect, useState } from "react";
import { AiOutlineDislike, AiOutlineDown, AiOutlineLike } from "react-icons/ai";
import { motion } from "framer-motion";
import { IGenre, ILike, IMovie, ITv, isMovie } from "@/types";
import { useRouter } from "next/router";
import { HiPlay } from "react-icons/hi2";
import genresList from "@/data/genresList";
import useMutation from "@/hooks/useMutation";

type Props = {
  data: IMovie | ITv;
  likeMovies: ILike[];
  likeSeries: ILike[];
  genres?: IGenre[];
};

interface MutationResult {
  ok: boolean;
}

const Info = ({ data, likeMovies, likeSeries, genres }: Props) => {
  const router = useRouter();

  const [like, { loading: likeLoading, data: likeResult }] =
    useMutation<MutationResult>(
      isMovie(data) ? "/api/movie/like" : "/api/series/like"
    );
  const [dislike, { loading: dislikeLoading, data: dislikeResult }] =
    useMutation<MutationResult>(
      isMovie(data) ? "/api/movie/dislike" : "/api/series/dislike"
    );

  const [isLiked, setIsLiked] = useState(
    isMovie(data)
      ? likeMovies.find((like) => like.movieId === data.id + "") !== undefined
      : likeSeries.find((like) => like.seriesId === data.id + "") !== undefined
  );
  const onBoxClicked = (data: IMovie | ITv) =>
    router.push(isMovie(data) ? `?movieId=${data.id}` : `?seriesId=${data.id}`);

  const onLikeCliked = async () => {
    if (likeLoading) return;
    like({ dataId: data.id });
  };

  useEffect(() => {
    if (likeResult) {
      if (likeResult?.ok) {
        setIsLiked(true);
      } else {
        throw new Error(
          "서버 상의 오류로 실패하였습니다. 잠시 후 다시 시도해주십시오."
        );
      }
    }
  }, [likeResult]);

  useEffect(() => {
    if (dislikeResult) {
      if (dislikeResult?.ok) {
        setIsLiked(false);
      } else {
        throw new Error(
          "서버 상의 오류로 실패하였습니다. 잠시 후 다시 시도해주십시오."
        );
      }
    }
  }, [dislikeResult]);

  const onDisLikeCliked = async () => {
    if (dislikeLoading) return;
    dislike({ dataId: data.id });
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

  return (
    <motion.div
      variants={infoVariants}
      className="p-[10px] bg-primary-black-600 text-white opacity-0  w-full  flex flex-col space-y-3"
    >
      <h4 className="text-base">{isMovie(data) ? data.title : data.name}</h4>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="p-2 bg-primary-white-600 rounded-full text-primary-black-600 border-2 border-white hover:bg-primary-white-300">
            <HiPlay className="w-4 h-4" />
          </div>
          {!isLiked ? (
            <div
              className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
              onClick={() => onLikeCliked()}
            >
              <AiOutlineLike className="w-4 h-4" />
            </div>
          ) : (
            <div
              onClick={() => onDisLikeCliked()}
              className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
            >
              <AiOutlineDislike className="w-4 h-4" />
            </div>
          )}
        </div>
        <div
          onClick={() => onBoxClicked(data)}
          className="p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300"
        >
          <AiOutlineDown className="w-4 h-4" />
        </div>
      </div>
      <div className="text-xs flex space-x-2">
        <span className="text-green-700">평점: {data.vote_average}</span>
        {isMovie(data) && data.adult && <span>19+</span>}
      </div>
      <div className="text-xs flex space-x-1 flex-wrap">
        {data?.genre_ids?.map((genre: any, idx: number) => {
          const obj = genresList.find((g) => g.id === genre);
          if (obj)
            return (
              <span key={obj.id}>
                {obj.name} {idx !== data.genre_ids.length - 1 && "•"}
              </span>
            );
        })}
        {genres &&
          genres.map((genre, idx) => (
            <span key={genre.id}>
              {genre.name} {idx !== genres.length - 1 && "•"}
            </span>
          ))}
      </div>
    </motion.div>
  );
};

export default Info;
