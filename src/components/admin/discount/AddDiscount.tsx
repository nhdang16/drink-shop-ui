"use client";
import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Radio,
  Row,
  Col,
  Select,
} from "antd";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

type Props = {
  fetchDiscounts: () => void;
};

const AddDiscount = ({ fetchDiscounts }: Props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const response = await drinkshopService.api.createDiscount({
        ...values,
      });

      if (response.status !== 200) {
        toast.error("Thêm khuyến mãi thất bại");
        return;
      }

      toast.success("Thêm khuyến mãi thành công");
      fetchDiscounts();
      onClose();
    } catch (error) {
      toast.error("Thêm khuyến mãi thất bại");
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        icon={<Plus size={16} />}
      >
        Thêm khuyến mãi mới
      </Button>

      <Modal
        title="Thêm khuyến mãi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        style={{ top: 20 }}
        width={800} // chỉnh rộng modal ra cho dễ bố cục 2 cột
      >
        <Form form={form} layout="vertical" name="discountForm">
          <Row gutter={24}>
            {/* Cột bên trái */}
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã"
                rules={[
                  { required: true, message: "Vui lòng nhập mã khuyến mãi" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Mức giảm" required>
                <Row gutter={8}>
                  <Col span={10}>
                    <Form.Item
                      name="discountAmountType"
                      noStyle
                      rules={[
                        { required: true, message: "Select discount type" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn loại giảm giá"
                        options={[
                          { value: "PERCENTAGE", label: "%" },
                          { value: "FIXED", label: "VND" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name="amount"
                      noStyle
                      rules={[
                        { required: true, message: "Enter amount" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              getFieldValue("discountAmountType") ===
                              "PERCENTAGE"
                            ) {
                              if (value > 0 && value <= 100) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Percentage must be between 0 and 100"
                                )
                              );
                            }
                            if (value > 0) return Promise.resolve();
                            return Promise.reject(
                              new Error("Amount must be positive")
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        step={0.01}
                        placeholder="Nhập số lượng"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ]}
              >
                <Input type="datetime-local" />
              </Form.Item>

              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>

            {/* Cột bên phải */}
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" },
                  {
                    type: "number",
                    min: 1,
                    message: "Số lượng phải ít nhất là 1",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>

              <Form.Item
                name="minimumOrderPrice"
                label="Giá trị đơn hàng tối thiểu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                  },
                  {
                    type: "number",
                    min: 0,
                    message: "Phải lớn hơn hoặc bằng 0",
                  },
                ]}
                initialValue={0}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Trạng thái"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngừng hoạt động</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddDiscount;
