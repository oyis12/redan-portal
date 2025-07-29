import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Input, Modal, Form, Dropdown, Menu } from "antd";
import Notifications from "../../components/notification/Notification";
import plus from "../../assets/images/icons/plus.png";
import bell from "../../assets/images/icons/bell.png";
import check_green from "../../assets/images/icons/check_green.png";
import inactive from "../../assets/images/icons/inactive.png";
import dots from "../../assets/images/icons/dots.png";
import no_data from "../../assets/images/icons/no_data.png";
import edit from "../../assets/images/icons/edit_outline.png";
import bin from "../../assets/images/icons/bin.png";
import arrow from "../../assets/images/icons/arrow_long_right.png";

const { TextArea } = Input;

const Notification = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isAnyChecked, setIsAnyChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsAnyChecked(isChecked || isAnyChecked);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOpenModal(false);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleMenuClick = (e, record) => {
    if (e.key === "update") {
      console.log("Update", record);
      // Handle view logic here
    } else if (e.key === "deactivate") {
      console.log("Deactivate", record);
      // Handle edit logic here
    } else if (e.key === "delete") {
      console.log("Delete", record);
      // Handle delete logic here
    }
  };

  const getMenu = (record) => (
    <Menu onClick={(e) => handleMenuClick(e, record)}>
      <Menu.Item
        key="update"
        icon={
          <img
            src={edit}
            alt="Update"
            style={{ width: "16px", marginRight: "8px" }}
          />
        }
      >
        Update
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={
          <img
            src={no_data}
            alt="Update"
            style={{ width: "16px", marginRight: "8px" }}
          />
        }
      >
        Deactivate
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={
          <img
            src={bin}
            alt="Delete"
            style={{ width: "16px", marginRight: "8px" }}
          />
        }
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const onSearch = (value) => {
    setSearchText(value);
  };

  const sections = [
    {
      title: "Create cutlist",
      description: "Create new cutlist and get active",
      options: ["None", "In-app", "Phone number"],
    },
    {
      title: "Outstanding Cutlist",
      description: "You have had outstanding tasks for a while",
      options: ["None", "In-app", "Phone number"],
    },
    {
      title: "Purchase Credits",
      description: "You have run out of credits, purchase credits",
      options: ["None", "In-app", "Phone number"],
    },
  ];

  const fullDataSource = [
    {
      key: 0,
      title: "Purchase Credits",
      status: "Active",
      sent_to: "10 Users",
      view: 5,
      last_modified: "Aug 17, 2023 4:30pm",
    },
    {
      key: 1,
      title: "Create cutlist",
      status: "Inactive",
      sent_to: "20 Users",
      view: 10,
      last_modified: "Oct 05, 2023 1:50am",
    },
    {
      key: 2,
      title: "Outstanding Cutlist",
      status: "Active",
      sent_to: "12 Users",
      view: 8,
      last_modified: "Oct 28, 2023 7:00pm",
    },
    {
      key: 3,
      title: "Verify Number",
      status: "Active",
      sent_to: "30 Users",
      view: 25,
      last_modified: "Oct 28, 2023 7:00pm",
    },
  ];

  const filteredDataSource = fullDataSource.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "SN",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Notification Name",
      dataIndex: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const isActive = status === "Active";
        const className = isActive
          ? "bg-[#5EDA79] text-[#1F7700] px-3 w-20 rounded-full flex items-center"
          : "px-3 w-20 border rounded-full bg-[#FF000042] text-[#FF3D00] flex items-center";
        const statusImage = isActive ? check_green : inactive;
        return (
          <span className={className}>
            <img
              src={statusImage}
              alt={isActive ? "Active" : "Inactive"}
              className="w-2 h-2 mr-1"
            />
            {status}
          </span>
        );
      },
    },
    {
      title: "Sent to",
      dataIndex: "sent_to",
    },
    {
      title: "Views",
      dataIndex: "view",
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
    },
    {
      title: "",
      key: "operations",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "update",
                label: (
                  <span className="flex items-center">
                    <img
                      src={edit}
                      alt="update"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Update
                  </span>
                ),
              },
              {
                key: "deactivate",
                label: (
                  <span className="flex items-center">
                    <img
                      src={no_data}
                      alt="Deactivate"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    Deactivate
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
            onClick: (e) => handleMenuClick(e, record),
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
        <div className="flex justify-between items-center mb-3">
          <Button
            onClick={showModal}
            className="flex items-center bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black rounded p-2 px-3"
          >
            <img src={plus} alt="Plus Icon" className="w-3 mr-1" />
            Create Notification
          </Button>
          <div className="flex gap-4">
            <Input.Search
              className="w-44 mr-4"
              placeholder="Search"
              onSearch={onSearch}
            />
            <Button
              className="flex items-center bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black rounded p-2 px-3"
              onClick={() => setOpenModal(true)}
            >
              <img src={bell} alt="Bell Icon" className="w-3 mr-1" />
              Send Notification
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredDataSource}
          size="small"
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
            className: "custom-pagination", 
          }}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
        <Modal
          title="Create Custom Notification"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
          width={350}
        >
          <Form
            name="notificationForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="mt-6"
          >
            <div className="flex flex-col items-center">
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Notification Name!",
                  },
                ]}
              >
                <Input
                  placeholder="Notification Name"
                  style={{ fontSize: "14px", width: "300px" }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                rules={[
                  { required: true, message: "Please enter the Description!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Description"
                  maxLength={250}
                  style={{ fontSize: "14px", width: "300px", resize: "none" }}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end">
              <Form.Item>
                <Button
                  htmlType="submit"
                  className="bg-[#F2C94C] hover:!bg-[#F2C94C] hover:!text-black border-none p-3 px-3 rounded-full h-8 flex justify-center items-center text-[.7rem]"
                >
                  Save
                  <img src={arrow} alt="" className="h-4 w-4 ml-3" />
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <Notifications
          open={openModal}
          handleCancel={handleCancel}
          modalTitle="Send Notifications"
          modalText="Manage notifications to send out"
          sections={sections}
          confirmLoading={confirmLoading}
          isAnyChecked={isAnyChecked}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default Notification;
