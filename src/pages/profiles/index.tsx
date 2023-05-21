import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import client from "@/libs/server/prismadb";
import { IProfile } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]";

const images = [
  "/images/default-blue.png",
  "/images/default-red.png",
  "/images/default-slate.png",
  "/images/default-green.png",
];

interface ProfilesProps {
  profiles: IProfile[];
}

interface UserCardProps {
  profile: IProfile;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOption);
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  const currentUser = await client.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      profiles: true,
    },
  });

  if (!currentUser) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      profiles: currentUser.profiles,
    },
  };
}

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  const imgSrc = images[Math.floor(Math.random() * 4)];

  return (
    <div className="group flex-row w-44 mx-auto">
      <div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
        <img
          draggable={false}
          className="w-full h-full object-cover"
          src={profile.image ?? imgSrc}
          alt="profile image"
        />
      </div>
      <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">
        {profile.name}
      </div>
    </div>
  );
};

const Profiles = ({ profiles }: ProfilesProps) => {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const selectProfile = useCallback(
    (profileId: string) => {
      update({
        ...session,
        currentProfile: profileId,
      });
      router.push("/");
    },
    [router, session]
  );

  if (status === "authenticated") {
    return (
      <div className="flex items-center h-full justify-center">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-6xl text-white text-center">
            Who&#39;s watching?
          </h1>
          <div className="flex items-center justify-center gap-8 mt-10">
            {profiles.map((profile) => (
              <div key={profile.id} onClick={() => selectProfile(profile.id)}>
                <UserCard profile={profile} />
              </div>
            ))}
            {profiles.length < 5 && (
              <div
                onClick={() => router.push("/profiles/add")}
                className="group cursor-pointer flex items-center justify-center w-44 h-44 rounded-md border-[10px] border-primary-black-300 hover:border-white overflow-hidden"
              >
                <AiOutlinePlus className="w-36 h-36 text-primary-black-300 group-hover:text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Profiles;
