import { Link } from "react-router-dom";
import { Leaf } from "lucide-react"; 
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-emerald-100 bg-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Left: Logo + Info */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-6 w-6 text-emerald-700" />
            <span className="text-lg font-bold text-emerald-700">AyurMate</span>
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            AyurMate is your digital Ayurvedic wellness companion, helping you stay balanced with remedies, lifestyle tips, and more.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div>
          <h4 className="text-emerald-700 font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#home" className="hover:text-emerald-700">Home</a></li>
            <li><a href="/#about" className="hover:text-emerald-700">About Us</a></li>
            <li><a href="/#features" className="hover:text-emerald-700">Features</a></li>
            <li><Link to="/login" className="hover:text-emerald-700">Login / Signup</Link></li>
          </ul>
        </div>

        {/* Right: Social Media */}
        <div>
          <h4 className="text-emerald-700 font-semibold mb-3">Follow Us</h4>
          <div className="flex justify-center md:justify-start gap-4 text-gray-600">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">
              <FaInstagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">
              <FaFacebookF size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="border-t border-emerald-100 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-emerald-700">AyurMate</span>. All rights reserved.  
        <br />
        {/* Built with <span className="text-emerald-700 font-medium">React</span> & Tailwind (Green Theme). */}
      </div>
    </footer>
  );
}