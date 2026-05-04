/* eslint-disable @next/next/no-img-element */
"use client";
import { useAuth } from "@/utils/context/AuthContext";
import { Dropdown, MenuProps } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const Avatar = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const truncatedFullName =
    currentUser?.fullName && currentUser?.fullName.length > 4
      ? `${currentUser?.fullName.substring(0, 4)}...`
      : currentUser?.fullName;

  const items: MenuProps["items"] = [
    {
      key: "fullName",
      label: (
        <div className="cursor-default hover:none">{currentUser?.email}</div>
      ),
    },
    ...(currentUser?.role !== "ADMIN"
      ? [
          {
            key: "profile",
            label: (
              <div
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                Hồ sơ của tôi
              </div>
            ),
          },
        ]
      : []),
    // ✅ Thêm mục Dashboard nếu là admin
    ...(currentUser?.role === "ADMIN"
      ? [
          {
            key: "dashboard",
            label: (
              <div
                onClick={() => router.push("/admin")}
                className="cursor-pointer"
              >
                Bảng điều khiển
              </div>
            ),
          },
        ]
      : []),

    {
      key: "logout",
      label: (
        <div onClick={logout} className="cursor-pointer text-red-500">
          Đăng xuất
        </div>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div>
        <div className="relative w-9 h-9">
          <img
            src="/images/avatar.png"
            alt="User Avatar"
            className="object-cover w-full h-full rounded-full"
          />

          {/* 🔰 Huy hiệu Loyalty ở góc phải */}
          {currentUser?.loyaltyMember && (
            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-1 rounded-full shadow">
              {currentUser?.loyaltyMember === "LEVEL_1" ? "L1" : "L2"}
            </span>
          )}
        </div>

        {/* Tên dưới ảnh */}
        <span className="absolute text-black text-xs -bottom-[18px]">
          {truncatedFullName || ""}
        </span>
      </div>
    </Dropdown>
  );
};

export default Avatar;
