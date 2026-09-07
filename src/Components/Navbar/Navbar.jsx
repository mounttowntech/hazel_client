import{ useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, X } from "lucide-react";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left-group">
        <button 
          className={`hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className="nav-logo-container">
          <Link to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="Hazel Logo" className="nav-logo-img" />
          </Link>
        </div>
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <li>
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/new-arrivals"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            New Arrivals
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Contact Us
          </NavLink>
        </li>
      </ul>

      <div className="nav-right-section">
        <div className="search-container">
        <Search className="nav-icon" title="Search"/>
         <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>

        <Heart className="nav-icon" title="Wishlist" />

        <Link to="/cart">
          <ShoppingBag className="nav-icon" title="Cart" />
        </Link>

        <User className="nav-icon" title="Account" />
      </div>
    </nav>
  );
};

export default Navbar;