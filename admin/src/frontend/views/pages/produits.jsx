import React from "react";
import ProduitsContent from "../components/ProduitsContent";
import Header from "../components/headeradmin";
import Footer from "../components/footer";

function ProduitsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, padding: '20px', backgroundColor: '#f4f6f8' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <ProduitsContent />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ProduitsPage;
