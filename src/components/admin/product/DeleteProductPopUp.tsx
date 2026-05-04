import React from "react";
import { Popconfirm, Button } from "antd";
import { Trash2 } from "lucide-react";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { toast } from "react-toastify";

interface Props {
  productId: number;
  fetchProducts: () => void;
}

const DeleteProductPopUp: React.FC<Props> = ({ productId, fetchProducts }) => {
  const confirmDelete = async () => {
    try {
      const response = await drinkshopService.api.deleteProduct(productId);
      if (response.status == 204) {
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        toast.error("Xóa sản phẩm thất bại!");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Xóa sản phẩm"
      description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
      onConfirm={confirmDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger icon={<Trash2 size={16} />} />
    </Popconfirm>
  );
};

export default DeleteProductPopUp;
