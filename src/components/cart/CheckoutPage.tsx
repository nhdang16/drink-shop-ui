"use client";
import { useAuth } from "@/utils/context/AuthContext";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { CartItemDTO, OrderRequest } from "@/utils/services/Api";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { CartItem, useCartStore } from "@/utils/store/cartStore";
import { Card, Divider, Select } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const { cart, discountId, clearCart, getTotalPrice } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setPhone(currentUser?.phoneNumber || "");
      setName(currentUser?.fullName || "");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentMethodFromQuery = queryParams.get("paymentMethod");
    if (paymentMethodFromQuery) {
      setPaymentMethod(paymentMethodFromQuery);
    }
  }, []);

  function getLoyaltyDiscount(loyaltyLevel: string) {
    if (loyaltyLevel === "LEVEL_1") return 0.1;
    if (loyaltyLevel === "LEVEL_2") return 0.2;
    return 0;
  }

  const originalPrice = getTotalPrice();
  const loyaltyDiscount = getLoyaltyDiscount(currentUser?.loyaltyMember || "");
  const { discountAmount } = useCartStore.getState();
  const priceAfterVoucher = originalPrice - discountAmount;
  const finalPrice = priceAfterVoucher - priceAfterVoucher * loyaltyDiscount;

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      toast.info("Giỏ hàng trống!");
      return;
    }
    if (!phone || !address) {
      toast.info("Vui lòng nhập số điện thoại và địa chỉ!");
      return;
    }
    const orderData: OrderRequest = {
      phoneNumber: phone,
      address,
      paymentMethod,
      items: cart.map<CartItemDTO>((item: CartItem) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        size: item.size,
        sugarRate: item.sugar,
        iceRate: item.ice,
      })),
      totalPrice: finalPrice,
      discountId: discountId ? discountId : undefined,
      discountAmount: originalPrice - finalPrice,
      note,
    };
    try {
      const response = await drinkshopService.api.checkout(orderData);
      if (response.status !== 200) {
        toast.error("Đặt hàng thất bại!");
        return;
      }
      if (!currentUser) {
        const orderId = response.data.id;
        await drinkshopService.api.recordGuestOrder(orderId as number);
      }
      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/profile/order");
    } catch (e) {
      console.error("Fail while ordering!", e);
      toast.error("Đặt hàng thất bại, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-white p-16">
      <div>
        <div className="flex justify-between w-full">
          <Title level={1}>Chi tiết thanh toán</Title>
          <span className="text-[#6E6E6E]">
            Giao hàng miễn phí.
          </span>
        </div>
        <span className="text-[#8A8B8D]">
          Nhập thông tin cá nhân của bạn để hoàn tất việc mua hàng.
        </span>
        <div className="flex gap-4">
          <div className="w-3/4">
            <div className="my-8 space-y-4">
              <p className="text-[#6E6E6E]">Giá</p>
              <div className="flex gap-5 items-center">
                <label className="text-black min-w-[100px]">Thành tiền</label>
                <div className="w-full px-4 py-1 border-[2px] border-[#F4F4F4] rounded-full text-black">
                  {discountAmount > 0 || loyaltyDiscount > 0 ? (
                    <div className="flex flex-col text-sm">
                      <span className="line-through text-gray-400">
                        {formatCurrency(originalPrice)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(finalPrice)}
                      </span>
                      {discountAmount > 0 && (
                        <span className="text-xs text-yellow-600 italic">
                          Giảm {formatCurrency(discountAmount)} từ voucher
                        </span>
                      )}
                      {loyaltyDiscount > 0 && (
                        <span className="text-xs text-yellow-600 italic">
                          Giảm thêm {loyaltyDiscount * 100}% từ{" "}
                          {currentUser?.loyaltyMember === "LEVEL_1" ? "Thành viên cấp 1" : "Thành viên cấp 2"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>{formatCurrency(originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
            <Divider />
            <div className="my-8 space-y-4">
              <p className="text-[#6E6E6E]">Thông tin chung</p>
              <div className="flex gap-5 items-center">
                <label className="text-black min-w-[100px]">Họ và tên</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-4 py-1 border-[2px] border-[#F4F4F4] rounded-full text-black"
                />
              </div>
              <div className="flex gap-5 items-center">
                <label className="text-black min-w-[100px]">Số điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-1 border-[2px] border-[#F4F4F4] rounded-full text-black"
                />
              </div>
              <div className="flex gap-5 items-center">
                <label className="text-black min-w-[100px]">Địa chỉ</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Địa chỉ"
                  className="w-full px-4 py-1 border-[2px] border-[#F4F4F4] rounded-full text-black"
                />
              </div>
              <div className="flex gap-5 items-start">
                <label className="text-black min-w-[100px] mt-2">Ghi chú</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm về đơn hàng..."
                  className="w-full px-4 py-2 border-[2px] border-[#F4F4F4] rounded-2xl text-black"
                  rows={3}
                />
              </div>
            </div>
            <Divider />
            <div className="my-8 space-y-4">
              <p className="text-[#6E6E6E]">Phương thức thanh toán</p>
              <div className="flex gap-5 items-center">
                <label className="text-black min-w-[100px]">Phương thức</label>
                <Select
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  className="w-full"
                >
                  <Select.Option value="Cash">Tiền mặt</Select.Option>
                  <Select.Option value="Banking">Chuyển khoản</Select.Option>
                </Select>
              </div>
            </div>
            {paymentMethod === "Banking" && (
              <div className="flex gap-6 p-6 border rounded-xl bg-gray-50 shadow-md">
                {/* Cột 1: Thông tin tài khoản */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Thông tin thanh toán
                  </h3>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium text-gray-700">
                      Chủ tài khoản:
                    </span>{" "}
                    Phan Khanh Huyen
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">
                      Ngân hàng:
                    </span>{" "}
                    VietinBank
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">
                      Số tài khoản:
                    </span>{" "}
                    106873776847
                  </p>
                </div>

                {/* Cột 2: QR Code */}
                <div className="flex flex-1 flex-col items-center">
                  <Image
                    src="/images/qr-code.png"
                    width={180}
                    height={180}
                    alt="QR Code"
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleConfirmOrder}
              className="mt-4 px-4 font-semibold bg-black text-white rounded-xl py-3 w-full"
            >
              {paymentMethod === "Cash"
                ? "Xác nhận đặt hàng"
                : "Tiến hành thanh toán"}
            </button>
          </div>
          <Card className="w-1/4 rounded-2xl shadow-md p-0">
            {cart.map((product) => (
              <ProductCard
                key={product.id + product.size + product.sugar + product.ice}
                product={product}
              />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: CartItem }) => {
  return (
    <div className="mb-4">
      <Image
        className="w-full rounded-2xl"
        src={product.image}
        width={100}
        height={100}
        alt=""
      />
      <Title className="my-2" level={3}>
        {product.name} ({product.size})
      </Title>
      <span className="font-montserrat text-black text-xs font-medium">
        x{product.quantity} - {product.sugar} Đường - {product.ice} Đá
      </span>
      <Divider className="my-1" />
    </div>
  );
};

export default CheckoutPage;
