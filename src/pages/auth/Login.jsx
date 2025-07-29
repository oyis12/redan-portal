import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { Context } from "../../context/Context";
import woodworker from "../../assets/images/Woodworker_transparent.png";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Login = () => {
  const { login } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);

    // Simulate a dummy user object and token
    const dummyUser = {
      id: "1",
      name: "Demo User",
      phoneNumber: `+234${values.phoneNumber}`,
      role: "user",
    };

    const dummyToken = "fake-jwt-token-123456";

    // Simulate async login delay
    setTimeout(() => {
      login(dummyUser, dummyToken);
      message.success("Login successful");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  const onFinishFailed = () => {
    message.error("Please fill out the form correctly.");
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
            Enter Login Credentials
          </h1>
          <p className="text-center md:text-sm text-sm mb-6">
            Provide your phone number and password to sign in
          </p>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <div className="m-auto w-full">
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                className="mb-0"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
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
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
            </div>

            <Form.Item className="mt-6 flex justify-center">
              <Button
                className="bg-[#DD3333] hover:!bg-[#DD3333] !text-white hover:!text-white border-none p-3 rounded-full flex justify-center text-[.7rem] px-7 text-sm"
                loading={loading}
                htmlType="submit"
              >
                {loading ? "Please wait..." : "Login"}
                <HiOutlineArrowNarrowRight />
              </Button>
            </Form.Item>
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

export default Login;
