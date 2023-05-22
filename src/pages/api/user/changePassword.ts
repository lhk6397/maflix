import { hash, compare } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOption);
    const { curPassword, newPassword, checkPassword } = req.body;

    if (!session)
      return res.status(422).json({
        error: "로그인이 필요합니다.",
      });
    const user = await client.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user || !user.hashedPassword)
      return res.status(422).json({ error: "유저 정보가 존재하지 않습니다." });

    const isCorrectPassword = await compare(curPassword, user.hashedPassword);

    if (!isCorrectPassword)
      return res.status(401).json({
        error: "비밀번호가 일치하지 않습니다.",
      });

    await client.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        hashedPassword: await hash(newPassword, 12),
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
