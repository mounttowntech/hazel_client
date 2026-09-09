import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../Services/orderService";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 20,
      };

      if (status) {
        params.status = status;
      }

      if (paymentStatus) {
        params.paymentStatus = paymentStatus;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getAllOrders(params);

      if (response.data.success) {
        setOrders(response.data.data || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Order Fetch Error:", error);

      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, paymentStatus]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setMessage("");
      setError("");

      const response = await updateOrderStatus(orderId, {
        orderStatus,
      });

      if (response.data.success) {
        setMessage(
          response.data.message || "Order status updated successfully",
        );

        fetchOrders();
      }
    } catch (error) {
      console.error("Order Status Update Error:", error);

      setError(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await deleteOrder(orderId);

      if (response.data.success) {
        setMessage(response.data.message || "Order deleted successfully");

        fetchOrders();
      }
    } catch (error) {
      console.error("Order Delete Error:", error);

      setError(error.response?.data?.message || "Failed to delete order");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getStatusClass = (value) => {
    if (!value) {
      return "";
    }

    return value.toLowerCase().replaceAll("_", "-");
  };

  return (
    <div className="order-page">
      <div className="order-page-header">
        <h2>Order Management</h2>

        <button className="order-add-btn" onClick={fetchOrders}>
          Refresh
        </button>
      </div>

      {error && <div className="order-error">{error}</div>}

      {message && <div className="order-success">{message}</div>}

      <div className="order-filters">
        <form className="order-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Order Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Order Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RETURN_REQUESTED">Return Requested</option>
          <option value="RETURNED">Returned</option>
          <option value="REFUND_REQUESTED">Refund Requested</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => {
            setPage(1);
            setPaymentStatus(e.target.value);
          }}
        >
          <option value="">All Payment Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="order-loading">Loading orders...</div>
      ) : (
        <div className="order-table-card">
          <div className="order-table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="order-empty">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="order-sno">
                        {(page - 1) * pagination.limit + index + 1}
                      </td>

                      <td>
                        <span className="order-number">
                          {order.orderNumber || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="order-customer-name">
                          {order.user?.name || "-"}
                        </div>

                        <div className="order-customer-email">
                          {order.user?.email || ""}
                        </div>

                        <div className="order-customer-mobile">
                          {order.user?.mobileNumber || ""}
                        </div>
                      </td>

                      <td>{order.items?.length || 0}</td>

                      <td className="order-amount">
                        {formatAmount(order.totalAmount)}
                      </td>

                      <td>{order.paymentMethod || "-"}</td>

                      <td>
                        <span
                          className={`order-payment-status ${getStatusClass(
                            order.paymentStatus,
                          )}`}
                        >
                          {order.paymentStatus || "-"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`order-status ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus || "-"}
                        </span>
                      </td>

                      <td>{formatDate(order.createdAt)}</td>

                      <td>
                        <div className="order-actions">
                          <select
                            className="order-status-select"
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <option value="PENDING">Pending</option>

                            <option value="CONFIRMED">Confirmed</option>

                            <option value="PROCESSING">Processing</option>

                            <option value="SHIPPED">Shipped</option>

                            <option value="OUT_FOR_DELIVERY">
                              Out For Delivery
                            </option>

                            <option value="DELIVERED">Delivered</option>

                            <option value="CANCELLED">Cancelled</option>

                            <option value="RETURN_REQUESTED">
                              Return Requested
                            </option>

                            <option value="RETURNED">Returned</option>

                            <option value="REFUND_REQUESTED">
                              Refund Requested
                            </option>

                            <option value="REFUNDED">Refunded</option>
                          </select>

                          <button
                            className="order-icon-btn delete"
                            onClick={() => handleDelete(order._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="order-pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
