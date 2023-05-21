import Layout from "@/components/layout";
import axios from "axios";
import { NextPageContext } from "next";
import React from "react";
import { IMovie, ITv } from "@/types";
import { useRouter } from "next/router";
import ItemCard from "@/components/ItemCard";

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
                <ItemCard item={movie} key={movie.id} />
              ))}
            </div>
          </>
        )}

        {tvSearchedData.length > 0 && (
          <>
            <h3 className="text-2xl text-primary-white-300">시리즈</h3>
            <div className="grid gap-x-[10px] grid-cols-6 gap-y-10">
              {tvSearchedData.map((tv) => (
                <ItemCard item={tv} key={tv.id} />
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
