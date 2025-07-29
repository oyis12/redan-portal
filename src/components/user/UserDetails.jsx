import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Button, notification } from "antd";
import { Context } from "../../context/Context";
import no_data from "../../assets/images/icons/no_data.png";
import check from "../../assets/images/icons/check.png";
import coin from "../../assets/images/icons/coin.png";
import wallet from "../../assets/images/icons/wallet.png";
import red_bin from "../../assets/images/icons/red_bin.png";
import policy from "../../assets/images/icons/policy.png";
import user from "../../assets/user.png";

const UserDetails = () => {
  const location = useLocation();
  const { userId } = useParams();
  const { state } = location;
  const record = state?.record;
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("block");
  const [userStatus, setUserStatus] = useState("");

  const { baseUrl, accessToken, userBlockedStatus, setUserBlockedStatus } =
    useContext(Context);

  // Helper function to format credits
  const formatCredits = (credits) => {
    return credits ? Number(credits).toLocaleString() : "0";
  };

  // Fetch user status when component mounts
  useEffect(() => {
    if (userId) {
      const fetchUserStatus = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/account/user-status/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const status = response.data.user.status;
          setUserStatus(status);
          setUserBlockedStatus(status); // Sync status in context
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      };

      fetchUserStatus();
    }
  }, [userId, baseUrl, accessToken, setUserBlockedStatus]);

  const blockUser = async () => {
    if (!userId) {
      console.error("No user ID available to block/unblock.");
      return;
    }

    const blkUserUrl = `${baseUrl}/account/user-status/${userId}`;
    setLoading(true);
    try {
      const response = await axios.put(
        blkUserUrl,
        { action },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const newStatus = response.data.user.status; // Fetch the new status from the API response
      setUserStatus(newStatus);
      setUserBlockedStatus(newStatus); // Sync status immediately after API call

      notification.success({
        message: `User ${newStatus === "block" ? "Blocked" : "Unblocked"}`,
        description: `The user has been ${
          newStatus === "block" ? "blocked" : "unblocked"
        }.`,
      });
    } catch (error) {
      console.error("Error handling user status:", error);
      notification.error({
        message: "Error",
        description:
          "An error occurred while trying to change the user status.",
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log(record.projects.length);

  if (!record) {
    return (
      <div className="relative top-14 p-4">
        <div className="bg-white rounded p-4">
          <p>No user data available.</p>
        </div>
      </div>
    );
  }

  // console.log(record);

  return (
    <div className="relative top-14 p-4">
      <div className="bg-white rounded p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <div className="rounded-full w-10 h-10 mr-2 overflow-hidden">
              {record.avatar ? (
                <img
                  src={record.avatar}
                  alt="User"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <img
                  src={user}
                  alt="User"
                  className="rounded-full w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="font-bold">{record.fullName || "No Name"}</h2>
              <div className="flex items-center justify-between w-full md:w-48">
                <p className="text-[.8rem]">
                  {record.phoneNumber || "No Phone"}
                </p>
                <div className="flex items-center">
                  {record.isVerified ? (
                    <img src={check} alt="" className="w-3 mr-1" />
                  ) : (
                    <img src={no_data} alt="" className="w-3 mr-1" />
                  )}
                  <span className="italic text-[.8rem]">
                    {record.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p>Credit Balance</p>
            <div className="flex items-center mt-1 pl-2">
              <img src={coin} alt="" className="w-7" />
              <span className="font-bold text-lg">
                {formatCredits(record.credits)}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <img src={wallet} alt="" className="w-4 mr-2" />
              <span>Purchase credit</span>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center">
              <h2 className="font-bold mr-2">Name:</h2>
              <h2>{record.fullName || "No Name"}</h2>
            </div>
            <div className="flex items-center mt-4">
              <h2 className="font-bold mr-2">Email:</h2>
              <h2>{record.email || "No Email"}</h2>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="font-bold mr-2">Username:</h2>
              <h2>{record.username || "No Username"}</h2>
            </div>
            <div className="flex items-center mt-4">
              <h2 className="font-bold mr-2">Location:</h2>
              <h2>{record.location || "No Location"}</h2>
            </div>
          </div>
        </div>

        {/* Project and Cutlist Stats */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center">
              <h2 className="font-bold mr-2">Projects Created:</h2>
              <span>{record.projects.length || "0"}</span>
            </div>
            <div className="flex items-center mt-3">
              <h2 className="font-bold mr-2">Cutlists Created:</h2>
              <span>{record.cutlistsCreated || "0"}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="font-bold mr-2">Projects Completed:</h2>
              <span>{record.projectsCompleted || "0"}</span>
            </div>
            <div className="flex items-center mt-3">
              <h2 className="font-bold mr-2">Cutlists Completed:</h2>
              <span>{record.cutlistsCompleted || "0"}</span>
            </div>
          </div>
          <div>
            <h2 className="font-bold mr-2">Recent Work:</h2>
            <div className="shadow-lg flex items-center p-3 rounded">
              <img src={policy} alt="" className="mr-2 w-5" />
              <div>
                <h2 className="font-bold">
                  {record.recentWorkTitle || "No Recent Work"}
                </h2>
                <p className="text-[.7rem]">
                  {record.recentWorkDescription || "No Description"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-between items-center">
          <div className="flex space-x-4">
            <Button className="flex items-center border-none rounded bg-[#ff000054] hover:!bg-[#ff000054] text-[#FF3D00] hover:!text-[#FF3D00] px-6 h-9 font-semibold">
              <img src={red_bin} alt="" className="mr-2 w-4" />
              Delete User
            </Button>
            {userBlockedStatus === "block" ? (
              <Button
                className="flex items-center rounded text-[#B0B2C3] hover:!text-[#B0B2C3] px-6 h-9 font-semibold border hover:!border-gray"
                onClick={() => {
                  setAction("unblock");
                  blockUser();
                }} // Set action to unblock and then call blockUser
                loading={loading}
              >
                <img src={no_data} alt="" className="mr-2 w-4" />
                {loading ? "Please wait..." : "Unblock User"}
              </Button>
            ) : userBlockedStatus === "active" ? (
              <Button
                className="flex items-center rounded text-[#B0B2C3] hover:!text-[#B0B2C3] px-6 h-9 font-semibold border hover:!border-gray"
                onClick={() => {
                  setAction("block");
                  blockUser();
                }} // Set action to block and then call blockUser
                loading={loading}
              >
                <img src={no_data} alt="" className="mr-2 w-4" />
                {loading ? "Please wait..." : "Block User"}
              </Button>
            ) : null}
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="rounded px-6 border-none h-9 font-semibold bg-[#F1B31C] hover:!bg-[#F1B31C] hover:!text-black">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
