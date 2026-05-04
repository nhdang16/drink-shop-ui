"use client";

import { formatCurrency } from "@/utils/format/formatCurrency";
import { Discount } from "@/utils/services/Api";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ActiveSwitch from "./ActiveSwitch";
import AddDiscount from "./AddDiscount";
import DeleteDiscount from "./DeleteDiscount";
import UpdateDiscount from "./UpdateDiscount";

const DiscountTable = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await drinkshopService.api.getAllDiscounts();
      setDiscounts(response?.data as Discount[]);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const columns: ColumnsType<Discount> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại",
      dataIndex: "discountAmountType",
      key: "discountAmountType",
      render: (type) => (
        <Tag color={type === "PERCENTAGE" ? "blue" : "purple"}>
          {type === "PERCENTAGE" ? "Phần trăm (%)" : "Số tiền (VND)"}
        </Tag>
      ),
    },
    {
      title: "Mức giảm",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) =>
        record.discountAmountType === "PERCENTAGE"
          ? `${amount}%`
          : `${formatCurrency(amount)}`,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minimumOrderPrice",
      key: "minimumOrderPrice",
      render: (price) => `${formatCurrency(price)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <ActiveSwitch
          active={isActive}
          fetchDiscounts={fetchDiscounts}
          id={record.id!}
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => desc || "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <UpdateDiscount
            discountId={record.id!}
            fetchDiscounts={fetchDiscounts}
          />
          <DeleteDiscount
            discountId={record.id!}
            fetchDiscounts={fetchDiscounts}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách khuyến mãi</h2>
        <AddDiscount fetchDiscounts={fetchDiscounts} />
      </div>
      <Table
        columns={columns}
        dataSource={discounts}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DiscountTable;
