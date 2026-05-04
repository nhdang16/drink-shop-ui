"use client";
import { OrderDTO } from "@/utils/services/Api";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { Button, Popconfirm, Tabs } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { toast } from "react-toastify";
import { useAuth } from "@/utils/context/AuthContext";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const orderStatusMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const paymentStatusMap: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

const paymentMethodMap: Record<string, string> = {
  CASH: "Tiền mặt",
  Cash: "Tiền mặt",
  TRANSFER: "Chuyển khoản",
  Banking: "Chuyển khoản",
  BANKING: "Chuyển khoản",
};

function OrderCard({
  fetchOrders,
  order,
}: {
  fetchOrders: () => void;
  order: OrderDTO;
}) {
  const handleCancel = async () => {
    const response = await drinkshopService.api.updateOrderStatus(
      order.id as number,
      "CANCELLED"
    );
    console.log(response);
    if (response.status === 200) {
      fetchOrders();
      toast.success("Hủy đơn hàng thành công!");
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">Đơn hàng #{order.id}</div>
          <div className="text-sm text-gray-500">
            {format(
              new Date(order.orderTime as string),
              "dd/MM/yyyy HH:mm"
            )}
          </div>
        </div>
        <div
          className={clsx(
            "px-2 py-1 text-sm rounded",
            statusColors[order.orderStatus as keyof typeof statusColors]
          )}
        >
          {orderStatusMap[order.orderStatus as keyof typeof orderStatusMap] || order.orderStatus}
        </div>
      </div>

      <div className="flex">
        <div className="text-sm text-gray-700 space-y-1 flex-1">
          {order.orderDetails?.map((item, idx) => (
            <div key={idx}>
              {item.productName} - Kích cỡ: {item.size} | Đường: {item.sugarRate} |
              Đá: {item.iceRate} | Số lượng: {item.quantity}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <div>
            📍 <strong>Địa chỉ giao hàng:</strong> {order.address}
          </div>
          <div>
            📞 <strong>Số điện thoại:</strong> {order.phoneNumber}
          </div>
          {order.payment?.paymentMethod && (
            <div>
              💳 <strong>Phương thức thanh toán:</strong> {paymentMethodMap[order.payment?.paymentMethod] || order.payment?.paymentMethod}
            </div>
          )}
          {order.payment?.status && (
            <div>
              📄 <strong>Trạng thái thanh toán:</strong> {paymentStatusMap[order.payment?.status] || order.payment?.status}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center font-semibold text-lg text-primary">
        <div>
          {order.orderStatus == "PENDING" && (
            <Popconfirm
              title="Hủy đơn hàng"
              description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
              onConfirm={handleCancel}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="primary">Hủy đơn hàng</Button>
            </Popconfirm>
          )}
        </div>
        <div className="flex gap-4">
          <span className={order.discountAmDouble ? "line-through" : ""}>
            {formatCurrency(order.price! + order.discountAmDouble!)}
          </span>
          {order.discountAmDouble && (
            <span className="text-green-500">
              {formatCurrency(order.price!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderDTO[]>([]);

  const fetchOrders = async () => {
    try {
      if (currentUser) {
        const response = await drinkshopService.api.getOrdersByUserId();
        setOrders(response.data);
      } else {
        const response = await drinkshopService.api.getGuestOrder();
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const current = orders.filter((o) =>
    ["PENDING", "PROCESSING"].includes(o.orderStatus!)
  );
  const history = orders.filter((o) =>
    ["COMPLETED", "CANCELLED"].includes(o.orderStatus!)
  );

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: "Hiện tại",
          children: (
            <div className="space-y-4">
              {current.map((o) => (
                <OrderCard fetchOrders={fetchOrders} key={o.id} order={o} />
              ))}
            </div>
          ),
        },
        {
          key: "2",
          label: "Lịch sử",
          children: (
            <div className="space-y-4">
              {history.map((o) => (
                <OrderCard fetchOrders={fetchOrders} key={o.id} order={o} />
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
