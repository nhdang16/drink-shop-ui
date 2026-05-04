export const ORDER_STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_METHOD_MAP: Record<string, string> = {
  Banking: "Chuyển khoản",
  Cash: "Tiền mặt",
};

export const PAYMENT_STATUS_MAP: Record<string, string> = {
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
};