"use client";
import { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP, PAYMENT_STATUS_MAP } from "@/utils/format/translate";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { OrderDTO } from "@/utils/services/Api";
import { drinkshopService } from "@/utils/services/drinkshopService";
import { Table, Tag, Drawer, Select, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const { Option } = Select;

const orderStatusColors: Record<string, string> = {
  PENDING: "orange",
  PROCESSING: "blue",
  COMPLETED: "green",
};

const paymentStatusColors: Record<string, string> = {
  UNPAID: "volcano",
  PAID: "green",
};

const OrderTable = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await drinkshopService.api.getAllOrders();
      setOrders(response?.data as OrderDTO[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const changeOrderStatus = async (
    orderId: number,
    newStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  ) => {
    try {
      const response = await drinkshopService.api.updateOrderStatus(
        orderId,
        newStatus
      );
      if (response.status === 200) {
        fetchOrders();
        toast.success("Đổi trạng thái đơn hàng thành công!");
      } else {
        toast.error("Đổi trạng thái đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };

  const showDrawer = (order: OrderDTO) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const columns: ColumnsType<OrderDTO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thời gian đặt",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: "Người dùng",
      dataIndex: "userName",
      render: (name: string) => name || "Khách vãng lai",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <div className="flex gap-2">
          <span className={record.discountAmDouble ? "line-through" : ""}>
            {formatCurrency(record.price!)}
          </span>
          {record.discountAmDouble && (
            <span className="text-green-500">
              {formatCurrency(record.price! - record.discountAmDouble)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (
        status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED",
        record
      ) => (
        <Select
          value={status}
          onChange={(newStatus) => changeOrderStatus(record.id!, newStatus)}
          style={{ width: 120 }}
          disabled={status === "COMPLETED" || status === "CANCELLED"}
        >
          {Object.keys(orderStatusColors).map((status) => (
            <Option value={status} key={status}>
              <Tag color={orderStatusColors[status]}>{ORDER_STATUS_MAP[status]}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "payment",
      key: "payment",
      render: (payment) => (
        <Tag color={paymentStatusColors[payment.status]}>
          {PAYMENT_STATUS_MAP[payment.status!]} - {PAYMENT_METHOD_MAP[payment.paymentMethod!]}
        </Tag>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showDrawer(record)}>
          <Eye />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách đơn hàng</h2>
      </div>
      <Table columns={columns} dataSource={orders} rowKey={"id"} />
      <Drawer
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        onClose={closeDrawer}
        open={open}
        size={500}
      >
        {selectedOrder && (
          <>
            <p>
              <b>Khách hàng:</b> {selectedOrder.userName}
            </p>
            <p>
              <b>SĐT:</b> {selectedOrder.phoneNumber}
            </p>
            <p>
              <b>Địa chỉ:</b> {selectedOrder.address}
            </p>
            <p>
              <b>Sản phẩm:</b>
            </p>
            <ul>
              {selectedOrder.orderDetails?.map((item, idx: number) => (
                <li key={idx}>
                  {item.productName} ({item.size}) - {item.quantity} x{" "}
                  {item.unitPrice?.toLocaleString()}₫
                </li>
              ))}
            </ul>
            <p>
              <b>Tổng tiền:</b> {selectedOrder.price?.toLocaleString()}₫
            </p>
            <p>
              <b>Trạng thái đơn:</b> {ORDER_STATUS_MAP[selectedOrder.orderStatus!]}
            </p>
            <p>
              <b>Ghi chú:</b> {selectedOrder.note || "Không có ghi chú"}
            </p>
            <p>
              <b>Thanh toán:</b> {PAYMENT_STATUS_MAP[selectedOrder.payment?.status!]} -{" "}
              {PAYMENT_METHOD_MAP[selectedOrder.payment?.paymentMethod!]}
            </p>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default OrderTable;
