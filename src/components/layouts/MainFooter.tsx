
import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";

const MainFooter: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-slate-50 border-t mt-auto z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Logo className="h-8 w-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Professional mock interviews powered by AI to help you succeed in your career.
          </p>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3">Product</h3>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-sm text-muted-foreground hover:text-interview-primary">Features</Link></li>
            <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-interview-primary">Pricing</Link></li>
            <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-interview-primary">Testimonials</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-interview-primary">Blog</Link></li>
            <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-interview-primary">Guides</Link></li>
            <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-interview-primary">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-sm text-muted-foreground hover:text-interview-primary">About</Link></li>
            <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-interview-primary">Careers</Link></li>
            <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-interview-primary">Contact</Link></li>
            <li><Link to="/feedback" className="text-sm text-muted-foreground hover:text-interview-primary">Feedback</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t">
        <p className="text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} AI Mock Interview. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default MainFooter;
