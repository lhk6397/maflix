import axios from "axios";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Banner from "@/components/home/Banner";
import { ITv } from "@/types";
import Slider from "@/components/home/Slider";
import Layout from "@/components/layout";

interface HomeProps {
  airingToday: ITv[];
  onTheAir: ITv[];
  popular: ITv[];
  topRated: ITv[];
}

export async function getServerSideProps(context: NextPageContext) {
  const BASE_PATH = "https://api.themoviedb.org/3";
  const airingTodayUrl = `${BASE_PATH}/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const onTheAirUrl = `${BASE_PATH}/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const popularUrl = `${BASE_PATH}/tv/popular?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const topRatedUrl = `${BASE_PATH}/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&page=1`;
  const session = await getSession(context);
  const airingToday = (await (await axios.get(airingTodayUrl)).data).results;
  const onTheAir = (await (await axios.get(onTheAirUrl)).data).results;
  const popular = (await (await axios.get(popularUrl)).data).results;
  const topRated = (await (await axios.get(topRatedUrl)).data).results;

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
      airingToday,
      onTheAir,
      popular,
      topRated,
    },
  };
}

export default function Series({
  airingToday,
  onTheAir,
  popular,
  topRated,
}: HomeProps) {
  return (
    <Layout>
      <Banner data={airingToday[0]} />
      <main>
        <Slider data={airingToday} topic="Airing Today" />
        <Slider data={onTheAir} topic="On The Air" />
        <Slider data={popular} topic="Popular" />
        <Slider data={topRated} topic="Top Rated" />
      </main>
    </Layout>
  );
}
