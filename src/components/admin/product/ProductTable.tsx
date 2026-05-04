/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { CategoryDTO, ProductDTO } from "@/utils/services/Api";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { supabase } from "@/utils/lib/supabase";
import DeleteProductPopUp from "./DeleteProductPopUp";
import UpdateProductPopUp from "./UpdateProductPopUp";
import { formatCurrency } from "@/utils/format/formatCurrency";

export default function ProductTable() {
  const [products, setProducts] = useState<ProductDTO[]>();
  const [categories, setCategories] = useState<CategoryDTO[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastUploadedPath, setLastUploadedPath] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    drinkshopService.api.getAllCategories().then((res) => {
      setCategories(res.data);
    });
  }, []);

  const fetchProducts = () => {
    drinkshopService.api.getAllProducts().then((res) => {
      setProducts(res.data);
    });
  };

  const columns: ColumnsType<ProductDTO> = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (url) => (
        <img
          src={url}
          alt="product"
          className="w-12 h-12 object-cover rounded"
        />
      ),
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
      title: "Giá",
      dataIndex: "price",
      render: (price) => `${formatCurrency(price)}`,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div className="flex gap-2">
          <UpdateProductPopUp
            productId={record.id!}
            fetchProducts={fetchProducts}
            categories={categories!}
          />
          <DeleteProductPopUp
            productId={record.id!}
            fetchProducts={fetchProducts}
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
        .createProduct({
          name: values.name,
          description: values.description,
          price: values.price,
          categoryId: values.category,
          image: values.image,
          ingredients: values.ingredients,
        })
        .then((res) => {
          if (res.status == 200) {
            fetchProducts();
            toast.success("Thêm sản phẩm thành công!");
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message); // "Product name already exists"
          } else {
            toast.error("Tên sản phẩm đã tồn tại!");
          }
        });
      setIsModalOpen(false);
    });
  };

  const handleCancel = async () => {
    if (lastUploadedPath) {
      await supabase.storage.from("drinkshop").remove([lastUploadedPath]);
      setLastUploadedPath(null);
    }

    setImagePreview(null);
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        <Button type="primary" onClick={showModal}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Thêm sản phẩm mới"
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

          <Form.Item name="ingredients" label="Nguyên liệu">
            <TextArea />
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Product Image">
            <div style={{ textAlign: "center" }}>
              <Upload
                showUploadList={false}
                beforeUpload={async (file) => {
                  if (lastUploadedPath) {
                    await supabase.storage
                      .from("drinkshop")
                      .remove([lastUploadedPath]);
                    setLastUploadedPath(null);
                  }

                  const { data, error } = await supabase.storage
                    .from("drinkshop")
                    .upload(`temp/${Date.now()}-${file.name}`, file);

                  if (error) {
                    toast.error("Tải ảnh thất bại!");
                    return Upload.LIST_IGNORE;
                  }

                  const url = supabase.storage
                    .from("drinkshop")
                    .getPublicUrl(data.path).data.publicUrl;

                  form.setFieldsValue({ image: url });
                  setImagePreview(url); // state dùng để hiển thị ảnh preview
                  setLastUploadedPath(data.path); // Lưu lại path mới

                  return false; // không upload bằng antd, mình tự handle
                }}
              >
                <div
                  style={{
                    width: 150,
                    height: 150,
                    border: "1px dashed #d9d9d9",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <span>Nhấn để tải ảnh lên</span>
                  )}
                </div>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="image" noStyle rules={[{ required: true }]}>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
