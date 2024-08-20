import React from "react";
import avatar from "/avatar.png";
import arrowup from "/arrowUp.png";
import arrowdown from "/arrowDown.png";
import download from "/download.png";
import userinfoStore from "./../store/userinfo";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../store/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../store/userstore";


const Details = () => {
  const isVisible = userinfoStore((state) => state.isVisible);


  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} =
  useChatStore();
const { currentUser } = useUserStore();

const handleBlock = async () => {
  if (!user) return;

  const userDocRef = doc(db, "users", currentUser.id);

  try {
    await updateDoc(userDocRef, {
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    });
    changeBlock();
  } catch (err) {
    console.log(err);
  }
};
  return (
    <>
      {isVisible ? null : (
        <div className="flex flex-1 flex-col border-l border-gray-500">
          {/* user */}
          <div className="flex justify-center items-center flex-col p-2 border-b border-gray-500 gap-2">
            <img
              className="size-20 rounded-full object-cover"
             src={user?.avatar || avatar} 
              alt=""
            />
            <h2 className="text-2xl font-semibold">{user?.username}</h2>
            <p className="text-base text-gray-400">
              Lorem ipsum dolor sit amet.
            </p>
          </div>

          {/* info */}
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-3 p-4">
              <div>
                {/* option */}
                <div className="flex justify-between items-center">
                  {/* title  */}
                  <span>Chat Setting</span>
                  <img className="size-5 cursor-pointer" src={arrowup} alt="" />
                </div>
              </div>

              <div>
                {/* option */}
                <div className="flex justify-between items-center">
                  {/* title  */}
                  <span>Privacy & Help</span>
                  <img className="size-5 cursor-pointer" src={arrowup} alt="" />
                </div>
              </div>

              <div>
                {/* option */}
                <div className="flex justify-between items-center">
                  {/* title  */}
                  <span>Shared Photos</span>
                  <img
                    className="size-5 cursor-pointer "
                    src={arrowdown}
                    alt=""
                  />
                </div>
                <div className="flex justify-between py-3 items-center border-b border-gray-700 ">
                  <div className="flex justify-center items-center gap-5">
                    <img
                      src="https://images.unsplash.com/photo-1439535184894-489a1f018921?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="object-cover size-9 rounded-xl"
                      alt=""
                    />
                    <span>Lorem-ipsum.jpg</span>
                  </div>

                  <img
                    className="size-5 cursor-pointer"
                    src={download}
                    alt=""
                  />
                </div>

                <div className="flex justify-between py-3 items-center border-b border-gray-700 ">
                  <div className="flex justify-center items-center gap-5">
                    <img
                      src="https://images.unsplash.com/photo-1439535184894-489a1f018921?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="object-cover size-9 rounded-xl"
                      alt=""
                    />
                    <span>Lorem-ipsum.jpg</span>
                  </div>

                  <img
                    className="size-5 cursor-pointer"
                    src={download}
                    alt=""
                  />
                </div>

                <div className="flex justify-between py-3 items-center border-b border-gray-700 ">
                  <div className="flex justify-center items-center gap-5">
                    <img
                      src="https://images.unsplash.com/photo-1439535184894-489a1f018921?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="object-cover size-9 rounded-xl"
                      alt=""
                    />
                    <span>Lorem-ipsum.jpg</span>
                  </div>

                  <img
                    className="size-5 cursor-pointer"
                    src={download}
                    alt=""
                  />
                </div>

                <div className="flex justify-between py-3 items-center border-b border-gray-700 ">
                  <div className="flex justify-center items-center gap-5">
                    <img
                      src="https://images.unsplash.com/photo-1439535184894-489a1f018921?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="object-cover size-9 rounded-xl"
                      alt=""
                    />
                    <span>Lorem-ipsum.jpg</span>
                  </div>

                  <img
                    className="size-5 cursor-pointer"
                    src={download}
                    alt=""
                  />
                </div>
              </div>

              <div>
                {/* option */}
                <div className="flex justify-between items-center">
                  {/* title  */}
                  <span>Shared Files</span>
                  <img className="size-5 cursor-pointer" src={arrowup} alt="" />
                </div>
              </div>
            </div>
            <div className="flex flex-col m-5 ">
              <button className="p-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-lg" onClick={handleBlock}>
              {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
              </button>
            </div>
          </div>
        </div>
      ) }
    </>
  );
};

export default Details;
