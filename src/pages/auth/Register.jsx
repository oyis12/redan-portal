import React, { useContext, useState } from "react";
import axios from "axios";
import { Form, Input, Card, message } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { Context } from "../../context/Context";
import woodworker from "../../assets/images/Woodworker_transparent.png";
import arrow from "../../assets/images/icons/arrow_long_right.png";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useContext(Context);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const regUrl = `${baseUrl}/account/register`;
    const fullPhoneNumber = `+234${values.phone}`;
  
    try {
      // Send registration request
      const response = await axios.post(regUrl, {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: fullPhoneNumber,
        password: values.password,
      });
  
      // Log full response data for debugging
      console.log("Full response data:", response);
  
      // Extract phone number and other data from response
      const phoneNumber = response.data.data?.phoneNumber;
      console.log(phoneNumber)
  
      // Store phone number in localStorage
      // localStorage.setItem("phoneNumber", user_phone);
  
      // Extract and log response message and OTP status
      const responseMsg = response.data.msg;
      const isOTP = response.data.data?.otp;
      console.log("Response message:", responseMsg);
      console.log("OTP status:", isOTP);
  
        navigate("/otp-verification", {state :{phoneNumber}}); // Redirect to OTP verification page
        // window.location.assign("/otp-verification")
     
    } catch (error) {
      // Handle errors during registration
      message.error("Registration failed. Please try again.");
      console.error("Error details:", error.response ? error.response.data : error.message); // Detailed error logging
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };
  
  
  
// const onFinish = async (values) => {
//     setLoading(true);
//     const regUrl = `${baseUrl}/account/register`;
//     const fullPhoneNumber = `+234${values.phone}`;
  
//     try {
//       const response = await axios.post(regUrl, {
//         fullName: values.fullName,
//         email: values.email,
//         phoneNumber: fullPhoneNumber,
//         password: values.password,
//       });
  
//       console.log("Full response data:", response); // Log the full response data
  
//       let user_phone = response.data.data?.phoneNumber;
//       console.log("Extracted phone number:", user_phone);
  
//       localStorage.setItem("phoneNumber", user_phone);
  
//       // Check and log response message
//       const responseMsg = response.data.msg;
//       const isOTP = response.data.data?.otp;
//       console.log("Response message:", responseMsg);
  
//       // Adjust the condition based on your backend response
//       if (responseMsg === "User registered, please verify OTP" || isOTP) {
//         message.success("Registration successful! Please verify OTP.");
//         navigate("/otp-verification"); // Redirect to OTP verification
//       } else {
//         message.error("Registration successful but no OTP verification message received.");
//         // Optionally, handle cases where the message is not as expected
//       }
//     } catch (error) {
//       message.error("Registration failed. Please try again.");
//       console.error("Error details:", error); // Log full error details
//     } 
  
//     setLoading(false); // Ensure loading state is reset
//   };
  
  
  

  
  return (
    <div
      className="relative w-full h-screen flex justify-center items-center px-4"
      style={{
        backgroundImage: `url(${woodworker})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 hidden sm:block"></div>

      <div className="relative z-10 w-full sm:w-auto max-w-sm">
        <Card className="w-full">
          <h1 className="text-center text-2xl md:text-2xl font-bold mb-4">
            Enter Credentials
          </h1>
          <p className="text-center md:text-sm text-sm mb-6">
            Provide your phone admin details to register
          </p>

          <Form name="register" layout="vertical" onFinish={onFinish}>
            <div className="m-auto w-full">
              <Form.Item
                label="Full Name"
                name="fullName"
                className="mb-3"
                rules={[
                  { required: true, message: "Please input your full name!" },
                  { min: 2, message: "Full name must be at least 2 characters!" },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                className="mb-3"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                className="mb-3"
                rules={[
                  { required: true, message: "Please input your phone number!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  addonBefore="+234"
                  placeholder="8012345678"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="flex items-center bg-[#F2C94C] hover:!text-black p-2 rounded-xl px-6 md:px-8 text-xs md:text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    "Registering..."
                  ) : (
                    <>
                      Next <img src={arrow} alt="arrow" className="w-4 ml-3" />
                    </>
                  )}
                </button>
              </Form.Item>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/admin-login"
                    style={{ fontWeight: "bold", color: "#1890ff" }}
                  >
                    Proceed to Login
                  </Link>
                </p>
              </div>
            </div>
          </Form>
        </Card>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="background-image"] {
            background-image: none !important;
          }
          .sm\\:block {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
