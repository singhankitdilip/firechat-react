import avatar from "/avatar.png";
import { db } from "../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useUserStore } from "../store/userstore";
import { useState } from "react";
import { X } from "lucide-react";

const AddUser = ({ onClose }) => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-900/65 backdrop-blur-md rounded-xl absolute left-0 right-0 top-0 bottom-0 m-auto w-max h-max p-5 gap-5 flex flex-col">
      <form onSubmit={handleSearch} className="flex gap-4 flex-col">
        <div className="flex justify-between w-full">
          <span className="text-xl ">Search Users</span>
          <X
            className="w-6 h-6 text-gray-300 cursor-pointer  "
            onClick={onClose}
          />
        </div>

        <div className="flex gap-4">
          <input
            className="rounded-lg p-2 focus:outline-none"
            type="text"
            placeholder="Username"
            name="username"
          />
          <button className="bg-blue-500 p-2 rounded-xl hover:bg-blue-700">
            Search
          </button>
        </div>
      </form>
      {user && (
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <img
              className="size-10 rounded-lg object-cover opacity-70"
              src={user.avatar || avatar}
              alt=""
            />
            <span>{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-500 p-2 rounded-xl hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
