"use client";

import { Form, Input, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { toast } from "react-toastify";
import { useAuth } from "@/utils/context/AuthContext";

interface LoginResponse {
  token: string;
  fullName: string;
  role: string;
}
export default function SigninForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const loginData = {
        email: values.email,
        password: values.password,
      };

      // Call the authenticateUser function from the generated API client
      const response = await drinkshopService.api.authenticateUser(loginData);
      const data = response.data as LoginResponse;

      // Assuming your backend returns an object with a token field
      if (data && data.token) {
        console.log("token: ", data.token);
        console.log("fullName: ", data.fullName);
        toast.success("Đăng nhập thành công!");
        login(data.token);
        window.dispatchEvent(new Event("storage"));
        if (data.role == "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error("Đăng nhập thất bại: Không nhận được token");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Đăng nhập thất bại!");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md mx-auto py-14 px-4"
      requiredMark={"optional"}
    >
      {/* Email */}
      <Form.Item
        label="Địa chỉ email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email của bạn" },
          { type: "email", message: "Email không hợp lệ" },
        ]}
      >
        <Input placeholder="Nhập email của bạn" />
      </Form.Item>

      {/* Password */}
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu" },
          { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
        ]}
      >
        <div>
          <div className="w-full flex justify-between">
            <span>Mật khẩu</span>
            <Link
              href="/forgot-password"
              className="text-[#2DA5F3] hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input.Password placeholder="Nhập mật khẩu của bạn" />
        </div>
      </Form.Item>

      {/* Submit Button */}
      <Button
        type="primary"
        htmlType="submit"
        block
        className="py-5 uppercase font-medium flex items-center justify-center gap-2"
      >
        Đăng nhập <ArrowRightOutlined />
      </Button>
    </Form>
  );
}
