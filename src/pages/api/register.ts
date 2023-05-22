import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/prismadb";
import smtpTransport from "@/libs/server/emailConfirm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, name, password } = req.body;
    const payload = Math.floor(100000 + Math.random() * 900000) + "";

    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser)
      return res.status(422).json({ error: "이미 계정이 존재합니다." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const token = await client.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              email,
              name,
              hashedPassword,
              image: "/images/default-blue.png",
            },
          },
        },
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Netfilx Clone Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
        if (error) {
          console.log(error);
          throw new Error(error.message);
        } else {
          console.log(responses);
          return null;
        }
      }
    );
    smtpTransport.close();

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
