
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-[600px] w-[400px] bg-ext-dark text-ext-text flex flex-col">
      {/* Header */}
      <header className="glass-panel border-b border-white/10 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-ext-accent flex items-center justify-center animate-pulse-light">
              <span className="text-ext-dark font-bold">A</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Learnbeat<span className="text-ext-accent">AI</span>
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Footer navigation */}
      <footer className="glass-panel border-t border-white/10 p-2">
        <nav className="flex justify-between items-center px-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              location.pathname === '/' 
                ? 'bg-ext-medium text-ext-accent' 
                : 'hover:bg-ext-medium/50 text-ext-text-light'
            }`}
          >
            AI Assistent
          </Link>
          <Link 
            to="/social" 
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              location.pathname === '/social' 
                ? 'bg-ext-medium text-ext-accent' 
                : 'hover:bg-ext-medium/50 text-ext-text-light'
            }`}
          >
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
