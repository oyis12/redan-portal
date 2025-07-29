import React, { useState, useEffect, useContext, useRef } from "react";
import { message, Table, Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { Context } from "../../context/Context";
import { ThreeDots } from "react-loader-spinner";
import LineChart from "../../components/chart/LineChart";
import LineChart2 from "../../components/chart/LinChart2";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [sourcedData, setSourcedData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const modalContentRef = useRef(); // Ref for modal content

  const { baseUrl, accessToken } = useContext(Context);

  useEffect(() => {
    const getPayments = async () => {
      const paymentUrl = `${baseUrl}/payments/admin`;
      setLoading(true);
      try {
        const response = await axios.get(paymentUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        // Sort payments by paymentDate in descending order (newest first)
        const sortedData = response.data.payments
          .map((payment) => ({
            key: payment._id,
            customer_name: payment.user.fullName, // Full name from user object
            status: payment.status,
            date: new Date(payment.paymentDate).toLocaleDateString(), // Format paymentDate
            credits: payment.credits,
            amount: payment.amount,
            invoice: payment.paymentId,
            currency: payment.currency,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorting by paymentDate
  
        setSourcedData(sortedData);
        message.success("Payments data fetched successfully");
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
  
    getPayments();
  }, [baseUrl, accessToken]);
  
  

  const data = [
    { id: 1, title: "Credit Purchased", count: 10, bg_color: "#FBECC4" },
    { id: 2, title: "Credit Pending", count: 1, bg_color: "#C9EBED" },
    { id: 3, title: "Credit Completed", count: 8, bg_color: "#F5DEDE" },
    { id: 4, title: "Total Credit Package", count: 5, bg_color: "#D0D1FF" },
  ];

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=400,width=600");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 20px; font-weight: bold; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="title">Invoice Details</div>
          <div class="section">
            <strong>Customer Name:</strong> ${selectedRecord?.customer_name}<br>
            <strong>Status:</strong> ${selectedRecord?.status}<br>
            <strong>Date:</strong> ${selectedRecord?.date}<br>
            <strong>Credit Package:</strong> ${selectedRecord?.credits} Credits<br>
            <strong>Amount:</strong> N${Intl.NumberFormat().format(selectedRecord?.amount)}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    { title: "SN", render: (_, __, index) => index + 1, width: 70 },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color = "", bgColor = "";
        switch (text) {
          case "pending":
            color = "#127CDD";
            bgColor = "#D0E8FF";
            break;
          case "successful":
            color = "#1F7700";
            bgColor = "#5EDA79";
            break;
          case "canceled":
            color = "#FF3D00";
            bgColor = "#FFCCCC";
            break;
          default:
            break;
        }
        return (
          <span
            style={{
              color,
              backgroundColor: bgColor,
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            {text.charAt(0).toUpperCase() + text.slice(1)}
          </span>
        );
      },
    },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Credit Package",
      dataIndex: "credits",
      key: "credits",
      render: (text) => `${text} Credits`,
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (text, record) => (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#1890ff",
          }}
          onClick={() => openModal(record)}
        >
          <PrinterOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
          Print
        </span>
      ),
    },
  ];

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedRecord(null);
  };

  const openModal = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
  };

  return (
    <div className="relative top-14">
      <div className="bg-white rounded p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-0">
          {data.map((e) => (
            <div
              className="p-4 rounded-lg flex flex-col items-center py-7"
              key={e.id}
              style={{ backgroundColor: e.bg_color }}
            >
              <div className="flex items-center">
                <h1 className="capitalize font-semibold">{e.title}</h1>
              </div>
              <h2 className="text-center font-bold text-2xl">{e.count}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="w-full">
            <LineChart />
          </div>
          <div className="w-full">
            <LineChart2 />
          </div>
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
              wrapperClass="three-dots-loading"
            />
          </div>
        ) : (
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
          />
        )}
      </div>
      <Modal
        title={
          selectedRecord ? (
            <span className="uppercase font-lg">{selectedRecord?.invoice}</span>
          ) : (
            "No Invoice ID"
          )
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={
          <div className="flex justify-between">
            <Button onClick={handlePrint} className="flex items-center rounded text-[#B0B2C3] hover:!text-[#B0B2C3] px-6 font-semibold border hover:!border-gray">
              Print
            </Button>
            <Button className="bg-[#F2C94C] hover:!bg-[#F2C94C] p-2 w-20 rounded flex justify-center items-center text-[.7rem] border-none hover:!text-black">
              Share
            </Button>
          </div>
        }
        width={450}
      >
        <div ref={modalContentRef} className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold">Name</span>
            <span>{selectedRecord?.customer_name}</span>
          </div>
          <div className="flex flex-col w-40">
            <span className="font-bold">Subject</span>
            <span>Purchase Credit Package</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="flex flex-col">
            <span className="font-bold">Credit Package</span>
            <span>{selectedRecord?.credits} Credits</span>
          </div>
          <div className="flex flex-col w-40">
            <span className="font-bold">Currency</span>
            <span>
              {selectedRecord?.currency === "NGN"
                ? "NGN - Nigerian Naira"
                : null}
            </span>
          </div>
        </div>

        <div className="mt-5 bg-[#fafafa] border rounded-full px-3 pr-12 py-[.1rem] flex items-center justify-between">
          <div className="grid">
            <span className="text-[.6rem]">DESCRIPTION</span>
          </div>
          <div className="grid">
            <span className="text-[.6rem]">QTY</span>
          </div>
          <div className="grid">
            <span className="text-[.6rem]">UNIT PRICE</span>
          </div>
          <div className="grid">
            <span className="text-[.6rem]">AMOUNT</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-3">
          <div className="w-24">
            <span className="text-[.7rem]">Purchase Credit Package</span>
          </div>
          <div className="w-16">
            <span className="text-[.7rem]">1</span>
          </div>
          <div className="w-20">
            <span className="text-[.7rem]">
              N{Intl.NumberFormat().format(selectedRecord?.amount)}
            </span>
          </div>
          <div className="w-20 relative left-1">
            <span className="text-[.7rem]">
              N{Intl.NumberFormat().format(selectedRecord?.amount)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="font-bold">Subtotal:</span>
            <span className="">
              N{Intl.NumberFormat().format(selectedRecord?.amount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Total:</span>
            <span className="">
              N{Intl.NumberFormat().format(selectedRecord?.amount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit",
              })}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
