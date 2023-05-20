import serverAuth from "@/libs/server/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req);
    const { dataId } = req.body;

    if (!currentUser)
      return res.status(401).json({ error: "로그인이 필요합니다." });

    await client.likeMovie.deleteMany({
      where: {
        userId: currentUser.id,
        movieId: dataId + "",
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
