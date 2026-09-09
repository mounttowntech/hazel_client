import { useState, useEffect } from 'react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FestivalBanner.css';
import axiosInstance from '../../api/axiosInstance';

const FestivalBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axiosInstance.get('/banners/active');
        const rawData = response.data.data || response.data;

        if (Array.isArray(rawData) && rawData.length > 0) {
          const firstBanner = rawData[0];

          const bannerImg = firstBanner.imageURL?.startsWith("http")
            ? firstBanner.imageURL
            : `http://localhost:5004${firstBanner.imageURL}`;

          setBanner({
            id: firstBanner._id,
            image: bannerImg,
            redirectUrl: firstBanner.redirectUrl || "#",
          });
        }
      } catch (error) {
        console.error("Error fetching banner from backend:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <section className="festival-banner-section">
        <div className="festival-banner-container">
          <p className="festival-loading-text">Loading festival banner...</p>
        </div>
      </section>
    );
  }

  if (!banner) return null;

  return (
    <section className="festival-banner-section">
      <div className="festival-banner-container">
        <a href={banner.redirectUrl} className="festival-banner-link">
          <img
            src={banner.image}
            alt="Festival Banner"
            className="festival-model-img"
          />
        </a>
      </div>
    </section>
  );
};

export default FestivalBanner;
