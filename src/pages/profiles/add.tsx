import useCurrentUser from "@/hooks/useCurrentUser";
import useMutation from "@/hooks/useMutation";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { authOption } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOption);
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

interface AddProfileResult {
  ok: boolean;
}

const Add = () => {
  const router = useRouter();
  const { data: current } = useCurrentUser();
  const [name, setName] = useState("");
  const [image, setImage] = useState<FileList>();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [addProfile, { data, loading }] =
    useMutation<AddProfileResult>("/api/profiles");

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0] as any;
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [image]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (image && image.length > 0 && current?.user) {
      const form = new FormData();
      form.append("file", image[0], current.user?.id + "");
      form.append("upload_preset", "ehedqmvh");
      const { url } = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      ).then((data) => data.json());
      addProfile({
        name,
        image: url,
      });
    } else {
      addProfile({
        name,
      });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/profiles`);
    }
  }, [data, router]);

  if (current) {
    return (
      <div className="h-screen flex justify-center items-center text-white">
        <div className="flex flex-col space-y-8 px-8 py-10 bg-primary-black-300 rounded-xl w-[35vw]">
          <h1 className="text-3xl">프로필 추가</h1>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <label htmlFor="name">프로필 이름</label>
            <input
              type="text"
              id="name"
              value={name}
              className="bg-neutral-700 px-6 py-3 rounded-md"
              onChange={(e: any) => setName(e.target.value)}
            />
            <div className="flex items-center space-x-3">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  width={48}
                  height={48}
                  alt="avatar"
                  className="w-14 h-14 rounded-full bg-slate-500"
                />
              ) : (
                <Image
                  src={current.user.image ?? "/images/default-blue.png"}
                  width={48}
                  height={48}
                  alt="avatar"
                  className="w-14 h-14 rounded-full bg-slate-500"
                />
              )}
              <label
                htmlFor="image"
                className="cursor-pointer bg-neutral-700 py-2 px-3 hover:bg-neutral-800 rounded-md text-white"
              >
                Change
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
            </div>
            <button className="w-full bg-neutral-700 rounded-md py-2">
              완료
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default Add;
