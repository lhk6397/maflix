import { NextApiRequest, NextApiResponse } from "next";

import client from "@/libs/server/prismadb";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOption);

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
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
