import React, { useState, useContext, useEffect } from "react";
import { Table, Button, Input, Dropdown, Menu, message } from "antd";
import { Context } from "../../context/Context";
import { ThreeDots } from "react-loader-spinner";
import Cookies from 'js-cookie';

import dots from "../../assets/images/icons/dots.png";
import user_2 from "../../assets/images/user_2.png";
import user_3 from "../../assets/images/user_3.png";
import user_1 from "../../assets/images/user_1.png";
import edit from "../../assets/images/icons/edit_outline.png";
import bin from "../../assets/images/icons/bin.png";
import archive from "../../assets/images/icons/archive.png";
import archive_btn from "../../assets/images/icons/archive_btn.png";
import axios from "axios";

import user from "../../assets/user.png";
import { Link, useNavigate } from "react-router-dom";


const Feedback = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourcedData, setSourcedData] = useState([])

  const { baseUrl, accessToken } = useContext(Context);

  const onSearch = (value) => {
    setSearchText(value);
  };


  const getFeedBack = async () => {
    setLoading(true);
    const feedBackUrl = `${baseUrl}/feedback/all-feedback`;

    try {
        const response = await axios.get(feedBackUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        message.success('Got all feedbacks');
        // console.log('Response Data:', response.data.feedback.sender);

        const feedbackArray = response.data.feedback;

        if (!Array.isArray(feedbackArray)) {
            throw new Error('Feedback data is not an array');
        }

        // Map _id to userId
        const userIds = feedbackArray.map(feedback => feedback.sender._id);
        // console.log('User IDs:', userIds);

        const sourcedData = feedbackArray.map((feedback) => {
            const createdAt = new Date(feedback.createdAt);
            const dateTime = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;

            // Format replies
            const replies = feedback.replies ? feedback.replies.map(reply => ({
                message: reply.message,
                createdAt: new Date(reply.createdAt),
            })) : [];

            return {
                key: feedback._id,
                message: feedback.message,
                subject: feedback.subject,
                fullName: feedback.sender.fullName,
                senderId: feedback.sender._id,
                createdAt: feedback.createdAt,
                avatar: feedback.sender.avatar || user,
                email: feedback.sender.email,
                dateTime,
                userIds
                // replies, // Include replies here if needed
            };
        });

        // console.log('Sourced Data with Replies:', sourcedData);
        setSourcedData(sourcedData);

    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle token expiration
        message.error("Session expired, please log in again.");
        Cookies.remove("loggedInUser");
        Cookies.remove("accessToken");
        setTimeout(() => {
          navigate("/admin-login");
        }, 3000);
      } else {
        console.error("Error fetching credits:", error);
      }
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    getFeedBack();
  }, []);

  // const filteredDataSource = fullDataSource.filter(
  //   (item) =>
  //     item.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.email.toLowerCase().includes(searchText.toLowerCase())
  // );

  const columns = [
    {
      title: "SN",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.avatar || user}
            alt="User"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              marginRight: 8,
              objectFit: "cover"
            }}
          />
          <span>{record.fullName}</span>
        </div>
      ),
    }, 
    
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Time",
      dataIndex: "dateTime",
    },

    {
      title: "",
      key: "operations",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "reply",
                label: (
                 <Link to={`/feedback/${record.key}`} state={{ record }}>
                   <span className="flex items-center">
                    <img
                      src={edit}
                      alt="Reply"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Reply 
                  </span>
                 </Link>
                ),
              },
              {
                key: "archive",
                label: (
                  <span className="flex items-center">
                    <img
                      src={archive}
                      alt="Deactivate"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Archive
                  </span>
                ),
              },
              {
                key: "delete",
                label: (
                  <span className="flex items-center">
                    <img
                      src={bin}
                      alt="Delete"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Delete
                  </span>
                ),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button>
            <img
              src={dots}
              alt="Actions"
              className="flex items-center justify-center w-1"
            />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="relative top-14">
      <div className="bg-white rounded p-4">
        <div className="flex items-center w-full mb-3 justify-end">
          <Input.Search
            className="w-44 mr-4"
            placeholder="Search"
            onSearch={onSearch}
          />
          <Button className="rounded px-2 h-8 font-semibold bg-[#F1B31C] hover:!bg-[#F1B31C] hover:!text-black border-none flex items-center">
            <img src={archive_btn} alt="" className="mr-2 w-5" />
            Archived
          </Button>
        </div>
        {loading ? ( <div className="flex justify-center items-center h-64">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#F1B31C"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass="three-dots-loading"
            />
          </div>) : (
             <Table
             columns={columns}
             dataSource={sourcedData}
             size="small"
             pagination={{
               pageSize: 5,
               position: ["bottomCenter"],
               className: "custom-pagination",
             }}
             className="custom-table"
             scroll={{ x: "max-content" }}
             rowSelection={{
               onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
             }}
           />
          )}
       
      </div>
    </div>
  );
};

export default Feedback;
