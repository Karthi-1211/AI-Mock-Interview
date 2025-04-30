
import React from "react";
import MainNavbar from "./MainNavbar";
import MainFooter from "./MainFooter";

interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const MainLayout = ({ children, showNav = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && <MainNavbar />}
      <main className={`flex-1 ${showNav ? 'pt-16' : ''}`}>{children}</main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
