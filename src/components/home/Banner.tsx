import { AiOutlineInfoCircle } from "react-icons/ai";

import { makeImagePath } from "@/libs/client/makeImagePath";
import { IMovie, ITv, isMovie } from "@/types";

interface BannerProps {
  data: IMovie | ITv;
}

const Banner = ({ data }: BannerProps) => {
  return (
    <div className="relative h-[56.25vw]">
      <img
        src={makeImagePath(
          isMovie(data) ? data.backdrop_path : data.backdrop_path
        )}
        alt={isMovie(data) ? data.title : data?.name}
        className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500"
      />
      <div className="banner-gradient absolute w-full h-[56.25vw] top-0" />
      <div className="absolute top-[50%] -translate-y-[50%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {isMovie(data) ? data.title : data?.name}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {isMovie(data) ? data.overview : data?.overview}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <button className="bg-white text-white bg-opacity-30 rounded-md py-1 md:py-2 px-2 md:px-4w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
            <AiOutlineInfoCircle className="mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
