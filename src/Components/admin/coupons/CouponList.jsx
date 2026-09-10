import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import CommonModal from "../../common/CommonModal";
import CouponForm from "./CouponForm";

import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../../services/couponService";

import { getCategories } from "../../../services/categoryService";
import { getProducts } from "../../../services/productService";

import "./Coupon.css";

const CouponList = () => {
  // ============================================================
  // STATES
  // ============================================================

  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [savingCoupon, setSavingCoupon] = useState(false);

  // ============================================================
  // INITIAL DATA LOAD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const [
          couponResponse,
          categoryResponse,
          productResponse,
        ] = await Promise.all([
          getCoupons(),
          getCategories(),
          getProducts(),
        ]);

        if (cancelled) {
          return;
        }

        // --------------------------------------------------------
        // COUPONS
        // --------------------------------------------------------

        if (couponResponse?.success) {
          setCoupons(couponResponse?.data || []);
        } else {
          setCoupons([]);

          toast.error(
            couponResponse?.message ||
              "Failed to fetch coupons"
          );
        }

        // --------------------------------------------------------
        // CATEGORIES
        // --------------------------------------------------------

        if (categoryResponse?.data?.success) {
          setCategories(
            categoryResponse?.data?.data || []
          );
        } else {
          setCategories([]);

          toast.error(
            categoryResponse?.data?.message ||
              "Failed to fetch categories"
          );
        }

        // --------------------------------------------------------
        // PRODUCTS
        // --------------------------------------------------------

        if (productResponse?.data?.success) {
          setProducts(
            productResponse?.data?.data || []
          );
        } else {
          setProducts([]);

          toast.error(
            productResponse?.data?.message ||
              "Failed to fetch products"
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Initial coupon page load error:",
          error
        );

        setCoupons([]);
        setCategories([]);
        setProducts([]);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load coupon data"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // GET COUPON STATUS
  // ============================================================

  const getCouponStatus = (coupon) => {
    if (!coupon) {
      return "Inactive";
    }

    if (coupon.isActive === false) {
      return "Inactive";
    }

    const now = new Date();

    if (coupon.startDate) {
      const startDate = new Date(coupon.startDate);

      if (now < startDate) {
        return "Upcoming";
      }
    }

    if (coupon.endDate) {
      const endDate = new Date(coupon.endDate);

      if (now > endDate) {
        return "Expired";
      }
    }

    if (coupon.isActive === true) {
      return "Active";
    }

    return "Inactive";
  };

  // ============================================================
  // FILTER COUPONS
  // ============================================================

  const filteredCoupons = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      // ----------------------------------------------------------
      // SEARCH
      // ----------------------------------------------------------

      const matchesSearch =
        !searchValue ||
        coupon?.couponCode
          ?.toLowerCase()
          .includes(searchValue) ||
        coupon?.code
          ?.toLowerCase()
          .includes(searchValue) ||
        coupon?.couponName
          ?.toLowerCase()
          .includes(searchValue) ||
        coupon?.name
          ?.toLowerCase()
          .includes(searchValue);

      // ----------------------------------------------------------
      // STATUS
      // ----------------------------------------------------------

      const status = getCouponStatus(coupon);

      const matchesStatus =
        !statusFilter ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return "-";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // FORMAT DISCOUNT
  // ============================================================

  const formatDiscount = (coupon) => {
    if (!coupon) {
      return "-";
    }

    const discountType =
      coupon.discountType ||
      coupon.type ||
      "";

    const discountValue =
      coupon.discountValue ??
      coupon.value ??
      0;

    if (
      discountType === "percentage" ||
      discountType === "percent"
    ) {
      return `${discountValue}%`;
    }

    if (
      discountType === "fixed" ||
      discountType === "flat" ||
      discountType === "amount"
    ) {
      return `₹${discountValue}`;
    }

    return discountValue;
  };

  // ============================================================
  // GET MAX DISCOUNT
  // ============================================================

  const getMaxDiscount = (coupon) => {
    if (!coupon) {
      return "-";
    }

    const maxDiscount =
      coupon.maxDiscount ??
      coupon.maximumDiscount ??
      coupon.maxDiscountAmount;

    if (
      maxDiscount === undefined ||
      maxDiscount === null ||
      maxDiscount === ""
    ) {
      return "-";
    }

    return `₹${maxDiscount}`;
  };

  // ============================================================
  // GET USAGE TEXT
  // ============================================================

  const getUsageText = (coupon) => {
    if (!coupon) {
      return "-";
    }

    const usedCount =
      coupon.usedCount ??
      coupon.usageCount ??
      coupon.used ??
      0;

    const usageLimit =
      coupon.usageLimit ??
      coupon.totalUsageLimit ??
      coupon.maxUsage ??
      null;

    if (
      usageLimit === null ||
      usageLimit === undefined ||
      usageLimit === ""
    ) {
      return `${usedCount}`;
    }

    return `${usedCount} / ${usageLimit}`;
  };

  // ============================================================
  // GET APPLICABILITY
  // ============================================================

  const getApplicability = (coupon) => {
    if (!coupon) {
      return "-";
    }

    if (
      coupon.applicableTo === "all" ||
      coupon.applicableType === "all"
    ) {
      return "All Products";
    }

    if (
      coupon.applicableTo === "category" ||
      coupon.applicableType === "category"
    ) {
      return "Category";
    }

    if (
      coupon.applicableTo === "product" ||
      coupon.applicableType === "product"
    ) {
      return "Product";
    }

    if (coupon.categoryId) {
      return "Category";
    }

    if (coupon.productId) {
      return "Product";
    }

    if (
      coupon.categoryIds?.length > 0
    ) {
      return "Category";
    }

    if (
      coupon.productIds?.length > 0
    ) {
      return "Product";
    }

    return "All Products";
  };

  // ============================================================
  // GET STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "active";

      case "Inactive":
        return "inactive";

      case "Upcoming":
        return "upcoming";

      case "Expired":
        return "expired";

      default:
        return "inactive";
    }
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  // ============================================================
  // ADD COUPON
  // ============================================================

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setIsCouponModalOpen(true);
  };

  // ============================================================
  // EDIT COUPON
  // ============================================================

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    if (savingCoupon) {
      return;
    }

    setIsCouponModalOpen(false);
    setSelectedCoupon(null);
  };

  // ============================================================
  // CREATE / UPDATE COUPON
  // ============================================================

  const handleCouponSubmit = async (formData) => {
    try {
      setSavingCoupon(true);

      let response;

      // ----------------------------------------------------------
      // UPDATE
      // ----------------------------------------------------------

      if (selectedCoupon?._id) {
        response = await updateCoupon(
          selectedCoupon._id,
          formData
        );
      }

      // ----------------------------------------------------------
      // CREATE
      // ----------------------------------------------------------

      else {
        response = await createCoupon(formData);
      }

      if (response?.success) {
        toast.success(
          response?.message ||
            (
              selectedCoupon
                ? "Coupon updated successfully"
                : "Coupon created successfully"
            )
        );

        setIsCouponModalOpen(false);
        setSelectedCoupon(null);

        // --------------------------------------------------------
        // REFRESH COUPONS
        // --------------------------------------------------------

        try {
          const couponResponse = await getCoupons();

          if (couponResponse?.success) {
            setCoupons(
              couponResponse?.data || []
            );
          } else {
            toast.error(
              couponResponse?.message ||
                "Failed to refresh coupons"
            );
          }
        } catch (refreshError) {
          console.error(
            "Refresh coupons error:",
            refreshError
          );

          toast.error(
            "Coupon saved, but list refresh failed"
          );
        }
      } else {
        toast.error(
          response?.message ||
            (
              selectedCoupon
                ? "Failed to update coupon"
                : "Failed to create coupon"
            )
        );
      }
    } catch (error) {
      console.error(
        "Coupon save error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save coupon"
      );
    } finally {
      setSavingCoupon(false);
    }
  };

  // ============================================================
  // DELETE COUPON
  // ============================================================

  const handleDelete = async (coupon) => {
    if (!coupon?._id) {
      toast.error("Invalid coupon");
      return;
    }

    const couponCode =
      coupon.couponCode ||
      coupon.code ||
      coupon.couponName ||
      coupon.name ||
      "this coupon";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${couponCode}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteCoupon(
        coupon._id
      );

      if (response?.success) {
        toast.success(
          response?.message ||
            "Coupon deleted successfully"
        );

        // --------------------------------------------------------
        // REMOVE FROM CURRENT STATE
        // --------------------------------------------------------

        setCoupons((previousCoupons) =>
          previousCoupons.filter(
            (item) =>
              item?._id !== coupon._id
          )
        );
      } else {
        toast.error(
          response?.message ||
            "Failed to delete coupon"
        );
      }
    } catch (error) {
      console.error(
        "Delete coupon error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete coupon"
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="coupon-page">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="coupon-header">

        <div>
          <h2>Coupons</h2>

          <p>
            Manage discount coupons and promotional offers
          </p>
        </div>

        <button
          type="button"
          className="coupon-add-btn"
          onClick={handleAddCoupon}
        >
          + Add Coupon
        </button>

      </div>

      {/* ========================================================
          FILTER SECTION
      ======================================================== */}

      <div className="coupon-filter-section">

        {/* SEARCH */}

        <div className="coupon-search-box">

          <input
            type="text"
            placeholder="Search coupon code or name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {/* STATUS FILTER */}

        <div className="coupon-status-filter">

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>

        {/* CLEAR */}

        {(search || statusFilter) && (
          <button
            type="button"
            className="coupon-clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>

      {/* ========================================================
          COUNT
      ======================================================== */}

      <div className="coupon-result-count">

        Showing{" "}
        <strong>
          {filteredCoupons.length}
        </strong>{" "}
        of{" "}
        <strong>
          {coupons.length}
        </strong>{" "}
        coupons

      </div>

      {/* ========================================================
          TABLE
      ======================================================== */}

      <div className="coupon-table-wrapper">

        {loading ? (

          <div className="coupon-loading">
            Loading coupons...
          </div>

        ) : filteredCoupons.length === 0 ? (

          <div className="coupon-empty">

            <div className="coupon-empty-icon">
              %
            </div>

            <h3>
              No Coupons Found
            </h3>

            <p>
              {search || statusFilter
                ? "Try changing your search or filters."
                : "Create your first coupon to get started."}
            </p>

            {!search && !statusFilter && (
              <button
                type="button"
                className="coupon-add-btn"
                onClick={handleAddCoupon}
              >
                + Add Coupon
              </button>
            )}

          </div>

        ) : (

          <table className="coupon-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Coupon
                </th>

                <th>
                  Discount
                </th>

                <th>
                  Max Discount
                </th>

                <th>
                  Applicable To
                </th>

                <th>
                  Usage
                </th>

                <th>
                  Start Date
                </th>

                <th>
                  End Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCoupons.map(
                (coupon, index) => {

                  const status =
                    getCouponStatus(coupon);

                  const couponCode =
                    coupon?.couponCode ||
                    coupon?.code ||
                    "-";

                  const couponName =
                    coupon?.couponName ||
                    coupon?.name ||
                    "-";

                  return (

                    <tr
                      key={
                        coupon?._id ||
                        couponCode ||
                        index
                      }
                    >

                      {/* INDEX */}

                      <td>
                        {index + 1}
                      </td>

                      {/* COUPON */}

                      <td>

                        <div className="coupon-code-cell">

                          <strong>
                            {couponCode}
                          </strong>

                          {couponName !== "-" && (
                            <span>
                              {couponName}
                            </span>
                          )}

                        </div>

                      </td>

                      {/* DISCOUNT */}

                      <td>
                        <strong>
                          {formatDiscount(coupon)}
                        </strong>
                      </td>

                      {/* MAX DISCOUNT */}

                      <td>
                        {getMaxDiscount(coupon)}
                      </td>

                      {/* APPLICABILITY */}

                      <td>
                        {getApplicability(coupon)}
                      </td>

                      {/* USAGE */}

                      <td>
                        {getUsageText(coupon)}
                      </td>

                      {/* START DATE */}

                      <td>
                        {formatDate(
                          coupon?.startDate
                        )}
                      </td>

                      {/* END DATE */}

                      <td>
                        {formatDate(
                          coupon?.endDate
                        )}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`coupon-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="coupon-actions">

                          <button
                            type="button"
                            className="coupon-edit-btn"
                            onClick={() =>
                              handleEdit(coupon)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="coupon-delete-btn"
                            onClick={() =>
                              handleDelete(coupon)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        )}

      </div>

      {/* ========================================================
          COUPON MODAL
      ======================================================== */}

      <CommonModal
        isOpen={isCouponModalOpen}
        onClose={handleCloseModal}
        title={
          selectedCoupon
            ? "Edit Coupon"
            : "Add Coupon"
        }
      >

        <CouponForm
          coupon={selectedCoupon}
          categories={categories}
          products={products}
          onSubmit={handleCouponSubmit}
          onCancel={handleCloseModal}
          loading={savingCoupon}
        />

      </CommonModal>

    </div>
  );
};

export default CouponList;