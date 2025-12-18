import Header from "../components/header";
import ContactPage from "../components/contactuscard";
import Footer from "../components/footer";
import "../styles/contactuspage.css";

export default function ContactUsPage() {
  return (
    <div className="contact-us-page">
      <Header></Header>
      <ContactPage></ContactPage>
      <Footer></Footer>
    </div>
  );
}
