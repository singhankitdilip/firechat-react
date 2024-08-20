import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Details from "./components/details/Details";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useUserStore } from "./components/store/userstore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useEffect } from "react";

const App = () => {
 
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if(isLoading) return <div className="flex justify-center items-center text-2xl text-white bg-black">Loading ...</div>

  return (
    <div className="flex h-[95vh] w-[90vw] bg-gray-700/80 rounded-xl backdrop-blur-sm saturate-100 overflow-hidden">
      {currentUser ? (
 

        <>
          <List />
          <Chat />
          <Details />
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
