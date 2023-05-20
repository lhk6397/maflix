import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import client from "@/libs/server/prismadb";

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  const currentUser = await client.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      likeMovies: true,
      likeSeries: true,
    },
  });

  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
