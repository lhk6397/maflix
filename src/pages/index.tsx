import axios from "axios";
import { GetServerSidePropsContext } from "next";

import Banner from "@/components/home/Banner";
import { IMovie } from "@/types";
import Slider from "@/components/home/Slider";
import Layout from "@/components/layout";
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";

interface HomeProps {
  nowPlaying: IMovie[];
  popular: IMovie[];
  topRated: IMovie[];
  upcoming: IMovie[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const BASE_PATH = "https://api.themoviedb.org/3";
  const nowPlayingUrl = `${BASE_PATH}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const popularUrl = `${BASE_PATH}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const topRatedUrl = `${BASE_PATH}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const upcomingUrl = `${BASE_PATH}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const session = await getServerSession(context.req, context.res, authOption);
  const nowPlaying = (await (await axios.get(nowPlayingUrl)).data).results;
  const popular = (await (await axios.get(popularUrl)).data).results;
  const topRated = (await (await axios.get(topRatedUrl)).data).results;
  const upcoming = (await (await axios.get(upcomingUrl)).data).results;
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (!session.user.currentProfile) {
    return {
      redirect: {
        destination: "/profiles",
        permanent: false,
      },
    };
  }

  return {
    props: {
      nowPlaying,
      popular,
      topRated,
      upcoming,
    },
  };
}

export default function Home({
  nowPlaying,
  popular,
  topRated,
  upcoming,
}: HomeProps) {
  return (
    <Layout>
      <Banner data={nowPlaying[0]} />
      <main>
        <Slider data={nowPlaying} topic="Now Playing" />
        <Slider data={popular} topic="Popular" />
        <Slider data={topRated} topic="Top Rated" />
        <Slider data={upcoming} topic="Upcoming" />
      </main>
    </Layout>
  );
}
