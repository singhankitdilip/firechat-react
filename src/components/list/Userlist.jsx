import { LogOut } from "lucide-react";
import avatar from "/avatar.png";
import { useUserStore } from "../store/userstore";
import { useChatStore } from "../store/chatStore";
import { auth } from "../../lib/firebase";


const Userlist = () => {
  const { resetChat } = useChatStore();

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  const { currentUser } = useUserStore();
  return (
    <div className="flex justify-between items-center p-3">
      <div className="flex justify-center items-center gap-2">
        <img
          className="w-12 h-12 rounded-full object-cover cursor-pointer "
          src={currentUser.avatar || avatar}
          alt=""
        />
        <h2 className="text-xl text-gray-300">{currentUser.username}</h2>
      </div>
      <div className="flex justify-center items-center gap-5">
        {/* <div className="relative flex items-center justify-center p-2 bg-gray-900 cursor-pointer rounded-xl hover:bg-gray-800">
          <LogOut className="size-5 " />
          <span className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
            Log Out
          </span>
        </div> */}
        <div className="flex items-center justify-center p-2 bg-gray-900 cursor-pointer rounded-xl hover:bg-gray-800">
          <LogOut className="w-5 h-5 group-hover:text-gray-400"  onClick={handleLogout}/>
        </div>
      </div>
    </div>
  );
};

export default Userlist;
