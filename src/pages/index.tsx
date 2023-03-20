import axios from "axios";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Navbar from "@/components/global/Navbar";
import Banner from "@/components/home/Banner";
import { IMovie } from "@/types";
import Slider from "@/components/home/Slider";

interface HomeProps {
  nowPlaying: IMovie[];
  popular: IMovie[];
  topRated: IMovie[];
  upcoming: IMovie[];
}

export async function getServerSideProps(context: NextPageContext) {
  const BASE_PATH = "https://api.themoviedb.org/3";
  const nowPlayingUrl = `${BASE_PATH}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const popularUrl = `${BASE_PATH}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const topRatedUrl = `${BASE_PATH}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const upcomingUrl = `${BASE_PATH}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const session = await getSession(context);
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
    <>
      <Navbar />
      <Banner movie={nowPlaying[0]} />
      <main>
        <Slider data={nowPlaying} topic="Now Playing" />
        <Slider data={popular} topic="Popular" />
        <Slider data={topRated} topic="Top Rated" />
        <Slider data={upcoming} topic="Upcoming" />
      </main>
    </>
  );
}
