import Layout from "@/components/layout";
import { IMovie, IMovieDetail, IProfile, ITv, ITvDetail, IUser } from "@/types";
import { GetServerSidePropsContext } from "next";
import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import client from "@/libs/server/prismadb";
import axios from "axios";
import ItemCard from "@/components/ItemCard";
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOption);

  if (!session?.user.email) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (!session?.user.currentProfile) {
    throw new Error("프로필 선택 필요.");
  }

  const currentProfile = await client.profile.findUnique({
    where: {
      id: session?.user.currentProfile,
    },
    include: {
      likeMovies: true,
      likeSeries: true,
    },
  });

  if (!currentProfile)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  let likedMovies: any[] = [];
  let likedSeries: any[] = [];

  for (const like of currentProfile?.likeMovies) {
    const url = `https://api.themoviedb.org/3/movie/${like.movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const res = await axios.get(url);
    if (res.data) {
      likedMovies.push(res.data);
    }
  }

  for (const like of currentProfile?.likeSeries) {
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
  const { data: current } = useCurrentUser();
  return (
    <Layout>
      {current && (
        <div className="py-[200px] px-[30px] space-y-32">
          <div className="space-y-10">
            <h3 className="text-2xl text-primary-white-300">
              내가 좋아하는 영화
            </h3>
            {likedMovies.length > 0 ? (
              <>
                <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
                  {likedMovies.map((movie) => (
                    <ItemCard
                      item={movie as Omit<IMovie, "genre_ids"> as IMovie}
                      key={movie.id}
                      genres={movie.genres}
                    />
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
                    <ItemCard
                      item={series as Omit<ITv, "genre_ids"> as ITv}
                      key={series.id}
                      genres={series.genres}
                    />
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
