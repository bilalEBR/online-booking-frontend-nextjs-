"use client";
import Link from "next/link";
import { 
  Hotel, Mail, Phone, MapPin, Send, 
  Globe,  
  MessageCircle, 
  Share2, 
  UserPlus 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-2xl">
              <Hotel size={32} />
              <span className="text-white tracking-tight">Grand Semen</span>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed">
              Experience world-class luxury and comfort. Our curated rooms and premium services ensure your stay is nothing short of extraordinary.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors"><Globe size={18}/></button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors"><MessageCircle size={18}/></button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors"><Share2 size={18}/></button>
              <button className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors"><UserPlus size={18}/></button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2 inline-block">Explore</h3>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Find a Room</Link></li>
              <li><Link href="/my-bookings" className="hover:text-blue-400 transition-colors">My Reservations</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Hotel Services</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 shrink-0" />
                <span>123 Luxury Avenue, Ocean View,<br />Florida, FL 33101</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400 shrink-0" />
                <span>+1 (555) 000-RESV</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <span>stay@grandreserve.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-800 pb-2 inline-block">Stay Updated</h3>
            <p className="text-sm text-blue-100/60 mb-4">Subscribe to get the latest offers and news.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-blue-900/40 border border-blue-800 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-blue-100/40 uppercase tracking-widest">
          <p>© 2024 GrandReserve Hotel Group. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}