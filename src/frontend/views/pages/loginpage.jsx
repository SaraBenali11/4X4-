import Footer from "../components/footer";
import Header from "../components/header";
import AdminLogin from "../adminview/components/AdminLogin";
/**
 * Homepage component
 * Main landing page with carousel, new products, and reviews
 */
function LoginPage() {
  return (
    <div className="homepage">
      <Header />
      <main>
        <AdminLogin />
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
