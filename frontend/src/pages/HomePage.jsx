import { Link } from 'react-router-dom';
import heroBanner from '../assets/hero-banner.jpg';
import clothesHangerIcon from '../assets/clothes-hanger-svgrepo-com.svg';
import pricetagIcon from '../assets/pricetag.svg';
import deliveryIcon from '../assets/delivery.svg';
import serviceIcon from '../assets/service.svg';
import ctaImage from '../assets/cta.jpg';
import koleksiPria from '../assets/koleksipria.jpeg';
import koleksiWanita from '../assets/koleksiwanita.webp';
import koleksiTerbaru from '../assets/koleksiterbaru.jpg';
import kemejaImage from '../assets/kemeja.jpg';
import celanaImage from '../assets/celana.jpg';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-banner-image">
          <img src={heroBanner} alt="Fashion Store Hero Banner" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Temukan Gaya Anda</h1>
          <p className="hero-subtitle">Koleksi fashion terpilih dengan kualitas terbaik untuk setiap kesempatan</p>
          <Link to="/products" className="hero-button">
            Jelajahi Produk
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <img src={clothesHangerIcon} alt="Produk Berkualitas" />
            </div>
            <h3>Produk Berkualitas</h3>
            <p>Semua produk dipilih dengan standar kualitas tertinggi</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={pricetagIcon} alt="Harga Terjangkau" />
            </div>
            <h3>Harga Terjangkau</h3>
            <p>Dapatkan produk fashion terbaik dengan harga kompetitif</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={deliveryIcon} alt="Pengiriman Cepat" />
            </div>
            <h3>Pengiriman Cepat</h3>
            <p>Pengiriman ke seluruh Indonesia dengan cepat dan aman</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={serviceIcon} alt="Layanan Terbaik" />
            </div>
            <h3>Layanan Terbaik</h3>
            <p>Tim customer service siap membantu Anda 24/7</p>
          </div>
        </div>
      </section>

      <section className="promo-categories-section">
        <div className="promo-categories-container">
          <h2>Koleksi & Promosi Terbaru</h2>
          
          <div className="promo-grid">
            <div className="promo-banner promo-half">
              <div className="promo-content">
                <span className="promo-badge">50% OFF</span>
                <h3>Koleksi Pria</h3>
                <p>Dapatkan diskon hingga 50%</p>
                <Link to="/products" className="promo-button">Belanja</Link>
              </div>
              <div className="promo-background" style={{backgroundImage: `url(${koleksiPria})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>

            <div className="promo-banner promo-half">
              <div className="promo-content">
                <span className="promo-badge">30% OFF</span>
                <h3>Koleksi Wanita</h3>
                <p>Fashion terkini modern</p>
                <Link to="/products" className="promo-button">Belanja</Link>
              </div>
              <div className="promo-background" style={{backgroundImage: `url(${koleksiWanita})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>

            <div className="promo-banner promo-full">
              <div className="promo-content">
                <span className="promo-badge new-badge">TERBARU</span>
                <h3>Koleksi Terbaru</h3>
                <p>Stok terbatas, jangan lewatkan!</p>
                <Link to="/products" className="promo-button">Belanja Sekarang</Link>
              </div>
              <div className="promo-background" style={{backgroundImage: `url(${koleksiTerbaru})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>

            <div className="promo-banner promo-quarter">
              <div className="promo-content">
                <h3>Kemeja</h3>
                <p>20% OFF</p>
              </div>
              <div className="promo-background" style={{backgroundImage: `url(${kemejaImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>

            <div className="promo-banner promo-quarter">
              <div className="promo-content">
                <h3>Celana</h3>
                <p>Koleksi lengkap</p>
              </div>
              <div className="promo-background" style={{backgroundImage: `url(${celanaImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-background-image">
          <img src={ctaImage} alt="Call To Action" />
        </div>
        <div className="cta-container">
          <h2>Siap Berbelanja?</h2>
          <p>Temukan koleksi fashion terbaru kami sekarang juga</p>
          <Link to="/products" className="cta-button">
            Lihat Semua Produk
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
