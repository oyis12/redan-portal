// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { Form, Input, Card, message, Typography } from "antd";
// import { Context } from "../../context/Context";
// import woodworker from "../../assets/images/Woodworker_transparent.png";
// import arrow from "../../assets/images/icons/arrow_long_right.png";
// import { useNavigate } from "react-router-dom";

// const { Title } = Typography;

// const Otp = () => {
//   const { baseUrl, loggedInUser } = useContext(Context);
//   const [loading, setLoading] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [value, setValue] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedPhoneNumber = localStorage.getItem("phoneNumber");
//     if (!savedPhoneNumber) {
//       message.error("You must be logged in to verify OTP.");
//     //   window.location.href = "/admin-login";
//     } else {
//       setPhoneNumber(savedPhoneNumber);
//     }
//   }, []);

//   const onChange = (text) => {
//     setValue(text);
//   };

//   const sharedProps = {
//     onChange,
//   };

//   const onFinish = async () => {
//     if (!phoneNumber) return;

//     setLoading(true);
//     const verifyOtpUrl = `${baseUrl}/account/verify-otp`;

//     try {
//       const otp = value;

//       const response = await axios.post(verifyOtpUrl, {
//         phoneNumber,
//         otp,
//       });

//       console.log(response)

//       if (
//         response.status === 200 &&
//         response.data.msg === "Phone number verified successfully"
//       ) {
//         message.success("OTP verification successful!");
//         localStorage.clear()
//         navigate('/admin-login')
//         // window.location.href = "/dashboard";
//       } else {
//         throw new Error("OTP verification failed");
//       }
//     } catch (error) {
//       console.error("Error response:", error.response?.data);
//       message.error(
//         error.response?.data?.message ||
//         "OTP verification failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="relative w-full h-screen flex justify-center items-center px-4"
//       style={{
//         backgroundImage: `url(${woodworker})`,
//         backgroundSize: "contain",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div className="absolute inset-0 bg-black opacity-50 hidden sm:block"></div>

//       <div className="relative z-10 w-full sm:w-auto max-w-sm">
//         <Card className="w-full">
//           <h1 className="text-center text-2xl md:text-2xl font-bold mb-4">
//             OTP Verification
//           </h1>

//           <Form
//             name="otp-verification"
//             initialValues={{ remember: true }}
//             onFinish={onFinish}
//             layout="vertical"
//           >
//             <div>
//               <Form.Item name="phoneNumber" label="Phone Number">
//                 <Input
//                   value={phoneNumber || "Loading..."}
//                   disabled
//                   className="border-none"
//                 />{" "}
//                 {/* Display phone number */}
//               </Form.Item>
//             </div>

//             <div className="m-auto w-full">
//               <Form.Item
//                 name="otp"
//                 rules={[
//                   {
//                     pattern: /^[0-9]{6}$/,
//                     message: "Please enter a valid 6-digit OTP",
//                   },
//                 ]}
//               >
//                 <Title level={5}>Enter OTP</Title>
//                 <Input.OTP
//                   formatter={(str) => str.toUpperCase()}
//                   {...sharedProps}
//                 />
//               </Form.Item>
//             </div>

//             <Form.Item className="mt-6 flex justify-center">
//               <button
//                 type="submit"
//                 className="flex items-center bg-[#F2C94C] hover:!text-black p-2 rounded-xl px-6 md:px-8 text-xs md:text-sm"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   "Verifying OTP..."
//                 ) : (
//                   <>
//                     Next <img src={arrow} alt="arrow" className="w-4 ml-3" />
//                   </>
//                 )}
//               </button>
//             </Form.Item>
//             <Form.Item className="mt-6 flex justify-center">
//               <button
//                 type="submit"
//                 className="flex items-center bg-[#F2C94C] hover:!text-black p-2 rounded-xl px-6 md:px-8 text-xs md:text-sm"
//                 disabled={loadingOtp}
//               >
//                 {loadingOtp ? "Verifying OTP..." : <>Re-send OTP</>}
//               </button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Otp;

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Card, message, Typography, Button } from "antd";
import { Context } from "../../context/Context";
import woodworker from "../../assets/images/Woodworker_transparent.png";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

const Otp = () => {
  const { baseUrl, loggedInUser } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [value, setValue] = useState("");
  const [isLoadingPhone, setIsLoadingPhone] = useState(true);
  const location = useLocation();
  const { phoneNumber } = location.state;
  console.log("from params:", phoneNumber);

  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneNumber) {
      message.error("You must be logged in to verify OTP.");
      navigate("/admin-login"); // Redirect if no phone number is found
    } else {
      setIsLoadingPhone(false); // Set phone number loading state to false once phoneNumber is available
    }
  }, [phoneNumber, navigate]);

  const onChange = (text) => {
    setValue(text);
  };

  const sharedProps = {
    onChange,
  };

  const onFinish = async () => {
    if (!phoneNumber) return;

    setLoading(true);
    const verifyOtpUrl = `${baseUrl}/account/verify-otp`;
    try {
      const otp = value;

      const response = await axios.post(verifyOtpUrl, {
        phoneNumber,
        otp,
      });
      setValue("");
      console.log(response);
      console.log("Request Payload:", { phoneNumber, otp });

      if (
        response.status === 200 &&
        response.data.msg === "Phone number verified successfully"
      ) {
        message.success("OTP verification successful!");
        navigate("/admin-login");
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      message.error(
        error.response?.data?.message ||
          "OTP has expired. Please request a new OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendNewOTP = async () => {
    if (!phoneNumber) return;

    setLoadingOtp(true);
    const regenerateOtpUrl = `${baseUrl}/account/regenerate-otp`;
    console.log("working send otp")
    try {
      const response = await axios.post(regenerateOtpUrl, {
        phoneNumber,
      });
      console.log(response);
      message.success("New OTP sent successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to send new OTP."
      );
    } 
    finally {
      setLoadingOtp(false);
    }
  };

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
            OTP Verification
          </h1>

          <Form
            name="otp-verification"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <div>
              {/* Render input field based on whether the phone number is loaded */}
              <input
                value={isLoadingPhone ? "Loading..." : phoneNumber}
                disabled
                name="phoneNumber"
                className="border-none w-full py-2 pl-2 mb-2 text-gray-400"
              />
            </div>
            <div className="m-auto w-full">
              <Form.Item
                name="otp"
                rules={[
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "Please enter a valid 6-digit OTP",
                  },
                ]}
              >
                <Title level={5}>Enter OTP</Title>
                <Input.OTP
                  {...sharedProps}
                  formatter={(str) => str.toUpperCase()}
                />
              </Form.Item>
            </div>

            <div className="flex justify-between">
              <Form.Item className="mt-6 flex justify-center">
                <Button
                  type="button"
                  onClick={onFinish}
                  className="flex items-center bg-[#F2C94C] hover:!text-black p-2 rounded-xl px-6 md:px-8 text-xs md:text-sm"
                  disabled={loading}
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </Button>
              </Form.Item>
              <Form.Item className="mt-6 flex justify-center">
                <Button
                  type="button" // Changed to button type to prevent form submission
                  onClick={sendNewOTP}
                  className="flex items-center bg-[#f2c84c64] hover:!text-black p-2 rounded-xl px-6 md:px-8 text-xs md:text-sm"
                  disabled={loadingOtp}
                >
                  {loadingOtp ? "Sending OTP..." : "Re-send OTP"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Otp;
