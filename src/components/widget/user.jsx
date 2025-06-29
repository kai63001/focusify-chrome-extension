import { useEffect, useState } from "react";
import { auth, app } from "../../libs/firebase";
import { getPremiumStatus, getPortalUrl } from "../../libs/stripe";
import useUserDataStore from "../../store/userDataStore";
import { User as UserIcon, LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useWidgetControllerStore from "../../store/widgetControllerStore";

const User = () => {
  const { userName, setUserName, premium, setPremium } = useUserDataStore();
  const state = useWidgetControllerStore();
  const {
    addWidget,
    removeWidget,
    isWidgetOpen,
    bringToFront,
  } = useWidgetControllerStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;
      setPremium(newPremiumStatus);
    };

    const checkUserName = async () => {
      const newUserName = localStorage.getItem("userName") || "";
      setUserName(newUserName);
    };

    checkPremium();
    checkUserName();
  }, [setPremium, setUserName]);

  const toggleWidget = (widgetName) => {
    const isOpen = isWidgetOpen(widgetName)(state);
    if (isOpen) {
      removeWidget(widgetName);
    } else {
      addWidget(widgetName);
      bringToFront(widgetName);
    }
  };

  const handleUpgrade = () => {
    setIsOpen(false);
    toggleWidget("PricingTable");
  };

  const handleManageSubscription = async () => {
    try {
      toast.loading("Managing subscription", {
        position: "top-center",
      });
      const url = await getPortalUrl();
      window.location.href = url;
    } catch (error) {
      toast.error("Error managing subscription", {
        position: "top-center",
      });
      console.error(error);
    }
  };

  const handleLogout = () => {
    try {
      toast.loading("Logging out", {
        position: "top-center",
      });
      //remove all local storage
      localStorage.removeItem("userName");
      localStorage.removeItem("t0aqk323a");
      auth.signOut();
    } catch (error) {
      toast.error("Error logging out", {
        position: "top-center",
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="relative select-none">
        <button
          className="text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <UserIcon size={24} />
        </button>
        {isOpen && (
          <div className="absolute bottom-14 right-0 mt-2 w-60 bg-[#221B15]/70 backdrop-blur-lg rounded-md shadow-lg py-1 overflow-hidden">
            <ul>
              <li className="px-4 py-2 text-sm text-white capitalize">
                {userName || "Guest"}
              </li>
              <div className="h-px w-full bg-white/10"></div>
              {!premium && (
                <li
                  onClick={handleUpgrade}
                  className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                >
                  Upgrade to Premium
                </li>
              )}
              {premium && (
                <li
                  onClick={handleManageSubscription}
                  className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                >
                  Manage Subscription
                </li>
              )}
              <li
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default User;
