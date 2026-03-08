"use client";

import NavBar from "@/components/ui/nav-bar";
import { Button, Flex } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/context/AuthContext";
import Avatar from "./Avatar";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/menu?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 h-[90px] flex flex-col z-50 shadow-sm justify-center font-sans font-medium">
      <div className="flex justify-between items-center gap-12 px-14">
        <div className="text-black flex gap-4">
          <NavBar />
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search Product..."
            className="w-[300px] px-4 py-1 pr-10 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder:font-sans"
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <path
              d="M7.1875 13.125C10.4667 13.125 13.125 10.4667 13.125 7.1875C13.125 3.90831 10.4667 1.25 7.1875 1.25C3.90831 1.25 1.25 3.90831 1.25 7.1875C1.25 10.4667 3.90831 13.125 7.1875 13.125Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.75 13.75L12.5 12.5"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-center">
          <div className="flex gap-4 px-4 border-r-[1px] border-[#3B3B3B]">
            
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1455 21.6769C12.7913 21.8019 12.208 21.8019 11.8538 21.6769C8.83301 20.6457 2.08301 16.3436 2.08301 9.05192C2.08301 5.83317 4.67676 3.229 7.87467 3.229C9.77051 3.229 11.4476 4.14567 12.4997 5.56234C13.5518 4.14567 15.2393 3.229 17.1247 3.229C20.3226 3.229 22.9163 5.83317 22.9163 9.05192C22.9163 16.3436 16.1663 20.6457 13.1455 21.6769Z" stroke="#0B8A00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5209 3.03125C9.07295 3.03125 6.27086 5.83333 6.27086 9.28125V12.2917C6.27086 12.9271 6.00003 13.8958 5.67711 14.4375L4.4792 16.4271C3.73961 17.6563 4.25003 19.0208 5.6042 19.4792C10.0938 20.9792 14.9375 20.9792 19.4271 19.4792C20.6875 19.0625 21.2396 17.5729 20.5521 16.4271L19.3542 14.4375C19.0417 13.8958 18.7709 12.9271 18.7709 12.2917V9.28125C18.7709 5.84375 15.9584 3.03125 12.5209 3.03125Z" stroke="#0B8A00" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M14.4479 3.3335C14.125 3.23975 13.7917 3.16683 13.4479 3.12516C12.4479 3.00016 11.4896 3.07308 10.5938 3.3335C10.8958 2.56266 11.6458 2.021 12.5208 2.021C13.3958 2.021 14.1458 2.56266 14.4479 3.3335Z" stroke="#0B8A00" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.6455 19.854C15.6455 21.5728 14.2393 22.979 12.5205 22.979C11.6663 22.979 10.8747 22.6248 10.3122 22.0623C9.74967 21.4998 9.39551 20.7082 9.39551 19.854" stroke="#0B8A00" stroke-width="1.5" stroke-miterlimit="10"/>
            </svg>

            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.8125 7.98941V6.97899C7.8125 4.63524 9.69792 2.33316 12.0417 2.11441C14.8333 1.84358 17.1875 4.04149 17.1875 6.78108V8.21858" stroke="#0B8A00" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.37519 22.9168H15.6252C19.8127 22.9168 20.5627 21.2397 20.7814 19.1981L21.5627 12.9481C21.8439 10.4064 21.1148 8.3335 16.6669 8.3335H8.33352C3.8856 8.3335 3.15644 10.4064 3.43769 12.9481L4.21894 19.1981C4.43769 21.2397 5.18769 22.9168 9.37519 22.9168Z" stroke="#0B8A00" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.1411 12.4998H16.1504" stroke="#0B8A00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.84812 12.4998H8.85748" stroke="#0B8A00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          </div>
          <div className="pl-4 relative flex flex-col items-center cursor-pointer">
            {isAuthenticated ? (
              <Avatar />
            ) : (
              <Flex gap="small" wrap>
                <Button
                  type="primary"
                  className="rounded-md"
                  onClick={() => router.push("/signin")}
                >
                  Log In
                </Button>
              </Flex>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
