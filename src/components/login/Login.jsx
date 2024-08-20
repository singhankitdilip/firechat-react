import React, { useState } from "react";
import avatarimg from "/avatar.png";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);
    try {
       await signInWithEmailAndPassword (auth,email,password)
       toast.success("Logged in successfully!")
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
    finally{
      setLoading(false)
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);
    try {
      const imgUrl = await upload(avatar.file);

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        password,
        avatar:imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      e.target.reset();
      setLoading(false);
      toast.success("Account Created! You Can Login Now!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex justify-evenly items-center w-full">
        <div className="item flex flex-col gap-10 ">
          <h2 className="text-xl text-center">Welcome back</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              className="px-3 py-2 border-none rounded-lg bg-gray-900 focus:outline-none"
              type="text"
              placeholder="Email"
              name="email"
              required
            />
            <input
              className="px-3 py-2 border-none rounded-lg bg-gray-900 focus:outline-none"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-700 rounded-xl"
              disabled={loading}
            >
              {loading ? "Loading" : "Sign In"}
            </button>
          </form>
        </div>
        <div className="h-[80vh] w-[2px] bg-gray-600"></div>
        <div className="flex justify-center items-center flex-col gap-10">
          <h2 className="text-xl text-center">Create an Account</h2>
          <form
            onSubmit={handleRegister}
            className="flex justify-center flex-col gap-5"
          >
            <label
              htmlFor="file"
              className="cursor-pointer flex gap-5 items-center"
            >
              <img
                className="size-10 rounded-lg object-cover opacity-70"
                src={avatar?.url || avatarimg}
                alt="avatar"
              />
              Upload an image
            </label>
            <input
              type="file"
              id="file"
              className="p-3"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input
              className="px-3 py-2 rounded-lg border-none bg-gray-900 focus:outline-none"
              type="text"
              placeholder="Username"
              name="username"
              required
            />
            <input
              className="px-3 py-2 rounded-lg border-none bg-gray-900 focus:outline-none"
              type="text"
              placeholder="Email"
              name="email"
              required
            />
            <input
              className="px-3 py-2 rounded-lg border-none bg-gray-900 focus:outline-none"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-700  rounded-xl"
              disabled={loading}
            >
              {loading ? "Loading" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
