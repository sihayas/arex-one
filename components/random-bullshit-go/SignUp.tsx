import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <div className="w-full h-96">
        <section>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                {/* <!-- Branding --> */}
                <div className="flex items-end flex-wrap">
                  <Link
                    href="#"
                    className="flex w-full items-center text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    <Image
                      priority
                      className=""
                      src="/images/icons/nav/logo3.svg"
                      alt="logo"
                      width={128}
                      height={128}
                    />
                  </Link>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    sign up.
                  </h1>
                </div>
                {/* <!-- Form -->*/}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                  action="https://rhapsody-iota.vercel.app/api/signup"
                >
                  <div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="email"
                      required
                    ></input>
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="flex justify-end  text-sm font-medium text-gray-900 dark:text-white"
                    >
                      username must be unique*
                    </label>
                    <input
                      id="username"
                      type="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    ></input>
                  </div>
                  {/* <div>
                  <label
                    htmlFor="name"
                    className="flex justify-end text-sm font-medium text-gray-900 dark:text-white"
                  >
                    the name you want everyone to see*
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  ></input>
                </div> */}
                  <div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    ></input>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#FECE44] border border-transparent hover:border hover:border-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full"
                  >
                    submit
                  </button>
                  {/* Google Sign Up  */}
                  <div
                    id="g_id_onload"
                    data-client_id="199338906869-0n1pucaiujjn5gaegqcpaq30khpmuu10.apps.googleusercontent.com"
                    data-context="use"
                    data-ux_mode="popup"
                    data-login_uri="http://localhost:3000/"
                    data-auto_prompt="false"
                  ></div>

                  <div
                    className="g_id_signin"
                    data-type="standard"
                    data-shape="pill"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="medium"
                    data-logo_alignment="left"
                  ></div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    have an account already?{" "}
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      sign in
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignupForm;
