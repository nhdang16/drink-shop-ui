"use client";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { CategoryDTO } from "@/utils/services/Api";
import { toast } from "react-toastify";
import UpdateCategoryPopUp from "./UpdateCategoryPopUp";
import DeleteCategory from "./DeleteCategory";

export default function CategoryTable() {
  const [categories, setCategories] = useState<CategoryDTO[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    drinkshopService.api.getAllCategories().then((res) => {
      setCategories(res.data);
    });
  };

  const columns: ColumnsType<CategoryDTO> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div className="flex gap-2">
          <UpdateCategoryPopUp
            category={record}
            fetchCategories={fetchCategories}
          />
          <DeleteCategory
            categoryId={record.id!}
            fetchCategories={fetchCategories}
          />
        </div>
      ),
    },
  ];

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      drinkshopService.api
        .createCategory({
          description: values.description,
          name: values.name,
        })
        .then((res) => {
          if (res.status == 200) {
            fetchCategories();
            toast.success("Thêm danh mục thành công!");
            setIsModalOpen(false);
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            toast.error(e.response.data.message);
          } else {
            toast.error("Danh mục đã tồn tại!");
          }
        });
    });
  };

  const handleCancel = async () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách danh mục</h2>
        <Button type="primary" onClick={showModal}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Thêm danh mục mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
