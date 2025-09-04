
import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";

const MainFooter: React.FC = () => {
  return (
    <footer className="w-full mt-auto z-10 relative overflow-hidden">
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-amber-50" />
      {/* Top gradient border */}
      <div className="relative h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500" />
      <div className="relative max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Logo className="h-8 w-auto mb-4" />
          <p className="text-sm text-slate-600">
            Professional mock interviews powered by AI to help you succeed in your career.
          </p>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-fuchsia-700">Product</h3>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Pricing</Link></li>
            <li><Link to="/testimonials" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Testimonials</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-700 to-amber-700">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Blog</Link></li>
            <li><Link to="/guides" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Guides</Link></li>
            <li><Link to="/faq" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-indigo-700">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">About</Link></li>
            <li><Link to="/careers" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Contact</Link></li>
            <li><Link to="/feedback" className="text-sm text-slate-600 hover:text-interview-primary transition-colors">Feedback</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 pb-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-4" />
        <p className="text-sm text-center text-slate-600">
          © {new Date().getFullYear()} VirtuHire. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default MainFooter;
