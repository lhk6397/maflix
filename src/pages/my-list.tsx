import Layout from "@/components/layout";
import { IMovie, IMovieDetail, ITv, ITvDetail } from "@/types";
import { NextPageContext } from "next";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { makeImagePath } from "@/libs/client/makeImagePath";
import Info from "@/components/global/Info";
import useCurrentUser from "@/hooks/useCurrentUser";
import prismadb from "@/libs/server/prismadb";
import { getSession } from "next-auth/react";
import axios from "axios";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      likeMovies: true,
      likeSeries: true,
    },
  });

  if (!currentUser)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  let likedMovies: any[] = [];
  let likedSeries: any[] = [];

  for (const like of currentUser?.likeMovies) {
    const url = `https://api.themoviedb.org/3/movie/${like.movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const res = await axios.get(url);
    if (res.data) {
      likedMovies.push(res.data);
    }
  }

  for (const like of currentUser?.likeSeries) {
    const url = `https://api.themoviedb.org/3/tv/${like.seriesId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const res = await axios.get(url);
    if (res.data) {
      likedSeries.push(res.data);
    }
  }
  return {
    props: {
      likedMovies,
      likedSeries,
    },
  };
}

interface Props {
  likedMovies: IMovieDetail[];
  likedSeries: ITvDetail[];
}

const Page = ({ likedMovies, likedSeries }: Props) => {
  const { data: currentUser } = useCurrentUser();
  console.log(currentUser);
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

  return (
    <Layout>
      {currentUser && (
        <div className="py-[200px] px-[30px] space-y-32">
          <div className="space-y-10">
            <h3 className="text-2xl text-primary-white-300">
              내가 좋아하는 영화
            </h3>
            {likedMovies.length > 0 ? (
              <>
                <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
                  {likedMovies.map((movie) => (
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
                      ) : (
                        "No Image"
                      )}
                      <Info
                        data={movie as Omit<IMovie, "genre_ids"> as IMovie}
                        likeMovies={currentUser.likeMovies}
                        likeSeries={currentUser.likeSeries}
                        genres={movie.genres}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <h3 className="text-primary-white-300 text-center text-xl">
                좋아하는 영화를 추가해주세요.
              </h3>
            )}
          </div>
          <div className="space-y-10">
            <h3 className="text-2xl text-primary-white-300">
              내가 좋아하는 시리즈
            </h3>
            {likedSeries.length > 0 ? (
              <>
                <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
                  {likedSeries.map((series) => (
                    <motion.div
                      layoutId={series.id + ""}
                      key={series.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      className="cursor-pointer relative bg-cover bg-center h-[150px] text-[66px] first:origin-left last:origin-right hover:z-10 rounded-md overflow-hidden"
                    >
                      {series.backdrop_path ? (
                        <Image
                          src={makeImagePath(series?.backdrop_path, "w500")}
                          alt={series.name}
                          fill
                        />
                      ) : (
                        "No Image"
                      )}
                      <Info
                        data={series as Omit<ITv, "genre_ids"> as ITv}
                        likeMovies={currentUser.likeMovies}
                        likeSeries={currentUser.likeSeries}
                        genres={series.genres}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <h3 className="text-primary-white-300 text-center text-xl">
                좋아하는 시리즈를 추가해주세요.
              </h3>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Page;
