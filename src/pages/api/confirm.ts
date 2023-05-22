import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: {
      user: true,
    },
  });

  if (!foundToken) return res.status(404).end();

  await client.user.update({
    where: {
      id: foundToken.userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  return res.status(200).json({
    ok: true,
  });
}
