import { MdOutlineEdit } from "react-icons/md";
import useMutation from "@/hooks/useMutation";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { authOption } from "../api/auth/[...nextauth]";
import client from "@/libs/server/prismadb";
import { IProfile } from "@/types";
import axios from "axios";
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOption);
  const { profileId } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const profile = await client.profile.findUnique({
    where: {
      id: profileId as string,
    },
  });

  console.log(profile);
  return {
    props: {
      profile,
    },
  };
}

interface EditProfileProps {
  profile: IProfile;
}

interface EditProfileResult {
  ok: boolean;
}

const Edit = ({ profile }: EditProfileProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState<FileList>();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editProfile, { data, loading }] = useMutation<EditProfileResult>(
    "/api/profiles",
    "PUT"
  );

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0] as any;
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [image]);

  const onClickDeleteBtn = async (e: any) => {
    e.preventDefault();
    const res = await axios.delete(`/api/profiles?profileId=${profile.id}`);
    if (res.data?.ok) {
      router.push("/profiles");
    } else {
      throw new Error("서버 오류 발생");
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    if (image && image.length > 0 && profile) {
      const form = new FormData();
      form.append("file", image[0], profile.id + "");
      form.append("upload_preset", "ehedqmvh");
      const { url } = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      ).then((data) => data.json());
      editProfile({
        name,
        image: url,
        profileId: profile.id,
      });
    } else {
      editProfile({
        name,
        profileId: profile.id,
      });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/profiles`);
    }
  }, [data, router]);

  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="flex flex-col space-y-8 px-8 py-10 w-[40vw]">
        <h1 className="text-6xl">프로필 변경</h1>

        <div className="flex space-x-4 border-y-2 border-neutral-700 py-10">
          <div className="flex items-center space-x-3">
            {avatarPreview ? (
              <div className="cursor-pointer hover:bg-neutral-800 text-white w-[8vw] pb-[8vw] relative overflow-hidden rounded-md">
                <Image
                  src={avatarPreview}
                  fill
                  alt="avatar"
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <label
                htmlFor="image"
                className="cursor-pointer hover:bg-neutral-800 text-white w-[8vw] pb-[8vw] relative overflow-hidden rounded-md"
              >
                <Image
                  src={profile.image ?? "/images/default-blue.png"}
                  fill
                  alt="avatar"
                  className="w-full object-cover"
                />
                <div className="absolute bg-primary-black-300 text-white rounded-xl p-1 bottom-2 left-2">
                  <MdOutlineEdit className="w-5 h-5" />
                </div>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setImage(e.currentTarget.files as FileList)
                  }
                />
              </label>
            )}
          </div>
          <div className="w-full flex flex-col space-y-4">
            <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
              <input
                placeholder={profile.name}
                type="text"
                id="name"
                required={true}
                value={name}
                className="bg-neutral-700 px-6 py-3 rounded-md w-full placeholder:text-primary-white-300"
                onChange={(e: any) => setName(e.target.value)}
              />
            </form>
            <button
              className="w-full border-2 border-red-500 text-red-500 hover:text-red-600 hover:border-red-600 py-4"
              onClick={onClickDeleteBtn}
            >
              프로필 삭제
            </button>
          </div>
        </div>

        <div className="flex space-x-4" onClick={onSubmit}>
          <button className="bg-primary-white-300 hover:bg-primary-white-600 text-primary-black-600 rounded-md px-8 py-3">
            저장
          </button>
          <button className="bg-neutral-700 hover:bg-neutral-800 rounded-md px-8 py-3">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
