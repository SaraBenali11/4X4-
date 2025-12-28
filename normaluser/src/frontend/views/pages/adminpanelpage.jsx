import Footer from "../components/footer";
import Header from "../components/header";
// import AdminPanel from '../components/AdminPanel';
/**
 * Admin panel page - redirects to admin folder
 * Note: Admin panel is in separate admin folder
 */
function Adminpanelpage() {
  return (
    <div className="homepage">
      <Header />
      <main>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>Admin Panel</h1>
          <p>Please use the admin application for administrative functions.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Adminpanelpage;
