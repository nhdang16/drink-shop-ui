import React from "react";
import { Popconfirm, Button } from "antd";
import { Trash2 } from "lucide-react";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { toast } from "react-toastify";

interface Props {
  discountId: number;
  fetchDiscounts: () => void;
}

const DeleteDiscount: React.FC<Props> = ({ discountId, fetchDiscounts }) => {
  const confirmDelete = async () => {
    try {
      const response = await drinkshopService.api.deleteDiscount(discountId);
      if (response.status == 204) {
        toast.success("Xóa khuyến mãi thành công!");
        fetchDiscounts();
      } else {
        toast.error("Xóa khuyến mãi thất bại!");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Xóa khuyến mãi thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Xóa khuyến mãi"
      description="Bạn có chắc chắn muốn xóa khuyến mãi này không?"
      onConfirm={confirmDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger icon={<Trash2 size={16} />} />
    </Popconfirm>
  );
};

export default DeleteDiscount;
