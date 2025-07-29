import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Cookies from "js-cookie";
import link from "../assets/images/icons/link.png";
import logo from "../assets/images/icons/logo_small.png";
import bell from "../assets/images/icons/bell.png";
import dashboard from "../assets/images/icons/dashboard.png";
import user_outline_2 from "../assets/images/icons/user_outline_2.png";
import policy_2 from "../assets/images/icons/policy_2.png";
import coin_dark from "../assets/images/icons/coin_dark.png";
import bell_dark from "../assets/images/icons/bell_dark.png";
import wallet from "../assets/images/icons/wallet.png";
import feedback from "../assets/images/icons/feedback.png";
import { Layout, Menu, Button } from "antd";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

const today = new Date();
const formattedDate = formatDate(today);

const items = [
  getItem(
    "Dashboard",
    "/dashboard",
    <img src={dashboard} alt="" className="w-1" />
  ),
  getItem(
    "Users",
    "/users",
    <img src={user_outline_2} alt="" className="w-1" />
  ),
  getItem("Cutlist", "/cutlist", <img src={policy_2} alt="" className="w-1" />),
  getItem(
    "Credit Packages",
    "/credit-packages",
    <img src={coin_dark} alt="" className="w-4" />
  ),
  getItem(
    "Notification",
    "/notification",
    <img src={bell_dark} alt="" className="w-1" />
  ),
  getItem("Payments", "/payment", <img src={wallet} alt="" className="w-5" />),
  getItem(
    "Feedback",
    "/feedback",
    <img src={feedback} alt="" className="w-4" />
  ),
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { loggedInUser, logout } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  let title = "Default Title";

  switch (location.pathname) {
    case "/dashboard":
      title = "Dashboard";
      break;
    case "/users":
      title = "Users";
      break;
    case location.pathname.startsWith("/user/") && "/user/":
      title = "User Profile";
      break;
    case "/cutlist":
      title = "Cutlist";
      break;
    case "/credit-packages":
      title = "Credit Packages";
      break;
    case "/notification":
      title = "Notification";
      break;
    case "/payment":
      title = "Payments";
      break;
    case "/feedback":
      title = "Feedbacks";
      break;
    default:
      title = "";
  }

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const handleLogout = () => {
    Cookies.remove("loggedInUser"); // Updated to correct cookie name
    Cookies.remove("accessToken"); // Remove accessToken cookie
    logout(); // Call logout from context
    navigate("/admin-login");
  };

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          backgroundColor: "#ffffff",
          borderTopRightRadius: "1rem",
          borderBottomRightRadius: "1rem",
          position: "fixed",
          height: "100vh",
        }}
      >
        <div className="p-4 text-xl font-bold flex items-center">
          <img src={logo} alt="" className="w-6 mx-2" />
          {!collapsed && <h2 className="text-[1rem]">Cutlist</h2>}
        </div>
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          className="custom-menu"
          onClick={handleMenuClick}
        />
        <div className="flex justify-center items-center flex-col relative top-10">
          <Button
            onClick={handleLogout}
            className={`flex items-center mt-10 text-sm font-semibold border-none hover:!text-black shadow-none ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <img src={link} alt="" className="w-4" />
            {!collapsed && <span className="hidden sm:inline">Log Out</span>}
          </Button>
        </div>
      </Sider>
      <Layout
        className="p-5"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <div
          className="fixed bg-[#F5F5F5] top-0 z-10 py-4 px-4"
          style={{
            left: collapsed ? "80px" : "200px",
            width: collapsed ? "calc(100% - 80px)" : "calc(100% - 200px)",
            transition: "left 0.3s, width 0.3s",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">{title}</h2>
              {title && (
                <p className="text-[.8rem]">
                  {title === "Users"
                    ? "Manage your users"
                    : title === "Credit Packages"
                    ? "Manage credit packages"
                    : title === "User Profile"
                    ? "Manage user profile"
                    : title === "Payments"
                    ? "Manage and monitor payments"
                    : title === "Feedbacks"
                    ? "Manage and reply to feedbacks"
                    : title === "Cutlist"
                    ? "Manage users cutlist"
                    : formattedDate}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center mr-6">
                <img src={bell} alt="" className="w-5" />
              </div>
              <div className="hidden sm:flex justify-center items-center">
                <div className="rounded-full w-10 h-10 mr-1 overflow-hidden">
                  <img
                    src={loggedInUser?.avatar}
                    alt=""
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[.9rem] relative top-1">
                    {loggedInUser?.fullName || "Guest"}
                  </p>
                  <span className="text-[.8rem] relative -top-1">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
