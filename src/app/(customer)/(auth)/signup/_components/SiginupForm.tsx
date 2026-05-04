"use client";

import { Form, Input, Button, Checkbox } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { drinkshopService } from "@/utils/services/drinkshopService";

interface SignupFormProps {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: SignupFormProps) => {
    console.log("Signup Data:", values);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registrationData } = values;
    try {
      const response = await drinkshopService.api.createNewUser(registrationData);
      console.log(response);
      if (response?.status == 200) {
        toast.success("Đăng ký thành công!");
        router.push("/signin");
      } else {
        toast.error("Email đã tồn tại!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Đăng ký thất bại!");
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
      {/* Name */}
      <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn" }]}
      >
        <Input />
      </Form.Item>

      {/* Phone Number */}
      <Form.Item
        label="Số điện thoại"
        name="phoneNumber"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          {
            pattern: /^[0-9]{10,15}$/,
            message: "Số điện thoại phải từ 10-15 chữ số",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Địa chỉ email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email" },
          { type: "email", message: "Email không hợp lệ" },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu" },
          { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
        ]}
      >
        <Input.Password placeholder="8+ ký tự" />
      </Form.Item>

      {/* Confirm Password */}
      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu" },
          { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu không khớp"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Checkbox>
          Bạn có đồng ý với Clicon về{" "}
          <a href="#" target="_blank" className="text-[#2DA5F3]">
            Điều khoản điều kiện
          </a>{" "}
          và{" "}
          <a href="#" target="_blank" className="text-[#2DA5F3]">
            Chính sách bảo mật
          </a>
          .
        </Checkbox>
      </Form.Item>

      {/* Submit Button */}
      <Button
        type="primary"
        htmlType="submit"
        block
        className="bg-[#0B8A00] py-5 uppercase font-medium flex items-center justify-center gap-2"
      >
        Đăng ký <ArrowRightOutlined />
      </Button>
    </Form>
  );
}
