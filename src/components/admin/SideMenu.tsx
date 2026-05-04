"use client";
import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation"; // ✅ Import đúng router
import {
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

const SideMenu = () => {
  const router = useRouter(); // ✅ Khởi tạo router

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Quản lý",
      type: "group",
      children: [
        {
          key: "",
          icon: <DashboardOutlined />,
          label: "Bảng điều khiển",
        },
        {
          key: "products",
          icon: <AppstoreOutlined />,
          label: "Sản phẩm",
        },
        {
          key: "categories",
          icon: <TagsOutlined />,
          label: "Danh mục",
        },
        {
          key: "orders",
          icon: <ShoppingOutlined />,
          label: "Đơn hàng",
        },
        {
          key: "discounts",
          icon: <TagsOutlined />,
          label: "Khuyến mãi",
        },
      ],
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    router.push(`/admin/${key}`);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      mode="inline"
      items={items}
    />
  );
};

export default SideMenu;
