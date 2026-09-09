import { useEffect, useState } from "react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../../Services/bannerService";

import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerType, setBannerType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5004";

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBanners();

      if (response.data.success) {
        setBanners(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setBannerType("");
    setImage(null);
    setPreview("");
    setEditId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!bannerType) {
      setError("Please select banner type");
      return;
    }

    if (!editId && !image) {
      setError("Please select a banner image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("bannerType", bannerType);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (editId) {
        response = await updateBanner(editId, formData);
      } else {
        response = await createBanner(formData);
      }

      if (response.data.success) {
        setMessage(response.data.message);
        resetForm();
        fetchBanners();
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to save banner");
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner._id);
    setBannerType(banner.bannerType);
    setImage(null);

    setPreview(banner.imageURL ? `${API_BASE_URL}${banner.imageURL}` : "");

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?",
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      const response = await deleteBanner(id);

      if (response.data.success) {
        setMessage(response.data.message);
        fetchBanners();

        if (editId === id) {
          resetForm();
        }
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to delete banner");
    }
  };

  const getBannerTypeName = (type) => {
    const types = {
      offer: "Offer",
      festival: "Festival",
      dailyUsage: "Daily Usage",
    };

    return types[type] || type;
  };

  return (
    <div className="banner-page">
      <div className="banner-page-header">
        <h2>Banner Management</h2>
      </div>

      {message && <div className="banner-success">{message}</div>}

      {error && <div className="banner-error">{error}</div>}

      <div className="banner-form-card">
        <h3>{editId ? "Edit Banner" : "Add Banner"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="banner-form-grid">
            <div className="banner-form-group">
              <label>Banner Type</label>

              <select
                value={bannerType}
                onChange={(e) => setBannerType(e.target.value)}
              >
                <option value="">Select Banner Type</option>

                <option value="offer">Offer</option>

                <option value="festival">Festival</option>

                <option value="dailyUsage">Daily Usage</option>
              </select>
            </div>

            <div className="banner-form-group">
              <label>Banner Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {preview && (
            <div className="banner-preview">
              <img src={preview} alt="Banner Preview" />
            </div>
          )}

          <div className="banner-form-actions">
            <button type="submit" className="banner-save-btn">
              {editId ? "Update Banner" : "Save Banner"}
            </button>

            {editId && (
              <button
                type="button"
                className="banner-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="banner-table-card">
        {loading ? (
          <div className="banner-loading">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="banner-empty">No banners found</div>
        ) : (
          <table className="banner-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Banner Type</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.map((banner, index) => (
                <tr key={banner._id}>
                  <td className="banner-sno">{index + 1}</td>

                  <td>
                    <img
                      className="banner-image"
                      src={`${API_BASE_URL}${banner.imageURL}`}
                      alt={banner.bannerType}
                    />
                  </td>

                  <td>
                    <span className="banner-type">
                      {getBannerTypeName(banner.bannerType)}
                    </span>
                  </td>

                  <td>
                    {new Date(banner.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <div className="banner-actions">
                      <button
                        className="banner-icon-btn edit"
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </button>

                      <button
                        className="banner-icon-btn delete"
                        onClick={() => handleDelete(banner._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Banner;
