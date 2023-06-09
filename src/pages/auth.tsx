import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import Input from "@/components/Input";
import useMutation from "@/hooks/useMutation";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";

interface MutationResult {
  ok: boolean;
}

interface TokenForm {
  token?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOption);

  if (session) {
    return {
      redirect: {
        destination: "/profiles",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [variant, setVariant] = useState("login");

  const [registerSubmit, { loading, data, error }] =
    useMutation<MutationResult>("/api/register");

  const [
    confirmToken,
    { loading: tokenLoading, data: tokenData, error: tokenError },
  ] = useMutation<MutationResult>("/api/confirm");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/profiles",
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    if (loading) return;
    try {
      registerSubmit({
        email,
        name,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  }, [loading, registerSubmit, email, name, password, data?.ok, login]);

  const onTokenValid = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenLoading) return;
    confirmToken({ token });
  };

  useEffect(() => {
    if (tokenData?.ok) {
      login();
    }
  }, [tokenData]);
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            {data?.ok ? (
              <>
                <h2 className="text-white text-4xl mb-8 font-semibold">
                  이메일 인증
                </h2>
                <form
                  onSubmit={onTokenValid}
                  className="flex flex-col mt-8 space-y-4"
                >
                  <Input
                    value={token}
                    id="token"
                    label="Confirmation Token"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setToken(e.target.value)
                    }
                  />
                </form>
                <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                  {tokenLoading ? "Loading" : "Confirm Token"}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-white text-4xl mb-8 font-semibold">
                  {variant === "login" ? "Sign in" : "Register"}
                </h2>

                <div className="flex flex-col gap-4">
                  {variant === "register" && (
                    <Input
                      id="name"
                      type="text"
                      label="Username"
                      value={name}
                      onChange={(e: any) => setName(e.target.value)}
                    />
                  )}
                  <Input
                    id="email"
                    type="email"
                    label="Email address or phone number"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  onClick={variant === "login" ? login : register}
                  className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
                >
                  {variant === "login" ? "Login" : "Sign up"}
                </button>
                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                  <div
                    onClick={() =>
                      signIn("google", { callbackUrl: "/profiles" })
                    }
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                  >
                    <FcGoogle size={32} />
                  </div>
                  <div
                    onClick={() =>
                      signIn("github", { callbackUrl: "/profiles" })
                    }
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                  >
                    <FaGithub size={32} />
                  </div>
                </div>
                <p className="text-neutral-500 mt-12">
                  {variant === "login"
                    ? "First time using Netflix?"
                    : "Already have an account?"}
                  <span
                    onClick={toggleVariant}
                    className="text-white ml-1 hover:underline cursor-pointer"
                  >
                    {variant === "login" ? "Create an account" : "Login"}
                  </span>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
