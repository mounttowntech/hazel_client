import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../pages/admin/auth/Login";
import VerifyOTP from "../pages/admin/auth/VerifyOTP";

import AdminLayout from "../components/admin/Layout/AdminLayout";

import Dashboard from "../pages/admin/dashboard/Dashboard";
import CategoryList from "../pages/admin/catalog/categories/CategoryList";
import SubCategoryList from "../pages/admin/catalog/subCategory/SubCategoryList";
import BrandList from "../pages/admin/catalog/brands/BrandList";
import LengthList from "../pages/admin/catalog/product-length/LengthList";
// import NeckPatternList from "../pages/admin/catalog/neck-patterns/NeckPatternList";
import ProductList from "../pages/admin/catalog/products/ProductList";
import ProductVariantList from "../pages/admin/catalog/productVariant/ProductVariant";
import SizeList from "../pages/admin/catalog/size/SizeList";
import ColorList from "../pages/admin/catalog/color/Colorlist"
import Shop from "../pages/Shop/Shop";

import UserLayout from "../layouts/UserLayout";
import Home from "../Pages/Home";

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      {/* USER LAYOUT ROUTES */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
      </Route>
      {/* =================================
          AUTH ROUTES
      ================================= */}
      
      <Route path="/admin/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* =================================
          ADMIN ROUTES
      ================================= */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/catalog/categories" element={<CategoryList />} />
        <Route path="/admin/catalog/subcategories" element={<SubCategoryList />} />
        <Route path="/admin/catalog/brands" element={<BrandList />} />
        <Route path="/admin/catalog/product-length" element={<LengthList />} />
        {/* <Route path="/admin/catalog/neck-patterns" element={<NeckPatternList />} /> */}
        <Route path="/admin/catalog/products" element={<ProductList />} />
        <Route path="/admin/catalog/product-variants" element={<ProductVariantList />} />
        <Route path="/admin/catalog/size" element={<SizeList />} />
        <Route path="/admin/catalog/colors" element={<ColorList />} />
        {/* add more admin routes here, all under this same AdminLayout wrapper */}
      </Route>

      {/* =================================
          DEFAULT ROUTE
      ================================= */}
      {/* 
      <Route path="*" element={<Navigate to="/login" replace />} />
      */}
    </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;