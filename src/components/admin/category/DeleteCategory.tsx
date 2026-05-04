import React from "react";
import { Popconfirm, Button } from "antd";
import { Trash2 } from "lucide-react";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { toast } from "react-toastify";

interface Props {
  categoryId: number;
  fetchCategories: () => void;
}

const DeleteCategory: React.FC<Props> = ({ categoryId, fetchCategories }) => {
  const confirmDelete = async () => {
    try {
      const response = await drinkshopService.api.deleteCategory(categoryId);
      if (response.status == 204) {
        toast.success("Xóa danh mục thành công!");
        fetchCategories();
      } else {
        toast.error("Xóa danh mục thất bại!");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Xóa danh mục thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Xóa danh mục"
      description="Bạn có chắc chắn muốn xóa danh mục này không?"
      onConfirm={confirmDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger icon={<Trash2 size={16} />} />
    </Popconfirm>
  );
};

export default DeleteCategory;
