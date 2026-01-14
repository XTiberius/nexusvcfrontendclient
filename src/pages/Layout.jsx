
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { User as Auth } from '@/api/localApi';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Hexagon,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await Auth.isAuthenticated();
      setIsAuthenticated(authed);
      if (authed) {
        const userData = await Auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicPages = ['Home', 'Portfolio', 'RequestAccess'];
  const isPublicPage = publicPages.includes(currentPageName);

  const navLinks = [
    { name: 'Portfolio', page: 'Portfolio' },
    { name: 'Deal Flow', page: 'Deals' },
    { name: 'About', page: 'About' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <style>{`
        :root {
          --accent: #00ff88;
          --accent-dim: #00cc6a;
          --bg-primary: #0a0a0b;
          --bg-secondary: #111113;
          --bg-tertiary: #18181b;
          --border: #27272a;
          --text-primary: #fafafa;
          --text-secondary: #a1a1aa;
          --text-muted: #71717a;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.1); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.2); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-card {
          background: rgba(17, 17, 19, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(39, 39, 42, 0.5);
        }
        
        .accent-glow {
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.15);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #27272a #0a0a0b;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-card py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
            <div className="relative">
              <Hexagon className="w-10 h-10 text-[#00ff88] transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#00ff88]">VC</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold tracking-tight">Nexus Ventures</span>
              <span className="block text-[10px] text-zinc-500 tracking-widest">// NEURAL_INVESTMENT_NETWORK</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`text-sm tracking-wide transition-colors hover:text-[#00ff88] ${
                  currentPageName === link.page ? 'text-[#00ff88]' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <User className="w-4 h-4 mr-2" />
                    {user?.full_name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Dashboard')} className="flex items-center cursor-pointer text-zinc-300 hover:text-white">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Profile')} className="flex items-center cursor-pointer text-zinc-300 hover:text-white">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => Auth.logout()}
                    className="cursor-pointer text-zinc-300 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-zinc-400 hover:text-white hover:bg-transparent"
                  onClick={() => Auth.redirectToLogin()}
                >
                  Sign In
                </Button>
                <Link to={createPageUrl('RequestAccess')}>
                  <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a] font-medium px-5">
                    Request Access
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 mx-4 rounded-xl p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-400 hover:text-[#00ff88] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to={createPageUrl('Dashboard')} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-zinc-400">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-zinc-400">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-zinc-400"
                    onClick={() => Auth.logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full text-zinc-400"
                    onClick={() => Auth.redirectToLogin()}
                  >
                    Sign In
                  </Button>
                  <Link to={createPageUrl('RequestAccess')} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                      Request Access
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Hexagon className="w-8 h-8 text-[#00ff88]" strokeWidth={1.5} />
                <span className="font-semibold">Nexus Ventures</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-md">
                Democratizing access to pre-IPO opportunities. We connect qualified investors with 
                vetted secondary market deals in the world's most innovative companies.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-zinc-500 mb-4">PLATFORM</h4>
              <div className="space-y-2">
                <Link to={createPageUrl('Portfolio')} className="block text-sm text-zinc-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
                <Link to={createPageUrl('Deals')} className="block text-sm text-zinc-400 hover:text-white transition-colors">
                  Deal Flow
                </Link>
                <Link to={createPageUrl('About')} className="block text-sm text-zinc-400 hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-zinc-500 mb-4">LEGAL</h4>
              <div className="space-y-2">
                <span className="block text-sm text-zinc-500">Privacy Policy</span>
                <span className="block text-sm text-zinc-500">Terms of Service</span>
                <span className="block text-sm text-zinc-500">Disclosures</span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600">
              © 2024 Nexus Ventures. All rights reserved.
            </p>
            <p className="text-[10px] text-zinc-700 max-w-lg text-center md:text-right">
              Securities offered through Nexus Ventures. This is not an offer to sell or a solicitation of an offer to buy any security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
