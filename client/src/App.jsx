import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, Menu as MenuIcon, X, Star, MapPin, Phone, Mail,
  ArrowRight, Check
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ?? '';

// --- STYLES & FONTS ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
    html { scroll-behavior: smooth; }
    body { font-family: 'Poppins', sans-serif; background-color: #fdfbf7; color: #4a3018; }
    .font-script { font-family: 'Dancing Script', cursive; }
  `}} />
);

// --- DATA ---
const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Small Chops",
    description: "A rich party platter featuring spring rolls, samosas, puff-puff, and peppered meats.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Appetizer"]
  },
  {
    id: 2,
    name: "Drinks & Parfaits",
    description: "Fresh yoghurt parfaits, fruity zobo, creamy tigernut milk, and 100% natural fruit juices.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Refreshments"]
  },
  {
    id: 3,
    name: "Spicy Pepper Soup",
    description: "Authentic Nigerian pepper soup made with your choice of assorted meat, goat meat, or catfish.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Spicy"]
  },
  {
    id: 4,
    name: "Pastries & Desserts",
    description: "Our signature banana breads, fluffy cakes, and a variety of freshly baked sweet treats.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Sweet"]
  },
  {
    id: 5,
    name: "Smoky Jollof & Fried Rice",
    description: "Classic Nigerian party Jollof and rich Fried Rice, served with your choice of protein.",
    price: 6000,
    image: "https://images.unsplash.com/photo-1645696301019-35adcc18cdb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Main"]
  },
  {
    id: 6,
    name: "Salad & Coleslaw",
    description: "Crisp, creamy coleslaw and rich mixed fresh salads to perfectly complement your meals.",
    price: 2000,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    tags: ["Sides"]
  }
];

const TESTIMONIALS = [
  { id: 1, name: "Sarah Jenkins", text: "The small chops and smoky jollof were the absolute highlight of our party. Table of Kings truly delivers on their promise of a royal taste!" },
  { id: 2, name: "Marcus T.", text: "Absolutely incredible service, and the pepper soup was dangerously good. Perfect spice level and super fast delivery." },
  { id: 3, name: "Emily Chen", text: "From the rich parfaits to the pastries, everything was so fresh and flavorful. Table of Kings is my new go-to for all catering needs." }
];

// --- MAIN APP ---
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderText, setOrderText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Order form refs
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const orderEmailRef = useRef();
  const phoneRef = useRef();
  const orderFormRef = useRef();

  // Contact form state
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
    <div className="min-h-screen relative overflow-x-hidden">
      <GlobalStyles />

      {/* TOAST */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className={`${toast?.isError ? 'bg-red-700' : 'bg-[#4a3018]'} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2`}>
          <Check size={18} className="text-[#c68c53]" />
          <span className="text-sm font-medium">{toast?.msg}</span>
        </div>
      </div>

      {/* NAV */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <a href="#" className="flex flex-col">
            <span className="font-script text-3xl md:text-4xl text-[#4a3018] leading-none">Table of Kings</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c68c53] font-semibold mt-1">Premium Catering</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-[#7a5230] font-medium">
            <a href="#about" className="hover:text-[#c68c53] transition-colors">About</a>
            <a href="#menu" className="hover:text-[#c68c53] transition-colors">Menu</a>
            <a href="#testimonials" className="hover:text-[#c68c53] transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-[#c68c53] transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => openOrderModal()} className="hidden md:flex items-center gap-2 bg-[#c68c53] hover:bg-[#b07b46] text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
              Order Now
            </button>
            <button className="md:hidden text-[#4a3018] p-2" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-[#4a3018]/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-64 h-full bg-[#fdfbf7] shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-5 flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#4a3018]"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-6 p-8 text-xl text-[#4a3018]">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <button onClick={() => { setMobileMenuOpen(false); openOrderModal(); }} className="mt-4 bg-[#c68c53] hover:bg-[#b07b46] transition-colors text-white py-3 rounded-xl font-medium">Order Now</button>
          </div>
        </div>
      </div>

      {/* ORDER MODAL */}
      <div className={`fixed inset-0 bg-[#4a3018]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${orderModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-[#fdfbf7] w-full max-w-lg rounded-[2rem] shadow-2xl transform transition-all duration-300 ${orderModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-script text-[#4a3018]">Place Your Order</h2>
              <button onClick={() => setOrderModalOpen(false)} className="p-2 text-[#7a5230] hover:bg-[#f4eadb] rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form ref={orderFormRef} onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7a5230] mb-1">First Name</label>
                  <input ref={firstNameRef} type="text" required className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-2.5 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7a5230] mb-1">Last Name</label>
                  <input ref={lastNameRef} type="text" required className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-2.5 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7a5230] mb-1">Email Address</label>
                <input ref={orderEmailRef} type="email" required className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-2.5 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7a5230] mb-1">Phone Number</label>
                <input ref={phoneRef} type="tel" required className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-2.5 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#7a5230] mb-1">Order Details & Delivery Address</label>
                <textarea
                  required rows="3"
                  value={orderText}
                  onChange={(e) => setOrderText(e.target.value)}
                  placeholder="E.g., 2x Classic Small Chops to be delivered at..."
                  className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-2.5 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c68c53] hover:bg-[#b07b46] disabled:bg-[#d4c5b9] text-white py-3.5 rounded-xl font-medium transition-all shadow-md mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Sending...' : 'Submit Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-8 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f4eadb] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c68c53]/20 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3 z-0"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#f4eadb] text-[#c68c53] font-medium text-sm mb-6 uppercase tracking-wider">
              Exquisite Culinary Experiences
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[#4a3018] leading-[1.1] mb-6">
              Expertly Crafted,<br />
              <span className="font-script text-6xl md:text-8xl text-[#c68c53] font-normal block mt-2">Every Bite Feels Like Royalty.</span>
            </h1>
            <p className="text-[#7a5230] text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
              Indulge in a royal feast. From classic small chops to smoky party jollof and fresh parfaits, we deliver unforgettable catering for every occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => openOrderModal()} className="bg-[#4a3018] hover:bg-[#322010] text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Order Now <ArrowRight size={18} />
              </button>
              <a href="#about" className="bg-white hover:bg-[#f4eadb] text-[#4a3018] px-8 py-4 rounded-full font-medium transition-all shadow-sm hover:shadow-md border border-[#f4eadb] text-center">
                Our Story
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1605807646983-377bc5a76493?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Fresh Banana Bread"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-white p-4 md:p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4">
              <div className="bg-[#f4eadb] p-3 rounded-full text-[#c68c53]"><Star size={24} fill="currentColor" /></div>
              <div>
                <p className="font-bold text-[#4a3018] text-lg md:text-xl">4.9/5</p>
                <p className="text-sm text-[#7a5230]">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-32 bg-[#f4eadb]/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-[#c68c53]/10 rounded-[3rem] transform -rotate-3 scale-105 z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1556910110-a5a63dfd393c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Baking Process"
              className="relative z-10 rounded-[3rem] w-full h-full object-cover shadow-lg aspect-[4/3]"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-[#4a3018] mb-4">
              The Secret is in<br />
              <span className="font-script text-[#c68c53] text-5xl md:text-6xl font-normal">Our Passion</span>
            </h2>
            <p className="text-[#7a5230] mb-6 leading-relaxed">
              Table of Kings started with a simple goal: to provide extraordinary catering experiences. We use only the freshest ingredients to craft meals, pastries, and party chops that bring life to your celebrations and comfort to your home.
            </p>
            <p className="text-[#7a5230] mb-8 leading-relaxed">
              We believe that good food brings people together. Every dish we create is a labor of love, meant to be shared with friends, enjoyed at grand events, or savored in quiet moments.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#4a3018] text-xl mb-1">100%</h4>
                <p className="text-sm text-[#7a5230]">Quality Ingredients</p>
              </div>
              <div>
                <h4 className="font-bold text-[#4a3018] text-xl mb-1">Always</h4>
                <p className="text-sm text-[#7a5230]">Freshly Prepared</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-script text-[#c68c53] text-4xl mb-2">Our Offerings</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[#4a3018]">A Feast Fit for Kings</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f4eadb]/50 flex flex-col h-full">
              <div className="relative aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#c68c53] uppercase tracking-wider">
                  {item.tags[0]}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#4a3018] text-lg leading-tight pr-4">{item.name}</h4>
                  <span className="font-semibold text-[#c68c53] whitespace-nowrap">₦{item.price.toLocaleString()}</span>
                </div>
                <p className="text-[#7a5230] text-sm mb-6 flex-1">{item.description}</p>
                <button
                  onClick={() => openOrderModal(item)}
                  className="w-full bg-[#fdfbf7] border-2 border-[#f4eadb] hover:bg-[#c68c53] hover:border-[#c68c53] text-[#4a3018] hover:text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingBag size={18} className="transition-transform group-hover/btn:scale-110" />
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-32 bg-[#4a3018] text-[#fdfbf7]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-script text-[#c68c53] text-4xl mb-2">Sweet Words</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-16">Customer Love</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => (
              <div key={review.id} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-left">
                <div className="flex gap-1 text-[#c68c53] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg mb-8 leading-relaxed font-light">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c68c53] flex items-center justify-center text-white font-bold font-script text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-medium">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-[#f4eadb] grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a3018] mb-6">Contact Us</h2>
            <p className="text-[#7a5230] mb-8">Drop by for a warm slice, or contact us for large orders and special requests. We'd love to hear from you!</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#f4eadb] p-3 rounded-full text-[#c68c53]"><MapPin size={24} /></div>
                <div>
                  <h4 className="font-bold text-[#4a3018]">Location</h4>
                  <p className="text-[#7a5230]">17 Alli Street Olowora Berger Lagos</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#f4eadb] p-3 rounded-full text-[#c68c53]"><Phone size={24} /></div>
                <div>
                  <h4 className="font-bold text-[#4a3018]">Phone</h4>
                  <p className="text-[#7a5230]">09075094434</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#f4eadb] p-3 rounded-full text-[#c68c53]"><Mail size={24} /></div>
                <div>
                  <h4 className="font-bold text-[#4a3018]">Email</h4>
                  <p className="text-[#7a5230]">tableofkings.tok@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#f4eadb]/50">
            <h3 className="text-2xl font-bold text-[#4a3018] mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <input
                type="text" placeholder="Your Name" required
                value={contactName} onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-3 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53] transition-colors"
              />
              <input
                type="email" placeholder="Your Email" required
                value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-3 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53] transition-colors"
              />
              <textarea
                placeholder="How can we help you?" rows="4" required
                value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-white border border-[#f4eadb] rounded-xl px-4 py-3 text-[#4a3018] focus:outline-none focus:border-[#c68c53] focus:ring-1 focus:ring-[#c68c53] transition-colors resize-none"
              />
              <button
                type="submit" disabled={contactSubmitting}
                className="w-full bg-[#4a3018] hover:bg-[#322010] disabled:bg-[#d4c5b9] text-white py-3.5 rounded-xl font-medium transition-colors shadow-md"
              >
                {contactSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2a1a0c] text-[#d4c5b9] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="flex flex-col mb-6">
              <span className="font-script text-4xl text-white leading-none">Table of Kings</span>
            </a>
            <p className="max-w-sm mb-6">Serving the world better, one unforgettable meal and party platter at a time.</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/tok_foodsandtreats?igsh=YmNwdXg1ajYweGd1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c68c53] flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.tiktok.com/@tok_tableofkings?_r=1&_t=ZS-95vFTtxqglE" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c68c53] flex items-center justify-center transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.19 8.19 0 0 0 4.79 1.53V6.79a4.85 4.85 0 0 1-1.02-.1z"/></svg>
              </a>
              <a href="https://x.com/Christiannannn" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c68c53] flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="hover:text-[#c68c53] transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-[#c68c53] transition-colors">Menu & Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-[#c68c53] transition-colors">Customer Reviews</a></li>
              <li><a href="#contact" className="hover:text-[#c68c53] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe for special offers and catering updates.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to newsletter!'); e.target.reset(); }}>
              <input type="email" placeholder="Email address" required className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#c68c53] text-white" />
              <button type="submit" className="bg-[#c68c53] hover:bg-[#b07b46] text-white px-4 py-2 rounded-lg transition-colors">Join</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Table of Kings. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
