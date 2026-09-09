import TrendingProducts from './Components/TrendingProducts/TrendingProducts';
import FestivalBanner from './Components/FestivalBanner/FestivalBanner';
import NewArrivals from './Components/NewArrivals/NewArrivals';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId =  import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;