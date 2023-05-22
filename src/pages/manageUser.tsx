import Input from "@/components/Input";
import useCurrentUser from "@/hooks/useCurrentUser";
import useMutation from "@/hooks/useMutation";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const ManageUser = () => {
  const router = useRouter();
  const { data: current } = useCurrentUser();
  const [changePwdClicked, setChangePwdClicked] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [changePassword, { loading, data, error }] = useMutation(
    "/api/user/changePassword",
    "PUT"
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!curPassword || !newPassword || !checkPassword)
      throw new Error("모든 내용을 입력해주세요.");
    if (newPassword !== checkPassword)
      throw new Error("비밀번호가 일치하지 않습니다.");

    changePassword({ curPassword, newPassword, checkPassword });
    setNewPassword("");
    setCurPassword("");
    setCheckPassword("");
  };

  useEffect(() => {
    if (data?.ok) {
      setChangePwdClicked(false);
      alert("비밀번호 변경 완료!");
    }
  }, [data]);
  return (
    <div className="flex justify-center items-center text-primary-white-300">
      <div className="w-[40vw] px-8 py-10">
        <h1 className="text-6xl">계정 정보</h1>
        <div className="flex flex-col space-y-3 border-y-2 py-8 mt-4 divide-y-2">
          <div className="flex flex-col space-y-2 py-4">
            <h4 className="text-xl">유저아이디</h4>
            <span className="text-sm">@{current?.user.id}</span>
          </div>
          <div className="flex flex-col space-y-2 py-4">
            <h4 className="text-xl">이메일</h4>
            <span className="text-sm">
              이메일 인증 여부 {current?.user.emailVerified ? "✔️" : "❌"}
            </span>
            <div className="text-sm flex justify-between items-center">
              <span>{current?.user.email}</span>
              <span className="text-sky-500 underline underline-offset-2 cursor-pointer hover:text-sky-600">
                이메일 주소 변경
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 py-4">
            <h4 className="text-xl">비밀번호</h4>
            <div className="text-sm flex justify-between items-center">
              <span>
                {current?.user.hashedPassword &&
                  "*".repeat(current.user.hashedPassword.length)}
              </span>
              <span
                onClick={() => setChangePwdClicked((prev) => !prev)}
                className="text-sky-500 underline underline-offset-2 cursor-pointer hover:text-sky-600"
              >
                비밀번호 변경
              </span>
            </div>
            {changePwdClicked && (
              <form className="flex flex-col space-y-2" onSubmit={onSubmit}>
                <Input
                  id="curPwd"
                  label="현재 비밀번호"
                  onChange={(e: any) => setCurPassword(e.target.value)}
                  value={curPassword}
                  type="password"
                  required={true}
                />
                <Input
                  id="newPwd"
                  label="새로운 비밀번호"
                  onChange={(e: any) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type="password"
                  required={true}
                />
                <Input
                  id="checkPwd"
                  label="비밀번호 확인"
                  onChange={(e: any) => setCheckPassword(e.target.value)}
                  value={checkPassword}
                  type="password"
                  required={true}
                />
                <button className="px-4 rounded-md mx-auto hover:bg-neutral-800 bg-neutral-700 py-3">
                  {loading ? "비밀번호 변경 중" : "제출"}
                </button>
              </form>
            )}
          </div>
        </div>
        <div
          className="w-[8vw] mx-auto mt-4 text-center cursor-pointer bg-neutral-700 hover:bg-neutral-800 rounded-md py-4"
          onClick={() => router.push("/")}
        >
          완료
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
