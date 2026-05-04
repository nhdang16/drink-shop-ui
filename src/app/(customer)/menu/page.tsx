import React, { Suspense } from "react";
import MenuList from "./components/MenuList";

const page = () => {
  return (
    <div className="bg-white py-10 flex justify-center flex-col">
      <span className="font-playfair font-normal text-[60px] text-[#2C2F24] text-center">
        Thực đơn của chúng tôi
      </span>
      <span className="text-center pt-5 w-full max-w-lg block mx-auto font-sans text-base font-normal text-[#495460]">
        Chúng tôi mang đến những thức uống tuyệt vời nhất với chất lượng tốt nhất.
      </span>
      <Suspense fallback={<div>Đang tải thực đơn...</div>}>
        <MenuList />
      </Suspense>{" "}
    </div>
  );
};

export default page;
