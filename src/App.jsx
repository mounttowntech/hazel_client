import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Shop from './Pages/Shop/Shop';
import ShopByCategory from './Components/ShopByCategory/ShopByCategory';
import TrendingProducts from './Components/TrendingProducts/TrendingProducts';
import FestivalBanner from './Components/FestivalBanner/FestivalBanner';
import NewArrivals from './Components/NewArrivals/NewArrivals';
<<<<<<< HEAD
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
=======
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId =  import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  // return (
  //   <Router>
  //     <Navbar />
     
  //     <Routes>
  //       <Route path="/" element={<Hero />} />
  //       <Route path="/shop" element={<Shop />} />
  //     </Routes>
  //      <ShopByCategory/>
  //      <TrendingProducts/>
  //      <FestivalBanner/>
  //      <NewArrivals/>
  //   </Router>
    
  // );

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppRoutes />
    </GoogleOAuthProvider>
>>>>>>> 908b454f0893d83c677a78c5d91aba360bce49fb
  );
}

export default App;