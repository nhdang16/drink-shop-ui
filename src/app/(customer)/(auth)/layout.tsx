"use client";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  return (
    <div className="">
      <div className="py-4 px-64 bg-white">
        <Breadcrumb
          separator={<RightOutlined style={{ width: 8 }} />}
          items={[
            {
              href: "/",
              title: (
                <div className="flex gap-2">
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <>
                  <span className="font-bold text-[#AD343E]">
                    {pathName === "/signin" ? "Đăng nhập" : "Đăng ký"}
                  </span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="w-full py-10 flex justify-center items-center">
        <div className="bg-white rounded-[4px] shadow-md w-1/3">
          <div className="flex">
            <Link
              className={clsx(
                "flex-1 flex justify-center items-center py-4 leading-2",
                pathName === "/signin"
                  ? "text-[#191C1F] font-bold border-b-4 border-[#AD343E]"
                  : "text-[#77878F] border-b-[1px] border-[#E4E7E9]"
              )}
              href="/signin"
            >
              Đăng nhập
            </Link>
            <Link
              className={clsx(
                "flex-1 flex justify-center items-center py-4 leading-2",
                pathName === "/signup"
                  ? "text-[#191C1F] font-bold border-b-4 border-[#AD343E]"
                  : "text-[#77878F] border-b-[1px] border-[#E4E7E9]"
              )}
              href="/signup"
            >
              Đăng ký
            </Link>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
