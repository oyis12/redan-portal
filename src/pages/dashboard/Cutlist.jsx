import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  Dropdown,
  Menu,
  Select,
  Radio,
  message,
} from "antd";
import { Context } from "../../context/Context";
import { ThreeDots } from "react-loader-spinner";
import plus from "../../assets/images/icons/plus.png";
import dots from "../../assets/images/icons/dots.png";
import bin from "../../assets/images/icons/bin.png";
import send from "../../assets/images/icons/send-light.png";
import view from "../../assets/images/icons/view.png";
import arrow from "../../assets/images/icons/arrow_long_right.png";
import full_list from "../../assets/images/icons/full_list.png";
import checkbox from "../../assets/images/icons/checkbox_full.png";
import check from "../../assets/images/icons/check.png";
import no_data from "../../assets/images/icons/no_data.png";

import Users from "../../components/allUsers/AllUsers";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Cutlist = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [previewCutlist, setPreviewCutlist] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [sideModal, setSideModal] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [tabledata, setTabledata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState("Create");

  const { baseUrl, accessToken, apiCall } = useContext(Context);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCutlist, setSelectedCutlist] = useState(null);
  const [singleCutlist, setSingleCutlist] = useState(false);
  const [previewTask, setPreviewTask] = useState(false);
  const [prevSingleCutlist, setPrevSingleCutlist] = useState([]);
  const [task, setTask] = useState([]);

  const [cutType, setCutType] = useState("Door Cut");
  const [projectName, setProjectName] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");

  const [form] = Form.useForm();

  const handleRadioChange = (key) => {
    setSelectedRole(key);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const getCutList = async () => {
    const cutList = `${baseUrl}/admin/tasks`;
    setLoading(true)
    try {
      const response = await axios.get(cutList, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // console.log(response)
      // Sort by createdAt in descending order, assuming createdAt is part of the data
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      setTabledata(sortedData); // Set sorted data to table
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
    getCutList();
  }, [accessToken, baseUrl]);
  
  useEffect(() => {
    const getCategory = async () => {
      const categoryUrl = `${baseUrl}/all-cat`;
      try {
        const response = await axios.get(categoryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const categoryData = response.data;
        // console.log(categoryData);
        // console.log("from thop", categoryData._id);
        setCategories(categoryData);
      } catch (error) {
        console.log("error", error);
      }
    };

    getCategory();
  }, [accessToken, baseUrl]);

  const perviewCut = async () => {
    setLoading(true);
    const preUrl = `${baseUrl}/task/preview`;
    const cutListData = {
      categoryId: selectedCategoryId,
      userId: user,
      name: projectName,
      measurement: { height, width, depth },
      material: "MDF",
    };

    try {
      const response = await axios.post(preUrl, cutListData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data.task;
      setPreviewTask(true);
      setSideModal(false);
      setTask(data.cutlist);
      console.log(response.data.task._id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createCutlist = async () => {
    const cutListUrl = `${baseUrl}/task/save`;
    const cutListData = {
      categoryId: selectedCategoryId, // Ensure this is valid
      userId: user,  // Ensure this is valid and correct user ID
      name: projectName, // Ensure non-empty name
      measurement: {
        height: Number(height), // Ensure this is a number
        width: Number(width),   // Ensure this is a number
        depth: Number(depth),   // Ensure this is a number
      },
      material: "MDF", // Ensure this is valid if it needs to match predefined materials
    };
  
    setLoading(true);
    console.log("Cut List Data being sent:", cutListData); // Log data before sending
  
    try {
      const response = await axios.post(cutListUrl, cutListData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      message.success("Cut List Created Successfully!");
  
      // Clear the form input fields
      setProjectName("");
      setHeight("");
      setWidth("");
      setDepth("");
      setSelectedCategoryId("");
      setUser("");
  
      // Extract the cutlist data from the response
      const data = response.data.cutlist;
      setPreviewData(data);
      setSideModal(false);
      setPreviewTask(false);
  
      getCutList(); // Refresh the cutlist after creation
  
    } catch (error) {
      // Log full error response for debugging
      console.error("Full error response:", error.response);
  
      // Improved error handling with more detailed message
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message || "An unknown error occurred"
          : "Network error. Please try again.";
  
      message.error(`Failed to create Cut List: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  // const createCutlit = async () => {
  //   const cutListUrl = `${baseUrl}/task`;
  //   const cutListData = {
  //     categoryId: selectedCategoryId,
  //     userId: user,
  //     name: projectName,
  //     measurement: { height, width, depth },
  //     material: "MDF",
  //   };

  //   setLoading(true); // Start loading
  //   console.log(cutListData);

  //   try {
  //     const response = await axios.post(cutListUrl, cutListData, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     message.success("Cut List Created");
  //     setPreviewCutlist(true);
  //     setSideModal(false);
  //     // form.resetFields();
  //     const data = response.data.cutlist;
  //     setPreviewData(data);
  //     console.log(data);
  //   } catch (error) {
  //     if (error.response) {
  //       message.error(
  //         `Error: ${error.response.data.message || "An error occurred"}`
  //       );
  //     } else if (error.request) {
  //       message.error("No response received from server.");
  //     } else {
  //       message.error(`Error: ${error.message}`);
  //     }
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };

  useEffect(() => {
    if (!accessToken) return;

    const getUsers = async () => {
      const allUsers = `${baseUrl}/admin/all-users`;

      setLoading(true);
      try {
        const response = await axios.get(allUsers, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log(response.data.data);
        const sourcedData = response.data.data.map((user) => ({
          key: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber.replace(/^(\+234)/, ""), // Remove the +234 prefix
          status: user.status,
          isVerified: user.isVerified,
          credits: user.credits,
          // email: user.email,
          // projects: user.projects,
          // Add other fields as needed
        }));
        setDataSource(sourcedData);
      } catch (error) {
        console.error("Error while getting records:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [baseUrl, accessToken]);

  const createCutList = async (cutListData) => {
    try {
      const response = await axios.post(`${baseUrl}/task`, cutListData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Cut list created successfully:", response.data);

      // Close the modal and reset state after successful creation
      setSideModal(false);
      setModalMode("Create");
      setSelectedCutlist({});
      form.resetFields();
    } catch (error) {
      console.log("Error creating cut list:", error);
      // Optionally handle error state or display a notification
    }
  };

  const getModalTitle = () => {
    if (modalMode === "Edit") {
      return "Edit Cut List";
    } else if (modalMode === "Create") {
      return "Create Cut List";
    }
    return null; // Default case
  };

  const openUserModal = () => {
    setUserModal(false);
    form.resetFields();
  };

  const handleUserModal = () => {
    console.log("Current User State:", user); // Debug log
    if (!user) {
      message.warning("Please select a user");
    } else {
      console.log("Selected User ID:", user);
      setIsModalOpen(true);
      setUserModal(false);
    }
  };

  const createCut = () => {
    createCutList();
    // setPreviewCutlist(true);
  };

  const handleModal = () => {
    setIsModalOpen(false);
    setSideModal(true);
  };

  const closeSideBar = () => {
    setSideModal(false);
    // setPreviewCutlist(false);

    setProjectName("");
    setHeight("");
    setWidth("");
    setDepth("");
    setSelectedCategory("");
    setUser("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategory("");
  };

  const deleteTasks = (record) => {
    const id = record.key;
    const removeTask = `${baseUrl}/tasks/${id}`;

    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.delete(removeTask, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          // console.log(response);
          message.success(response.data.message)
          getCutList()
        } catch (error) {
          console.log(error);
          message.error(error.message)
        }
      },
    });
  };

  const viewTask = async (record) => {
    const id = record.key;
    const viewCut = `${baseUrl}/admin/task/${id}`;
    try {
      setLoading(true); // Start loading
      const response = await axios.get(viewCut, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response.data.cutlist);
      const data = response.data.cutlist;
      setPrevSingleCutlist(Array.isArray(data) ? data : []);
      setSingleCutlist(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  };

  const Tablecolumns = [
    {
      title: "SN",
      key: "sn",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Cut Type",
      dataIndex: "cut_type",
    },
    {
      title: "Height",
      dataIndex: "height",
    },
    {
      title: "Width",
      dataIndex: "width",
    },
    {
      title: "Depth",
      dataIndex: "depth",
    },
    {
      title: "",
      key: "operations",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: (
                  <span
                    className="flex items-center"
                    onClick={() => viewTask(record)}
                  >
                    <img
                      src={view}
                      alt="View"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    View
                  </span>
                ),
              },
              {
                key: "edit",
                label: (
                  <span
                    className="flex items-center"
                    onClick={() => handleView(record)}
                  >
                    <img
                      src={send}
                      alt="Edit"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Edit
                  </span>
                ),
              },
              {
                key: "delete",
                label: (
                  <span
                    className="flex items-center"
                    onClick={() => deleteTasks(record)}
                  >
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

  const columns = [
    {
      dataIndex: "select",
      width: 50,
      render: (_, record) => (
        <Radio
          checked={selectedRole === record.key}
          onChange={() => handleRadioChange(record.key)}
          onClick={() => setUser(record.key)}
        />
      ),
    },
    {
      title: "All User",
      dataIndex: "fullName",
      width: 200,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const isActive = status === "active";
        const className = isActive
          ? "bg-[#5EDA79] text-[#1F7700] px-3 py-1 rounded-full"
          : "bg-[#FF000042] text-[#FF3D00] px-3 py-1 rounded-full";
        return (
          <span className={className}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
      width: 100,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      width: 150,
      render: (phoneNumber) => `+234${phoneNumber}`,
    },
    {
      title: "Verification",
      dataIndex: "isVerified",
      render: (isVerified) => (
        <span className="flex items-center">
          <img
            src={isVerified ? check : no_data}
            alt={isVerified ? "Verified" : "Unverified"}
            style={{ width: 18, height: 18, marginRight: 8 }}
          />
          {isVerified ? "Verified Phone Number" : "Unverified Phone Number"}
        </span>
      ),
      width: 200,
    },
  ];

  const handleCategoryChange = (value, option) => {
    setSelectedCategory(value);
    form.resetFields();
    setSelectedCategoryId(option.key);
  };

  const handleView = (record) => {
    setSelectedCutlist({
      cutType: record.cut_type,
      projectName: record.name,
      height: record.height,
      width: record.width,
      depth: record.depth,
    });
    setModalMode("Edit");
    setSideModal(true);
  };

  return (
    <div className="relative top-14">
      <div className="flex justify-end"></div>
      <div className="bg-white rounded p-4">
        <div className="flex justify-end mb-3">
          <Button
            // onClick={() => setIsModalOpen(true)}
            onClick={() => setUserModal(true)}
            className="flex items-center bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black rounded p-2 px-3"
          >
            <img src={plus} alt="Plus Icon" className="w-3 mr-1" />
            Create Cutlist
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
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
          </div>
        ) : (
          <Table
            columns={Tablecolumns}
            dataSource={tabledata.map((item) => ({
              key: item._id,
              ...item.measurement,
              name: item.user.fullName,
              cut_type: item.name,
            }))}
            size="small"
            pagination={{
              pageSize: 7,
              position: ["bottomCenter"],
              className: "custom-pagination",
            }}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        )}

        {/* select category modal */}
        <Modal
          title="Create Cut List"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
          width={350}
        >
          <Form
            name="notificationForm"
            initialValues={{ remember: true }}
            onFinish={handleModal}
            className="mt-6"
          >
            <div className="flex flex-col">
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please select a category!",
                  },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <Select.Option key={category._id} value={category.name}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-end">
              <Form.Item>
                <Button
                  htmlType="submit" // Submit the form
                  className="bg-[#F2C94C] hover:!bg-[#F2C94C] hover:!text-black border-none p-3 px-3 rounded-full h-8 flex justify-center items-center text-[.7rem]"
                >
                  Create Project
                  <img src={arrow} alt="" className="h-4 w-4 ml-3" />
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
        {/* select category modal */}

        <Modal
          title="Preview Cutlist"
          open={previewTask}
          onCancel={() => setPreviewTask(false)}
          footer={[
            <div className="flex justify-center " key="footer">
              <Button
              loading={loading}
                htmlType="submit"
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                onClick={() => createCutlist()}
              >
                {loading ? 'Please wait...' : 'Save Cut List'}
              </Button>
            </div>,
          ]}
          width={400}
          className="custom-modal"
          getContainer={false}
        >
          <div>
            {task.map((e) => (
              <div className="mt-3 m-auto w-5/6" id={e._id}>
                <span className="font-sm font-semibold">{e.part}</span>
                <div className="flex justify-between items-center border-b-[.1rem]">
                  <div className="flex items-center mt-1 pb-2">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      L - &nbsp;
                    </span>
                    <p className="font-bold">{e.length}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      W - &nbsp;
                    </span>
                    <p className="font-bold">{e.width}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      Q - &nbsp;
                    </span>
                    <p className="font-bold">{e.quantity}</p>
                    <img src={full_list} alt="" className="w-3 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>

        {/* <Modal
          title="Preview Cutlist"
          open={previewCutlist}
          onCancel={() => setPreviewCutlist(false)}
          footer={[
            <div className="flex justify-center " key="footer">
              <Button
                htmlType="submit"
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                onClick={() => setPreviewCutlist(false)}
              >
                Done
              </Button>
            </div>,
          ]}
          width={400}
          className="custom-modal"
          getContainer={false}
        >
          <div>
            {previewData.map((e) => (
              <div className="mt-3 m-auto w-5/6" id={e._id} key={e._id}>
                <span className="font-sm font-semibold">{e.part}</span>
                <div className="flex justify-between items-center border-b-[.1rem]">
                  <div className="flex items-center mt-1 pb-2">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      L - &nbsp;
                    </span>
                    <p className="font-bold">{e.length}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      W - &nbsp;
                    </span>
                    <p className="font-bold">{e.width}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#F2994A] font-semibold text-[.6rem]">
                      Q - &nbsp;
                    </span>
                    <p className="font-bold">{e.quantity}</p>
                    <img src={full_list} alt="" className="w-3 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal> */}

        {/* view single cutlist */}
        {loading ? (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-40">
            {/* <div className="text-white">Loading...</div> */}
          </div>
        ) : (
          <Modal
            title="Preview Cutlist"
            open={singleCutlist}
            onCancel={() => setSingleCutlist(false)}
            footer={[
              <div className="flex justify-center " key="footer">
                <Button
                  htmlType="submit"
                  className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                  onClick={() => setSingleCutlist(false)}
                >
                  Done
                </Button>
              </div>,
            ]}
            width={400}
            className="custom-modal"
            getContainer={false}
          >
            <div>
              {Array.isArray(prevSingleCutlist) &&
                prevSingleCutlist.map((e) => (
                  <div className="mt-3 m-auto w-5/6" id={e._id} key={e._id}>
                    <span className="font-sm font-semibold">{e.part}</span>
                    <div className="flex justify-between items-center border-b-[.1rem]">
                      <div className="flex items-center mt-1 pb-2">
                        <span className="text-[#F2994A] font-semibold text-[.6rem]">
                          L - &nbsp;
                        </span>
                        <p className="font-bold">{e.length}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#F2994A] font-semibold text-[.6rem]">
                          W - &nbsp;
                        </span>
                        <p className="font-bold">{e.width}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#F2994A] font-semibold text-[.6rem]">
                          Q - &nbsp;
                        </span>
                        <p className="font-bold">{e.quantity}</p>
                        <img src={full_list} alt="" className="w-3 ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Modal>
        )}
        {/* view single cutlist */}

        {/* create cutlist modal */}
        {/* <Modal
          title={<div className="flex justify-center">{getModalTitle()}</div>}
          width={400}
          open={sideModal}
          onCancel={closeSideBar}
          footer={[
            <div className="flex justify-center " key="footer">
              <Button
                loading={loading} // Show loading spinner
                htmlType="submit"
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                onClick={() => createCutlit()}
              >
                {loading ? "Please wait..." : "Create Cutlist"}
                <img src={arrow} alt="" className="h-4 w-4 ml-1" />
              </Button>
            </div>,
          ]}
          className="custom-modal"
          getContainer={false}
        >
          <div>
            <div>
              <h2 className="font-semibold">Cut Type</h2>
              <div className="flex gap-6 mt-1">
                <Button className="rounded-full bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black">
                  Door Cut
                </Button>
                <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
                  Window Cut
                </Button>
                <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
                  Bed Cut
                </Button>
              </div>
            </div>
            <div className="mt-10">
              <Input
                placeholder="Enter Project Name"
                value={selectedCutlist?.cutType || cutType}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Measuremente</h2>
                <span className="text-[#f2994a]">(2 Long)</span>
              </div>
              <div className="flex gap-6 mt-1">
                <Input
                  placeholder="Height"
                  type="number"
                  value={selectedCutlist?.height || height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <Input
                  placeholder="Width"
                  type="number"
                  value={selectedCutlist?.width || width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <Input
                  placeholder="Depth"
                  type="number"
                  value={selectedCutlist?.depth || depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-52 border-t-[.1rem]">
              <p className="mt-3">
                <span className="text-[#F2994A] font-semibold text-lg">
                  LNG &nbsp;
                </span>
                - Means (Long).
              </p>
              <p>
                <span className="text-[#F2994A] font-semibold text-lg">
                  F-E-T&nbsp;
                </span>
                - Means (Long).
              </p>
              <p>
                <span className="text-[#F2994A] font-semibold text-lg">
                  & &nbsp;
                </span>
                - Means (And).
              </p>
            </div>
          </div>
        </Modal> */}

        <Modal
          title={
            <div className="flex justify-center">{/* Your modal title */}</div>
          }
          width={400}
          open={sideModal}
          onCancel={closeSideBar}
          footer={[
            <div className="flex justify-center" key="footer">
              <Button
                loading={loading}
                htmlType="submit"
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                onClick={async () => await perviewCut()}
              >
                {loading ? "Please wait..." : "Preview Cutlist"}
                <img src="path/to/arrow.png" alt="" className="h-4 w-4 ml-1" />
              </Button>
            </div>,
          ]}
          className="custom-modal"
          getContainer={false}
        >
          <div>
            <div>
              <h2 className="font-semibold">Cut Type</h2>
              <div className="flex gap-6 mt-1">
                <Button className="rounded-full bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black">
                  Door Cut
                </Button>
                <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
                  Window Cut
                </Button>
                <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
                  Bed Cut
                </Button>
              </div>
            </div>
            <div className="mt-10">
              <Input
                placeholder="Enter Project Name"
                value={selectedCutlist?.cutType || projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Measurement</h2>
                <span className="text-[#f2994a]">(2 Long)</span>
              </div>
              <div className="flex gap-6 mt-1">
                <Input
                  placeholder="Height"
                  type="number"
                  value={selectedCutlist?.height || height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <Input
                  placeholder="Width"
                  type="number"
                  value={selectedCutlist?.width || width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <Input
                  placeholder="Depth"
                  type="number"
                  value={selectedCutlist?.depth || depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-52 border-t-[.1rem]">
              <p className="mt-3">
                <span className="text-[#F2994A] font-semibold text-lg">
                  LNG &nbsp;
                </span>{" "}
                - Means (Long).
              </p>
              <p>
                <span className="text-[#F2994A] font-semibold text-lg">
                  F-E-T&nbsp;
                </span>{" "}
                - Means (Long).
              </p>
              <p>
                <span className="text-[#F2994A] font-semibold text-lg">
                  & &nbsp;
                </span>{" "}
                - Means (And).
              </p>
            </div>
          </div>
        </Modal>
        {/* create cutlist modal */}

        <Modal
          title=""
          width={900}
          style={{ top: 20 }}
          open={allUsers}
          onCancel={() => setAllUsers(false)}
          footer={[
            <div className="flex justify-center " key="footer">
              <Button
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] rounded-full border-none hover:!text-black px-10"
                onClick={() => createCut()}
              >
                {" "}
                Save List
              </Button>
            </div>,
          ]}
          getContainer={false}
        >
          <Users />
        </Modal>

        {/* select user modal */}
        <Modal
          title="Select a user"
          open={userModal}
          onCancel={openUserModal}
          footer={
            user.length === 0 || !user ? null : (
              <Button
                onClick={handleUserModal}
                htmlType="submit"
                className="bg-[#F2C94C] hover:!bg-[#F2C94C] hover:!text-black border-none p-3 px-3 rounded-full h-8 text-[.7rem]"
              >
                Select A User
              </Button>
            )
          }
          width={1000}
          size="small"
          // pagination={false} // Disable modal pagination since we'll handle it in the Table
          className="custom-table"
          scroll={{ x: "max-content" }}
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            size="small"
            pagination={{
              pageSize: 5,
              position: ["bottomCenter"],
              className: "custom-pagination",
            }}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        </Modal>
        {/* select user modal */}
      </div>
    </div>
  );
};

export default Cutlist;
