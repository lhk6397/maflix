import { signOut } from "next-auth/react";
import React from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import { MdOutlineEdit } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { IProfile } from "@/types";
import { useRouter } from "next/router";
interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const router = useRouter();
  const { data: current } = useCurrentUser();
  if (!visible) {
    return null;
  }

  return (
    <>
      {current ? (
        <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
          <div className="text-white text-xs flex flex-col gap-3">
            {current.user.profiles &&
              current.user.profiles.map((profile: IProfile) => (
                <div
                  key={profile.id}
                  className="px-3 group/item flex flex-row gap-3 items-center w-full"
                >
                  <img
                    className="w-8 h-8 rounded-md object-cover"
                    src={profile.image}
                    alt="account"
                  />
                  <p className="group-hover/item:underline">{profile.name}</p>
                </div>
              ))}
            <div
              className="px-3 py-2 flex space-x-2 items-center"
              onClick={() => router.push("/profiles/manage")}
            >
              <MdOutlineEdit className="w-8 h-8 text-white" />
              <span className="hover:underline underline-offset-4">
                프로필 관리
              </span>
            </div>
            <div
              className="px-3 py-2 flex space-x-2 items-center"
              onClick={() => router.push("/manageUser")}
            >
              <FiUser className="w-8 h-8 text-white" />
              <span className="hover:underline underline-offset-4">
                계정 관리
              </span>
            </div>
          </div>
          <hr className="bg-gray-600 border-0 h-px my-4" />
          <div
            onClick={() => signOut()}
            className="px-3 text-center text-white text-xs hover:underline"
          >
            넷플릭스에서 로그아웃
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AccountMenu;
