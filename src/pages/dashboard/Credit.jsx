import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Dropdown,
  DatePicker,
  notification,
} from "antd";

import dots from "../../assets/images/icons/dots.png";
import edit from "../../assets/images/icons/edit_outline.png";
import plus from "../../assets/images/icons/plus.png";
import arrow from "../../assets/images/icons/arrow_long_right.png";
import check_green from "../../assets/images/icons/check_green.png";
import inactive from "../../assets/images/icons/inactive.png";
import no_data from "../../assets/images/icons/no_data.png";
import bin from "../../assets/images/icons/bin.png";

import { Context } from "../../context/Context";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;

const Credit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { baseUrl, accessToken } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [showDate, setShowDate] = useState("");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleDate = (value) => {
    setShowDate(value);
  };


  const deleteCredit = (record) => {
    const packageId = record.key;
    const deleteUrl =  `${baseUrl}/credit/credit-package/${packageId}`
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.delete(deleteUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          notification.success({
            message: response.data.message
          })
          
          getCredit()
        } catch (error) {
          console.log(error);
          // Optionally, handle error (e.g., show a notification)
          notification.error({
            message: error.message
          })
        }
      },
    });
  }

  const toggleCredit = async (record) => {
    const packageId = record.key;
    const creditUrl = `${baseUrl}/credit/credit-package/${packageId}/toggle-status`;

    setLoading(true);

    try {
      const response = await axios.patch(
        creditUrl, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      );

      notification.success({
        message: response.data.message, 
      });
      
      getCredit(); 
      // console.log(record);
    } catch (error) {
      notification.error({
        message: "Error toggling credit package",
        description: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setLoading(false); 
    }
  };
  

  const getCredit = async () => {
    const packageUrl = `${baseUrl}/credit/credit-packages`;
    setLoading(true);
    try {
      const response = await axios.get(packageUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const data = response.data.data.map((credit) => ({
        key: credit._id,
        duration: credit.duration,
        amount: credit.amount,
        price: credit.price,
        status: credit.status,
      }));
      
      notification.success({
        message: "All credit packages retrieved successfully."
      })
      setDataSource(data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle token expiration
        notification.error({
          message: "Session expired, please log in again."
        });
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
  
  

  const createCredit = async (values) => {
    const creditUrl = `${baseUrl}/credit-package/create`;
    setLoading(true);

    if (values.duration === "custom" && showDate.length === 2) {
      const start = showDate[0];
      const end = showDate[1];
      const customDurationInDays = end.diff(start, "days");

      values = {
        ...values,
        customDuration: customDurationInDays,
      };
    }

    try {
      // console.log("Submitting values:", values);

      const response = await axios.post(creditUrl, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      form.resetFields();
      setIsModalOpen(false);
      notification.success({
        message: "Package created successfully"
      });
      getCredit();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create";
      console.error("Error:", error);
      notification.error({
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    getCredit();
  }, [baseUrl, accessToken]);
  

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentRecord(null);
  };

  const updateCredit = (record) => {
    if (!record) {
      console.error("No record provided to updateCredit");
      return;
    }

    console.log("Updating record:", record);

    setCurrentRecord(record);
    form.setFieldsValue({
      amount: record.amount,
      price: record.price,
      duration: record.duration,
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (values) => {
    const updateUrl = `${baseUrl}/credit-package/update/${currentRecord.key}`; // Use the record's ID
    setLoading(true);

    try {
      const response = await axios.put(updateUrl, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      notification.success({
        message: "Package updated successfully"
      });
      form.resetFields();
      setIsModalOpen(false);
      getCredit();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update";
      notification.error({
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "SN",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Credit Package",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const isActive = status;
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
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
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
                  <span
                    className="flex items-center"
                    onClick={() => updateCredit(record)}
                  >
                    <img
                      src={edit}
                      alt="Edit"
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
                  <span className="flex items-center" onClick={() => toggleCredit(record)}>
                    <img
                      src={no_data}
                      alt={record.status === false ? "Activate" : "Deactivate"} 
                      style={{
                        width: "17px",
                        height: "17px",
                        marginRight: "8px",
                      }}
                    />
                    {record.status === false ? "Activate" : "Deactivate"}
                  </span>
                ),
              },              
              {
                key: "delete",
                label: (
                  <span className="flex items-center" onClick={()=> deleteCredit(record)}>
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
      <div className="bg-white rounded p-3 mt-8">
        <div className="flex justify-end mb-3">
          <Button
            onClick={showModal}
            className="flex items-center bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black rounded p-2 px-3"
          >
            <img src={plus} alt="" className="w-3 mr-1" />
            Add Credit Package
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
            columns={columns}
            dataSource={dataSource}
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

        <Modal
          title={
            currentRecord ? "Update Credit Package" : "Create Custom Credit"
          }
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
          width={350}
        >
          <Form
            name="creditForm"
            onFinish={currentRecord ? handleUpdateSubmit : createCredit} // Use the correct handler
            initialValues={{ remember: true }}
            form={form}
            className="mt-6"
          >
            <div className="flex flex-col items-center">
              <Form.Item
                name="amount"
                rules={[
                  { required: true, message: "Input credit package amount!" },
                ]}
              >
                <Input
                  placeholder="Input credit package amount"
                  type="number"
                  style={{ fontSize: "14px", width: "300px" }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[{ required: true, message: "Input Price!" }]}
              >
                <Input
                  type="number"
                  placeholder="Input Price"
                  style={{ fontSize: "14px", width: "300px" }}
                />
              </Form.Item>

              <Form.Item
                name="duration"
                rules={[{ required: true, message: "Select an option!" }]}
              >
                <Select
                  onChange={handleDate}
                  style={{ width: "300px" }}
                  options={[
                    { value: "1 day", label: "1 Day" },
                    { value: "1 week", label: "1 Week" },
                    { value: "1 month", label: "1 Month" },
                    { value: "3 months", label: "3 Months" },
                    { value: "6 months", label: "6 Months" },
                    { value: "1 year", label: "1 Year" },
                    { value: "custom", label: "Custom" },
                  ]}
                />
              </Form.Item>
            </div>

            {showDate === "custom" ? (
              <Form.Item
                name="customDuration"
                rules={[{ required: true, message: "Select a date range!" }]}
              >
                <RangePicker style={{ width: "300px" }} onChange={handleDate} />
              </Form.Item>
            ) : null}

            <div className="flex justify-end">
              <Form.Item>
                <Button
                  className="bg-[#F2C94C] hover:!bg-[#F2C94C] hover:!text-black border-none p-3 rounded-full h-8 flex justify-center items-center text-[.7rem]"
                  loading={loading}
                  htmlType="submit"
                >
                  {loading
                    ? "Please wait..."
                    : currentRecord
                    ? "Update"
                    : "Create"}
                  <img src={arrow} alt="" className="h-4 w-4 ml-3" />
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Credit;
