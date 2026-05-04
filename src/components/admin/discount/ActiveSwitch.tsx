import { drinkshopService } from "@/utils/services/drinkshopService";
import { Switch } from "antd";
import React from "react";
import { toast } from "react-toastify";

const ActiveSwitch = ({
  id,
  active,
  fetchDiscounts,
}: {
  id: number;
  active: boolean;
  fetchDiscounts: () => void;
}) => {
  const handleChange = async (checked: boolean) => {
    try {
      const response = await drinkshopService.api.updateDiscountStatus(id, checked);
      if (response.status === 200) {
        toast.success("Cập nhật trạng thái khuyến mãi thành công");
        fetchDiscounts();
      } else {
        toast.error("Cập nhật trạng thái khuyến mãi thất bại");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Cập nhật trạng thái khuyến mãi thất bại");
    }
  };

  return (
    <Switch
      style={{
        backgroundColor: active ? "#52c41a" : "#f5222d",
      }}
      checkedChildren="Hoạt động"
      unCheckedChildren="Ngừng hoạt động"
      defaultChecked={active}
      onChange={handleChange}
    />
  );
};

export default ActiveSwitch;
