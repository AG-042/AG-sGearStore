'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings } from 'lucide-react';
import { isAuthenticated, logout, getToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import CartIcon from '@/components/CartIcon';

/**
 * Modern minimalist navigation with user personalization
 */
export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    // Fetch user profile if authenticated
    if (authStatus) {
      const fetchUserProfile = async () => {
        try {
          const token = getToken();
          const response = await fetch('http://localhost:8000/api/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };
      
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [authenticated]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-light text-gray-900 dark:text-gray-100 tracking-wide group-hover:text-blue-950 dark:group-hover:text-amber-500 transition-colors">
                AG'S GEARSTORE
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Button asChild variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-950 dark:hover:text-amber-500 font-normal">
              <Link href="/shop">Shop</Link>
            </Button>
            
            <div className="px-3">
              <CartIcon />
            </div>
            
            {!authenticated ? (
              <>
                <Button asChild variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-950 dark:hover:text-amber-500 font-normal">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none ml-2">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Welcome */}
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Welcome, {user?.first_name || user?.username || 'User'}
                  </span>
                </div>
                
                {/* User Menu Items */}
                <Button asChild variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-950 dark:hover:text-amber-500 font-normal">
                  <Link href="/profile" className="flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 font-normal flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
