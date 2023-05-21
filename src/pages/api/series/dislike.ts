import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";
import { authOption } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOption);
    const { dataId } = req.body;

    if (!session || !session.user.currentProfile)
      return res.status(401).json({ error: "로그인이 필요합니다." });

    await client.likeSeries.deleteMany({
      where: {
        profileId: session?.user.currentProfile,
        seriesId: dataId + "",
      },
    });

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
