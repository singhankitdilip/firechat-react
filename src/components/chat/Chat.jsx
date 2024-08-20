import avatar from "/avatar.png";
import phoneIcon from "/phone.png";
import videoIcon from "/video.png";
import infoIcon from "/info.png";
import emojiIcon from "/emoji.png";
import imageIcon from "/img.png";
import cameraIcon from "/camera.png";
import micIcon from "/mic.png";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import userinfoStore from "./../store/userinfo";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "./../store/chatStore";
import { useUserStore } from "./../store/userstore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const toggleVisibility = userinfoStore((state) => state.toggleVisibility);
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [noChatSelected, setNoChatSelected] = useState(true); // Track if no chat is selected

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (chatId) {
      setNoChatSelected(false); // A chat is selected
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChat(res.data());
      });

      return () => {
        unSub();
      };
    } else {
      setNoChatSelected(true); // No chat is selected
    }
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null

    try {
      if (image.file) {
        imgUrl = await upload(image.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImage({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  return (
    <div className="flex flex-2 flex-col">
      {noChatSelected ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-300">Select a user to chats</p>
        </div>
      ) : (
        <>
          <div className="flex p-4 justify-between align-center border-b border-gray-500">
            <div className="flex items-center gap-5">
              <img
                className="h-16 w-16 rounded-full object-cover cursor-pointer"
                src={user?.avatar || avatar}
                alt="avatar"
                onClick={toggleVisibility}
              />
              <div>
                <span className="font-bold text-lg text-gray-300">
                  {user?.username}
                </span>
                <p className="text-sm text-gray-400">online</p>
              </div>
            </div>
            <div className="flex gap-5 justify-center items-center">
              <img
                className="size-5 cursor-pointer"
                src={phoneIcon}
                alt="phone"
              />
              <img
                className="size-5 cursor-pointer"
                src={videoIcon}
                alt="video"
              />
              <img
                className="size-5 cursor-pointer"
                src={infoIcon}
                alt="info"
                onClick={toggleVisibility}
              />
            </div>
          </div>

          <div className="flex flex-col p-5 overflow-auto gap-5">
            {chat?.messages?.map((message) => (
              <div
                className={`${
                  message.senderId === currentUser?.id ? "self-end" : "self-start"
                } max-w-[70%] flex gap-3`}
                key={message.createdAt?.toMillis() || Math.random()}
              >
                {message.senderId !== currentUser?.id && (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.avatar || avatar}
                    alt=""
                  />
                )}
                <div
                  className={`flex-1 gap-1 flex-col ${
                    message.senderId === currentUser?.id
                      ? "bg-blue-950 text-gray-400 p-5 rounded-xl"
                      : "bg-gray-900/85 text-gray-400 p-5 rounded-xl"
                  }`}
                >
                  {message.img && <img src={message.img} alt="" className="rounded-xl" />}
                  <p>{message.text}</p>
                  <span className="text-gray-500 text-sm">
                    {format(message.createdAt.toDate())}
                  </span>
                </div>
                {message.senderId === currentUser?.id && (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentUser?.avatar || avatar}
                    alt=""
                  />
                )}
              </div>
            ))}
            <div ref={endRef}></div>
          </div>

          <div className="flex justify-between items-center p-5 border-t border-gray-500 gap-5 mt-auto">
            <div className="flex gap-5">
              <label htmlFor="file">
                <img
                  src={imageIcon}
                  alt="Upload"
                  className="size-5 cursor-pointer"
                />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleImg}
              />
              <img
                className="size-5 cursor-pointer"
                src={cameraIcon}
                alt="camera"
              />
              <img className="size-5 cursor-pointer" src={micIcon} alt="mic" />
            </div>
            <input
              className="flex-1 bg-gray-900 border-none outline-none text-white px-3 py-2 text-base rounded-xl"
              type="text"
              placeholder={
                isCurrentUserBlocked || isReceiverBlocked
                  ? "You cannot send a message"
                  : "Type a message..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
            <div className="flex relative">
              <img
                className="size-5 cursor-pointer"
                src={emojiIcon}
                alt="emoji"
                onClick={() => setOpen((prev) => !prev)}
              />
              {open && (
                <div className="absolute right-0 bottom-12">
                  <EmojiPicker onEmojiClick={handleEmoji} />
                </div>
              )}
            </div>
            <button
              className="bg-blue-500 px-2 py-2 rounded-xl text-white"
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
