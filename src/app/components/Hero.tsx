"use client";
import React, { useState } from "react";
import { ISignUp, IUser, loginUser, register } from "../utils/userApi";

const Hero = (props: {
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  handleButtonClick: () => void;
  user: IUser | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  token: string | undefined;
}) => {
  const [signUpObj, setSignUpObj] = useState<ISignUp>({
    email: "",
    name: "",
    password: "",
  });
  const [loginObj, setLoginObj] = useState({
    email: "",
    password: "",
  });

  const [currentAuthSelection, setCurrentAuthSelection] = useState("signUp");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  const handleSignUp = async () => {
    try {
      const postData = await register(signUpObj);
      console.log(postData);
      props.setUser(postData.user);
      props.setToken("Bearer " + postData.token);
      localStorage.setItem("token", postData.token);
      props.handleButtonClick();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const postData = await loginUser(loginObj);
      console.log(postData);
      props.setUser(postData.user);
      props.setToken("Bearer " + postData.token);
      localStorage.setItem("token", postData.token);

      props.handleButtonClick();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };
  return (
    <div className="text-white">
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto flex flex-col text-center justify-center">
        <p className="text-[#00df9a] font-bold p-2 ">
          Lets make rock solid Web App.
        </p>
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          Quick and Effective
        </h1>

        <div className="md:py-6">
          <p>Fast , flexible ....</p>
        </div>

        <div className="md:py-6 text-[#00df9a] mt-6 text-4xl flex justify-around text-center p-10">
          <p
            className="hover:underline cursor-pointer"
            onClick={() => setCurrentAuthSelection("signUp")}
          >
            SignUp{" "}
          </p>
          <p>/</p>
          <p
            className="hover:underline cursor-pointer"
            onClick={() => setCurrentAuthSelection("login")}
          >
            Login
          </p>
        </div>

        {currentAuthSelection === "signUp" ? (
          <div className="flex flex-col p-7  md:justify-center ">
            <input
              type="text"
              placeholder="name"
              className={
                errors.length > 0 && errors[0].field === "name"
                  ? "my-4 p-2 md:mr-2 text-black border-solid border-2 border-red-600"
                  : "my-4 p-2 md:mr-2 text-black"
              }
              value={signUpObj.name}
              onChange={(e) => {
                setSignUpObj((prev) => ({ ...prev, name: e.target.value }));
                setErrors([]);
              }}
            />

            <input
              type="text"
              placeholder="email"
              className={
                errors.length > 0 && errors[0].field === "email"
                  ? "my-4 p-2 md:mr-2 text-black border-solid border-2 border-red-600"
                  : "my-4 p-2 md:mr-2 text-black"
              }
              value={signUpObj.email}
              onChange={(e) => {
                setSignUpObj((prev) => ({ ...prev, email: e.target.value }));
                setErrors([]);
              }}
            />

            <input
              type="password"
              placeholder="password"
              className={
                errors.length > 0 && errors[0].field === "password"
                  ? "my-4 p-2 md:mr-2 text-black border-solid border-2 border-red-600"
                  : "my-4 p-2 md:mr-2 text-black"
              }
              value={signUpObj.password}
              onChange={(e) => {
                setSignUpObj((prev) => ({ ...prev, password: e.target.value }));
                setErrors([]);
              }}
            />

            <button
              className="bg-[#00df9a] hover:bg-white p-2 hover:text-[#00df9a] md:p-2"
              onClick={handleSignUp}
            >
              SignUp!
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-7  md:justify-center ">
            <input
              type="text"
              placeholder="email"
              className={
                errors.length > 0 && errors[0].field === "email"
                  ? "my-4 p-2 md:mr-2 text-black border-solid border-2 border-red-600"
                  : "my-4 p-2 md:mr-2 text-black"
              }
              value={loginObj.email}
              onChange={(e) => {
                setLoginObj((prev) => ({ ...prev, email: e.target.value }));
                setErrors([]);
              }}
            />

            <input
              type="password"
              placeholder="password"
              className={
                errors.length > 0 && errors[0].field === "password"
                  ? "my-4 p-2 md:mr-2 text-black border-solid border-2 border-red-600"
                  : "my-4 p-2 md:mr-2 text-black"
              }
              value={loginObj.password}
              onChange={(e) => {
                setLoginObj((prev) => ({ ...prev, password: e.target.value }));
                setErrors([]);
              }}
            />

            <button
              className="bg-[#00df9a] hover:bg-white p-2 hover:text-[#00df9a] md:p-2"
              onClick={handleLogin}
            >
              Login!
            </button>
          </div>
        )}
        {errors.length > 0 && errors[0].field === "email" && (
          <p className="text-red-600">* {errors[0].message}</p>
        )}
      </div>
    </div>
  );
};

export default Hero;
