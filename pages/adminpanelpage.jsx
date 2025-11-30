import Footer from '../components/footer';
import Header from '../components/header';
import AdminPanel from '../components/AdminPanel';
/**
 * Homepage component
 * Main landing page with carousel, new products, and reviews
 */
function Adminpanelpage() {
  return (
    <div className="homepage">
      <Header />
      <main>
        <AdminPanel />
      </main>
      <Footer />
    </div>
  );
}

export default Adminpanelpage;
