export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language?: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IMovieDetail extends Omit<IMovie, "genre_ids"> {
  genres: IGenre[];
}

export interface ITv {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvDetail extends Omit<ITv, "genre_ids"> {
  genres: IGenre[];
}

export interface ILike {
  id: string;
  movieId?: string;
  userId: string;
  seriesId?: string;
}

export function isMovie(data: IMovie | ITv): data is IMovie {
  return (<IMovie>data).title !== undefined;
}

export function isTv(data: ITv | IMovie): data is ITv {
  return (<ITv>data).name !== undefined;
}

export function isDetailMovie(
  data: IMovieDetail | ITvDetail
): data is IMovieDetail {
  return (<IMovieDetail>data).title !== undefined;
}

export function isDetailTv(data: ITvDetail | IMovieDetail): data is ITvDetail {
  return (<ITvDetail>data).name !== undefined;
}

export function isDetail(data: IMovieDetail | IMovie): data is IMovieDetail {
  return (<IMovieDetail>data).genres !== undefined;
}
