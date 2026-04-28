import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, Menu as MenuIcon, X, Star, MapPin, Phone, Mail,
  ArrowRight, Check, Clock, Award, Users
} from 'lucide-react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Poppins', sans-serif; background-color: #fdfbf7; color: #4a3018; -webkit-font-smoothing: antialiased; }
    .script { font-family: 'Dancing Script', cursive; }
    input, textarea, button { font-family: 'Poppins', sans-serif; }
  `}} />
);

const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Small Chops",
    description: "A rich party platter featuring spring rolls, samosas, puff-puff, and peppered meats.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Appetizer"
  },
  {
    id: 2,
    name: "Drinks & Parfaits",
    description: "Fresh yoghurt parfaits, fruity zobo, creamy tigernut milk, and 100% natural fruit juices.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Refreshments"
  },
  {
    id: 3,
    name: "Spicy Pepper Soup",
    description: "Authentic Nigerian pepper soup made with your choice of assorted meat, goat meat, or catfish.",
    price: 4500,
    image: "/download.jpeg",
    tag: "Spicy"
  },
  {
    id: 4,
    name: "Pastries & Desserts",
    description: "Our signature banana breads, fluffy cakes, and a variety of freshly baked sweet treats.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Sweet"
  },
  {
    id: 5,
    name: "Smoky Jollof & Fried Rice",
    description: "Classic Nigerian party Jollof and rich Fried Rice, served with your choice of protein.",
    price: 6000,
    image: "/jollof.jpeg",
    tag: "Main"
  },
  {
    id: 6,
    name: "Salad & Coleslaw",
    description: "Crisp, creamy coleslaw and rich mixed fresh salads to perfectly complement your meals.",
    price: 2000,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tag: "Sides"
  }
];

const TESTIMONIALS = [
  { id: 1, name: "Sarah Jenkins", role: "Birthday Event", text: "The small chops and smoky jollof were the absolute highlight of our party. Table of Kings truly delivers on their promise of a royal taste!" },
  { id: 2, name: "Marcus T.", role: "Corporate Dinner", text: "Absolutely incredible service, and the pepper soup was dangerously good. Perfect spice level and super fast delivery." },
  { id: 3, name: "Emily Chen", role: "Wedding Reception", text: "From the rich parfaits to the pastries, everything was so fresh and flavorful. Table of Kings is my new go-to for all catering needs." }
];

const STATS = [
  { icon: Users, value: "500+", label: "Events Catered" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Award, value: "100%", label: "Fresh Ingredients" },
  { icon: Clock, value: "On Time", label: "Every Delivery" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderText, setOrderText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const orderEmailRef = useRef();
  const phoneRef = useRef();
  const orderFormRef = useRef();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const openOrderModal = (item = null) => {
    setOrderText(item ? `I would like to order:\n1x ${item.name}` : '');
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          email: orderEmailRef.current.value,
          phone: phoneRef.current.value,
          orderDetails: orderText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setOrderModalOpen(false);
      setOrderText('');
      orderFormRef.current.reset();
      showToast(data.message);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      showToast(data.message);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#fdfbf7' }}>
      <GlobalStyles />

      {/* ── TOAST ── */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: toast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(40px)',
        zIndex: 60, opacity: toast ? 1 : 0, transition: 'all 0.3s ease', pointerEvents: toast ? 'auto' : 'none'
      }}>
        <div style={{
          background: toast?.isError ? '#b91c1c' : '#4a3018', color: 'white',
          padding: '12px 24px', borderRadius: '999px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500
        }}>
          <Check size={16} color="#c68c53" />
          {toast?.msg}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(253,251,247,0.96)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? '0 1px 20px rgba(74,48,24,0.08)' : 'none',
        padding: isScrolled ? '14px 0' : '22px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#" style={{ textDecoration: 'none' }}>
            <div className="script" style={{ fontSize: '30px', color: '#4a3018', lineHeight: 1 }}>Table of Kings</div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c68c53', fontWeight: 600, marginTop: '3px' }}>Premium Catering</div>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="desktop-nav">
            {['#about', '#menu', '#testimonials', '#contact'].map((href, i) => (
              <a key={href} href={href} style={{ textDecoration: 'none', color: '#7a5230', fontWeight: 500, fontSize: '15px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#c68c53'} onMouseLeave={e => e.target.style.color = '#7a5230'}>
                {['About', 'Menu', 'Reviews', 'Contact'][i]}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => openOrderModal()} className="btn-primary" style={{
              background: '#c68c53', color: 'white', border: 'none', padding: '11px 24px',
              borderRadius: '999px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#b07b46'}
              onMouseLeave={e => e.currentTarget.style.background = '#c68c53'}>
              Order Now
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="mobile-menu-btn" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#4a3018', padding: '8px', display: 'none'
            }}>
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAV STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .btn-primary { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { display: none; }
          .about-grid { grid-template-columns: 1fr !important; }
          .menu-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 40px !important; }
          .hero-script { font-size: 48px !important; }
          .section-heading { font-size: 32px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .menu-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── MOBILE MENU ── */}
      <div onClick={() => setMobileMenuOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(74,48,24,0.45)', backdropFilter: 'blur(4px)',
        zIndex: 50, opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? 'auto' : 'none', transition: 'opacity 0.3s'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          position: 'absolute', top: 0, right: 0, width: '280px', height: '100%',
          background: '#fdfbf7', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4eadb' }}>
            <span className="script" style={{ fontSize: '24px', color: '#4a3018' }}>Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a3018', padding: '4px' }}>
              <X size={22} />
            </button>
          </div>
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['#about', 'About'], ['#menu', 'Menu'], ['#testimonials', 'Reviews'], ['#contact', 'Contact']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{
                textDecoration: 'none', color: '#4a3018', fontSize: '18px', fontWeight: 500,
                padding: '12px 0', borderBottom: '1px solid #f4eadb'
              }}>{label}</a>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); openOrderModal(); }} style={{
              marginTop: '24px', background: '#c68c53', color: 'white', border: 'none',
              padding: '14px', borderRadius: '14px', fontSize: '16px', fontWeight: 600, cursor: 'pointer'
            }}>Order Now</button>
          </div>
        </div>
      </div>

      {/* ── ORDER MODAL ── */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(74,48,24,0.65)', backdropFilter: 'blur(6px)',
        zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        opacity: orderModalOpen ? 1 : 0, pointerEvents: orderModalOpen ? 'auto' : 'none', transition: 'opacity 0.3s'
      }}>
        <div style={{
          background: '#fdfbf7', width: '100%', maxWidth: '520px', borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
          transform: orderModalOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.3s ease', maxHeight: '90vh', overflowY: 'auto'
        }}>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 className="script" style={{ fontSize: '32px', color: '#4a3018' }}>Place Your Order</h2>
              <button onClick={() => setOrderModalOpen(false)} style={{
                background: '#f4eadb', border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7a5230'
              }}><X size={18} /></button>
            </div>
            <form ref={orderFormRef} onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[['First Name', firstNameRef, 'text'], ['Last Name', lastNameRef, 'text']].map(([label, ref, type]) => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '6px' }}>{label}</label>
                    <input ref={ref} type={type} required style={inputStyle} />
                  </div>
                ))}
              </div>
              {[['Email Address', orderEmailRef, 'email'], ['Phone Number', phoneRef, 'tel']].map(([label, ref, type]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '6px' }}>{label}</label>
                  <input ref={ref} type={type} required style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '6px' }}>Order Details & Delivery Address</label>
                <textarea required rows="3" value={orderText} onChange={e => setOrderText(e.target.value)}
                  placeholder="E.g., 2x Classic Small Chops, deliver to..." style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button type="submit" disabled={isSubmitting} style={{
                background: isSubmitting ? '#d4c5b9' : '#c68c53', color: 'white', border: 'none',
                padding: '15px', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '4px',
                transition: 'background 0.2s'
              }}>
                {isSubmitting ? 'Sending your order…' : 'Submit Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '100px' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', background: '#f4eadb', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: 'rgba(198,140,83,0.15)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.8 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#f4eadb', color: '#c68c53', padding: '8px 18px',
                borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '28px'
              }}>
                <Star size={13} fill="currentColor" /> Exquisite Culinary Experiences
              </div>

              <h1 className="hero-title" style={{ fontSize: '58px', fontWeight: 800, color: '#4a3018', lineHeight: 1.08, marginBottom: '12px' }}>
                Expertly Crafted,
              </h1>
              <div className="script hero-script" style={{ fontSize: '64px', color: '#c68c53', lineHeight: 1.1, marginBottom: '28px' }}>
                Every Bite Feels<br />Like Royalty.
              </div>

              <p style={{ fontSize: '17px', color: '#7a5230', lineHeight: 1.8, maxWidth: '480px', marginBottom: '40px' }}>
                From classic small chops to smoky party jollof and fresh parfaits — we deliver unforgettable catering for every occasion, big or small.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button onClick={() => openOrderModal()} style={{
                  background: '#4a3018', color: 'white', border: 'none',
                  padding: '16px 36px', borderRadius: '999px', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 8px 30px rgba(74,48,24,0.3)', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(74,48,24,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(74,48,24,0.3)'; }}>
                  Order Now <ArrowRight size={18} />
                </button>
                <a href="#about" style={{
                  background: 'white', color: '#4a3018', textDecoration: 'none',
                  padding: '16px 36px', borderRadius: '999px', fontSize: '15px', fontWeight: 600,
                  border: '2px solid #f4eadb', transition: 'all 0.2s', display: 'inline-block'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4eadb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  Our Story
                </a>
              </div>

              {/* Mini trust row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f4eadb' }}>
                <div style={{ display: 'flex' }}>
                  {['#c68c53','#b07b46','#9a6a39'].map((c, i) => (
                    <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? '-10px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'white', fontWeight: 700 }}>{['S','M','E'][i]}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#c68c53" color="#c68c53" />)}
                  </div>
                  <p style={{ fontSize: '13px', color: '#7a5230', fontWeight: 500 }}>500+ happy customers</p>
                </div>
              </div>
            </div>

            {/* Right — image */}
            <div className="hero-image-col" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '32px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 30px 80px rgba(74,48,24,0.2)' }}>
                <img src="https://images.unsplash.com/photo-1605807646983-377bc5a76493?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh Banana Bread" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Floating rating card */}
              <div style={{
                position: 'absolute', bottom: '-20px', left: '-24px',
                background: 'white', borderRadius: '20px', padding: '16px 22px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{ background: '#f4eadb', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={22} fill="#c68c53" color="#c68c53" />
                </div>
                <div>
                  <p style={{ fontWeight: 800, color: '#4a3018', fontSize: '20px', lineHeight: 1 }}>4.9/5</p>
                  <p style={{ fontSize: '12px', color: '#7a5230', marginTop: '3px' }}>Happy Customers</p>
                </div>
              </div>
              {/* Floating category pill */}
              <div style={{
                position: 'absolute', top: '24px', right: '-16px',
                background: '#4a3018', color: 'white', borderRadius: '999px',
                padding: '10px 18px', fontSize: '13px', fontWeight: 600,
                boxShadow: '0 8px 24px rgba(74,48,24,0.3)'
              }}>
                🏆 #1 Catering in Lagos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <div style={{ background: '#4a3018', padding: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <div style={{ background: 'rgba(198,140,83,0.15)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={22} color="#c68c53" />
                </div>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '13px', color: 'rgba(212,197,185,0.8)', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section id="about" style={{ padding: '120px 0', background: '#fdfbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(198,140,83,0.08)', borderRadius: '40px', transform: 'rotate(-3deg) scale(1.04)' }} />
              <img src="https://images.unsplash.com/photo-1556910110-a5a63dfd393c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Baking Process" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '40px', boxShadow: '0 20px 60px rgba(74,48,24,0.12)', position: 'relative', zIndex: 1 }} />
              {/* Experience badge */}
              <div style={{
                position: 'absolute', top: '24px', right: '-16px', zIndex: 2,
                background: '#c68c53', color: 'white', borderRadius: '20px', padding: '16px 20px',
                boxShadow: '0 10px 30px rgba(198,140,83,0.4)', textAlign: 'center'
              }}>
                <p style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>5+</p>
                <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, marginTop: '4px' }}>Years of<br />Excellence</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c68c53', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Our Story
              </div>
              <h2 className="section-heading" style={{ fontSize: '44px', fontWeight: 800, color: '#4a3018', lineHeight: 1.1, marginBottom: '8px' }}>
                The Secret is in
              </h2>
              <div className="script" style={{ fontSize: '48px', color: '#c68c53', lineHeight: 1.1, marginBottom: '28px' }}>Our Passion</div>

              <p style={{ color: '#7a5230', lineHeight: 1.85, marginBottom: '20px', fontSize: '16px' }}>
                Table of Kings started with a simple goal: to provide extraordinary catering experiences. We use only the freshest ingredients to craft meals, pastries, and party chops that bring life to your celebrations.
              </p>
              <p style={{ color: '#7a5230', lineHeight: 1.85, marginBottom: '40px', fontSize: '16px' }}>
                We believe that good food brings people together. Every dish is a labor of love — meant to be shared with friends, enjoyed at grand events, or savored in quiet moments.
              </p>

              {/* Stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                {[['500+', 'Events Catered'], ['4.9★', 'Customer Rating'], ['100%', 'Fresh Ingredients'], ['On Time', 'Every Delivery']].map(([val, label]) => (
                  <div key={label} style={{ background: '#f4eadb', borderRadius: '16px', padding: '20px 22px' }}>
                    <p style={{ fontSize: '22px', fontWeight: 800, color: '#4a3018', lineHeight: 1 }}>{val}</p>
                    <p style={{ fontSize: '13px', color: '#7a5230', marginTop: '6px', fontWeight: 500 }}>{label}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => openOrderModal()} style={{
                background: '#4a3018', color: 'white', border: 'none',
                padding: '15px 34px', borderRadius: '999px', fontSize: '15px',
                fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#322010'}
                onMouseLeave={e => e.currentTarget.style.background = '#4a3018'}>
                Order Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MENU
      ══════════════════════════════════════════ */}
      <section id="menu" style={{ padding: '120px 0', background: '#f9f4ed' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="script" style={{ fontSize: '40px', color: '#c68c53', lineHeight: 1.2, marginBottom: '8px' }}>Our Offerings</div>
            <h2 className="section-heading" style={{ fontSize: '44px', fontWeight: 800, color: '#4a3018', lineHeight: 1.1, marginBottom: '16px' }}>A Feast Fit for Kings</h2>
            <p style={{ color: '#7a5230', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Handcrafted with love and the finest fresh ingredients for every occasion.
            </p>
          </div>

          {/* Grid */}
          <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {MENU_ITEMS.map((item) => (
              <div key={item.id} style={{
                background: 'white', borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 2px 20px rgba(74,48,24,0.06)', border: '1px solid rgba(244,234,219,0.8)',
                display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(74,48,24,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(74,48,24,0.06)'; }}>

                {/* Image */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                    padding: '5px 14px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 700, color: '#c68c53', letterSpacing: '1px', textTransform: 'uppercase'
                  }}>{item.tag}</div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#4a3018', lineHeight: 1.3 }}>{item.name}</h3>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#c68c53', whiteSpace: 'nowrap' }}>₦{item.price.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#7a5230', lineHeight: 1.65, flex: 1, marginBottom: '20px' }}>{item.description}</p>
                  <button onClick={() => openOrderModal(item)} style={{
                    width: '100%', background: '#f9f4ed', color: '#4a3018',
                    border: '2px solid #f4eadb', borderRadius: '14px',
                    padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#c68c53'; e.currentTarget.style.borderColor = '#c68c53'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f9f4ed'; e.currentTarget.style.borderColor = '#f4eadb'; e.currentTarget.style.color = '#4a3018'; }}>
                    <ShoppingBag size={16} /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding: '120px 0', background: '#4a3018' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="script" style={{ fontSize: '40px', color: '#c68c53', lineHeight: 1.2, marginBottom: '8px' }}>Sweet Words</div>
            <h2 className="section-heading" style={{ fontSize: '44px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>What Our Customers Say</h2>
          </div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((review) => (
              <div key={review.id} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '20px'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#c68c53" color="#c68c53" />)}
                </div>
                <p style={{ fontSize: '16px', color: 'rgba(253,251,247,0.9)', lineHeight: 1.8, fontWeight: 300, flex: 1 }}>
                  "{review.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', background: '#c68c53',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, color: 'white', flexShrink: 0
                  }} className="script">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{review.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(212,197,185,0.7)', marginTop: '2px' }}>{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section id="contact" style={{ padding: '120px 0', background: '#fdfbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="script" style={{ fontSize: '40px', color: '#c68c53', lineHeight: 1.2, marginBottom: '8px' }}>Get In Touch</div>
            <h2 className="section-heading" style={{ fontSize: '44px', fontWeight: 800, color: '#4a3018', lineHeight: 1.1 }}>We'd Love to Hear From You</h2>
          </div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

            {/* Info side */}
            <div style={{ background: '#4a3018', borderRadius: '28px', padding: '48px 40px', height: '100%' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Contact Information</h3>
              <p style={{ color: 'rgba(212,197,185,0.8)', marginBottom: '40px', lineHeight: 1.7, fontSize: '15px' }}>
                Drop by for a warm slice, or reach out for large orders and special requests.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
                {[
                  { Icon: MapPin, title: 'Location', detail: '17 Alli Street Olowora Berger Lagos' },
                  { Icon: Phone, title: 'Phone', detail: '09075094434' },
                  { Icon: Mail, title: 'Email', detail: 'tableofkings.tok@gmail.com' },
                ].map(({ Icon, title, detail }) => (
                  <div key={title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(198,140,83,0.15)', borderRadius: '12px', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="#c68c53" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'white', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
                      <p style={{ color: 'rgba(212,197,185,0.8)', fontSize: '14px', lineHeight: 1.5 }}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div>
                <p style={{ color: 'rgba(212,197,185,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Follow Us</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { href: 'https://www.instagram.com/tok_foodsandtreats?igsh=YmNwdXg1ajYweGd1', label: 'Instagram', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
                    { href: 'https://www.tiktok.com/@tok_tableofkings?_r=1&_t=ZS-95vFTtxqglE', label: 'TikTok', svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.19 8.19 0 0 0 4.79 1.53V6.79a4.85 4.85 0 0 1-1.02-.1z"/></svg> },
                    { href: 'https://x.com/Christiannannn', label: 'X', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  ].map(({ href, label, svg }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
                      width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      transition: 'background 0.2s', textDecoration: 'none'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#c68c53'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                      {svg}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form side */}
            <div style={{ background: 'white', borderRadius: '28px', padding: '48px 40px', boxShadow: '0 4px 30px rgba(74,48,24,0.06)', border: '1px solid #f4eadb' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#4a3018', marginBottom: '28px' }}>Send a Message</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} onSubmit={handleContactSubmit}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '7px' }}>Your Name</label>
                  <input type="text" placeholder="John Doe" required value={contactName} onChange={e => setContactName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '7px' }}>Email Address</label>
                  <input type="email" placeholder="john@example.com" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#7a5230', marginBottom: '7px' }}>Message</label>
                  <textarea placeholder="How can we help you?" rows="5" required value={contactMessage} onChange={e => setContactMessage(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <button type="submit" disabled={contactSubmitting} style={{
                  background: contactSubmitting ? '#d4c5b9' : '#4a3018', color: 'white', border: 'none',
                  padding: '16px', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
                  cursor: contactSubmitting ? 'not-allowed' : 'pointer', marginTop: '4px', transition: 'background 0.2s'
                }}
                  onMouseEnter={e => { if (!contactSubmitting) e.currentTarget.style.background = '#322010'; }}
                  onMouseLeave={e => { if (!contactSubmitting) e.currentTarget.style.background = '#4a3018'; }}>
                  {contactSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: '#2a1a0c', color: '#d4c5b9', padding: '80px 0 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px', paddingBottom: '56px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Brand */}
            <div>
              <div className="script" style={{ fontSize: '36px', color: 'white', marginBottom: '16px', lineHeight: 1 }}>Table of Kings</div>
              <p style={{ fontSize: '14px', lineHeight: 1.8, maxWidth: '300px', marginBottom: '28px', color: 'rgba(212,197,185,0.8)' }}>
                Serving unforgettable meals and party platters, one royal experience at a time.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { href: 'https://www.instagram.com/tok_foodsandtreats?igsh=YmNwdXg1ajYweGd1', label: 'Instagram', svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
                  { href: 'https://www.tiktok.com/@tok_tableofkings?_r=1&_t=ZS-95vFTtxqglE', label: 'TikTok', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.19 8.19 0 0 0 4.79 1.53V6.79a4.85 4.85 0 0 1-1.02-.1z"/></svg> },
                  { href: 'https://x.com/Christiannannn', label: 'X', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                ].map(({ href, label, svg }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', transition: 'background 0.2s', textDecoration: 'none'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c68c53'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '24px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[['#about','Our Story'],['#menu','Menu & Pricing'],['#testimonials','Reviews'],['#contact','Contact Us']].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} style={{ color: 'rgba(212,197,185,0.8)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#c68c53'} onMouseLeave={e => e.target.style.color = 'rgba(212,197,185,0.8)'}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '24px' }}>Hours</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[['Mon – Fri', '8am – 8pm'], ['Saturday', '9am – 7pm'], ['Sunday', '10am – 5pm']].map(([day, time]) => (
                  <div key={day}>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{day}</p>
                    <p style={{ color: 'rgba(212,197,185,0.7)', fontSize: '13px' }}>{time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>Newsletter</h4>
              <p style={{ fontSize: '13px', color: 'rgba(212,197,185,0.7)', lineHeight: 1.7, marginBottom: '16px' }}>
                Subscribe for special offers and catering updates.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                onSubmit={e => { e.preventDefault(); showToast('Subscribed!'); e.target.reset(); }}>
                <input type="email" placeholder="Your email address" required style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px',
                  outline: 'none', width: '100%'
                }} onFocus={e => e.target.style.borderColor = '#c68c53'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                <button type="submit" style={{
                  background: '#c68c53', color: 'white', border: 'none',
                  padding: '12px', borderRadius: '12px', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#b07b46'}
                  onMouseLeave={e => e.currentTarget.style.background = '#c68c53'}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '13px', opacity: 0.5 }}>&copy; {new Date().getFullYear()} Table of Kings. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service'].map(label => (
                <a key={label} href="#" style={{ fontSize: '13px', color: 'rgba(212,197,185,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(212,197,185,0.5)'}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: '#fdfbf7', border: '1.5px solid #f0e4d4',
  borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#4a3018',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'Poppins, sans-serif',
  display: 'block'
};
