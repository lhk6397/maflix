import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/server/serverAuth";
import client from "@/libs/server/prismadb";
import { getServerSession } from "next-auth";
import { authOption } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOption);
    const { currentUser } = await serverAuth(req, res);

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

    return res.status(200).json({
      user: currentUser,
      profile: currentProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
