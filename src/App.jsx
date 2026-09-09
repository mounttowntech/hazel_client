import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Shop from './Pages/Shop/Shop';
import ShopByCategory from './Components/ShopByCategory/ShopByCategory';
import TrendingProducts from './Components/TrendingProducts/TrendingProducts';
import FestivalBanner from './Components/FestivalBanner/FestivalBanner';
import NewArrivals from './Components/NewArrivals/NewArrivals';
import DailyUsageBanner from './Components/DailyUsageBanner/DailyUsageBanner';

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>

        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <ShopByCategory />
              <TrendingProducts />
              <FestivalBanner />
              <NewArrivals />
              <DailyUsageBanner />
            </>
          } 
        />

        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;