import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './FestivalBanner.css';

const FestivalBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        const response = await API.get('/banners/active');
        const rawData = response.data.data || response.data;

        if (rawData && rawData.length > 0) {
          const formattedBanners = rawData.map(activeBanner => {
            const desktopImg = activeBanner.image?.startsWith('http')
              ? activeBanner.image
              : `http://localhost:5004${activeBanner.image}`;

            const mobileImg = activeBanner.mobileImage
              ? (activeBanner.mobileImage.startsWith('http') ? activeBanner.mobileImage : `http://localhost:5004${activeBanner.mobileImage}`)
              : desktopImg;

            let calculatedSubtitle = activeBanner.subtitle || "";
            if (activeBanner.discountPercentage) {
              calculatedSubtitle = `UP TO ${activeBanner.discountPercentage}% OFF`;
            }

            return {
              id: activeBanner._id,
              title: activeBanner.title || "FESTIVAL SALE",
              subtitle: calculatedSubtitle,
              description: activeBanner.description || "ON ALL COLLECTIONS",
              buttonText: activeBanner.buttonText || "SHOP NOW",
              image: desktopImg,
              mobileImage: mobileImg,
              redirectUrl: activeBanner.redirectUrl || '#'
            };
          });

          setBanners(formattedBanners);
        }
      } catch (error) {
        console.error('Error fetching banners from backend:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanners();
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

  if (banners.length === 0) return null;

  // Render single structured banner layout if only 1 exists
  if (banners.length === 1) {
    const banner = banners[0];
    const selectedImage = isMobile ? banner.mobileImage : banner.image;
    const titleWords = banner.title.split(' ');

    return (
      <section className="festival-banner-section">
        <div className="festival-banner-container">
          <div className="festival-left-content">
            <h2 className="festival-main-title">
              {titleWords[0]}
              <br />
              {titleWords.slice(1).join(' ')}
            </h2>
          </div>
          <div className="festival-center-content">
            <span className="festival-discount-heading">{banner.subtitle}</span>
            <p className="festival-subtext">{banner.description}</p>
            <a href={banner.redirectUrl} className="festival-shop-btn-link">
              <button className="festival-shop-btn">{banner.buttonText}</button>
            </a>
          </div>
          <div className="festival-right-content">
            <img src={selectedImage} alt={banner.title} className="festival-model-img" />
          </div>
        </div>
      </section>
    );
  }

  // Render Swiper Carousel layout if 2 or more banners exist
  return (
    <section className="festival-banner-slider-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="festival-swiper"
      >
        {banners.map((banner) => {
          const selectedImage = isMobile ? banner.mobileImage : banner.image;
          const titleWords = banner.title.split(' ');

          return (
            <SwiperSlide key={banner.id}>
              <section className="festival-banner-section">
                <div className="festival-banner-container">
                  <div className="festival-left-content">
                    <h2 className="festival-main-title">
                      {titleWords[0]}
                      <br />
                      {titleWords.slice(1).join(' ')}
                    </h2>
                  </div>
                  <div className="festival-center-content">
                    <span className="festival-discount-heading">{banner.subtitle}</span>
                    <p className="festival-subtext">{banner.description}</p>
                    <a href={banner.redirectUrl} className="festival-shop-btn-link">
                      <button className="festival-shop-btn">{banner.buttonText}</button>
                    </a>
                  </div>
                  <div className="festival-right-content">
                    <img src={selectedImage} alt={banner.title} className="festival-model-img" />
                  </div>
                </div>
              </section>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default FestivalBanner;