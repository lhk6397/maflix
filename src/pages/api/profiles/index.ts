import serverAuth from "@/libs/server/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { currentUser } = await serverAuth(req, res);
      return res.status(200).json(currentUser);
    } else if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);
      const { name, image } = req.body;

      if (!currentUser)
        return res.status(401).json({ error: "로그인이 필요합니다." });

      await client.profile.create({
        data: {
          userId: currentUser.id,
          name,
          image,
        },
      });

      return res.status(200).json({
        ok: true,
      });
    } else if (req.method === "PUT") {
      const { currentUser } = await serverAuth(req, res);
      const { name, image, profileId } = req.body;

      if (!currentUser)
        return res.status(401).json({ error: "로그인이 필요합니다." });

      await client.profile.update({
        where: {
          id: profileId,
        },
        data: {
          userId: currentUser.id,
          name,
          image,
        },
      });

      return res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
