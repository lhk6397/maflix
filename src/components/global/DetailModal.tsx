import { motion } from "framer-motion";
import useSWR from "swr";
import { IMovieDetail, ITvDetail, isDetailMovie } from "@/types";
import { useRouter } from "next/router";
import Image from "next/image";
import { makeImagePath } from "@/libs/client/makeImagePath";
import { HiPlay } from "react-icons/hi2";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

const DetailModal = () => {
  const router = useRouter();
  const { movieId, seriesId } = router.query;
  const url = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    : `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
  const { data, isLoading, error } = useSWR<IMovieDetail | ITvDetail>(url);

  console.log(data);

  return (
    <>
      {isLoading && "Loading..."}
      {data && (
        <motion.div className="fixed top-[100px] left-0 right-0 mx-auto w-[40vw] h-[80vh] bg-primary-black-900 text-primary-white-300 overflow-auto scrollbar-hide">
          <div className="relative">
            <Image
              width={500}
              height={200}
              className="w-full"
              src={makeImagePath(data.backdrop_path)}
              alt={isDetailMovie(data) ? data.original_title : data.name}
            />
            <h1 className="text-6xl absolute bottom-10 left-10 font-bold">
              {isDetailMovie(data) ? data.original_title : data.name}
            </h1>
          </div>

          <section className="px-8 py-4">
            <div className="flex space-x-2">
              <div className="cursor-pointer py-1 px-4 items-center bg-primary-white-600 rounded-md text-primary-black-600 border-2 border-white hover:bg-primary-white-300 flex space-x-4">
                <HiPlay className="w-6 h-6" />
                <span>재생</span>
              </div>
              <div className="cursor-pointer p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300">
                <AiOutlineLike className="w-6 h-6" />
              </div>
              <div className="cursor-pointer p-2 bg-primary-black-600 rounded-full text-white border-2 border-primary-black-300 hover:border-primary-white-300 hover:bg-primary-black-300">
                <AiOutlineDislike className="w-6 h-6" />
              </div>
            </div>

            <div className="text-sm flex space-x-2 mt-10">
              <span className="text-green-700">평점: {data.vote_average}</span>
              <span>
                {isDetailMovie(data)
                  ? data.release_date?.slice(0, 4)
                  : data.first_air_date?.slice(0, 4)}
              </span>
            </div>

            <div className="text-sm mt-2 flex space-x-1 flex-wrap">
              <span className="text-zinc-500">장르: </span>
              {data?.genres?.map((genre, idx) => (
                <span key={genre.id}>
                  {genre.name}
                  {idx !== data.genres.length - 1 && ", "}
                </span>
              ))}
            </div>

            {isDetailMovie(data) && data.adult && (
              <span className="px-2 py-1 text-red border border-red-600">
                19+
              </span>
            )}

            <p className="mt-4">{data.overview}</p>
          </section>
        </motion.div>
      )}
    </>
  );
};

export default DetailModal;
