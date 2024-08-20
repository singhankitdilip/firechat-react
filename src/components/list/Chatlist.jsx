import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react"; // Importing the close icon (X)
import search from "/search.png";
import plus from "/plus.png";
import minus from "/minus.png";
import avatar from "/avatar.png";
import AddUser from "../adduser/AddUser";
import { useUserStore } from "../store/userstore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../store/chatStore";

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const handleToggleAddMode = () => setAddMode((prev) => !prev);
  const handleCloseAddUser = () => setAddMode(false);


  const [input, setInput] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const updatedChats = chats.filter((chat) => chat.chatId !== chatToDelete);

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: updatedChats.map((chat) => {
          const { user, ...rest } = chat;
          return rest;
        }),
      });
      setChats(updatedChats);
      setShowDeletePopup(false);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 overflow-scroll">
      <div className="flex gap-5 p-3 justify-between items-center">
        <div className="flex flex-1 bg-gray-900 rounded-lg justify-center items-center gap-3 p-2">
          <img className="w-5 h-5" src={search} alt="search" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
            className="flex justify-center items-center flex-1 bg-transparent border-none outline-none text-white"
          />
        </div>
        <img
          className="w-8 h-8 cursor-pointer bg-gray-900 rounded-xl p-2"
          src={addMode ? minus : plus}
          onClick={handleToggleAddMode}
          alt="add"
        />
      </div>

      {/* chats section */}
      {filteredChats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#808080",
          }}
          className="flex items-center p-5 gap-5 cursor-pointer border-b border-gray-500 relative"
        >
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || avatar
            }
            alt="avatar"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-300">
              {chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}
            </span>
            <p className="text-sm text-gray-300">{chat.lastMessage}</p>
          </div>
          <Trash2
            className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-red-500"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the chat selection
              setChatToDelete(chat.chatId);
              setShowDeletePopup(true);
            }}
          />
        </div>
      ))}

      {addMode && <AddUser onClose={handleCloseAddUser} />}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-gray-900/55 p-10 rounded-lg backdrop-blur-md saturate-100">
            {/* Close Icon */}
            <X
              className="w-6 h-6 text-gray-300 cursor-pointer absolute top-3 right-3"
              onClick={() => setShowDeletePopup(false)}
            />
            <p>Are you sure you want to delete this chat?</p>
            <div className="flex justify-center gap-3 mt-3">
              <button
                className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatlist;
