'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isAuthenticated, getToken } from '@/lib/auth';

/**
 * Auth UI for fans, guest checkout for quick buys
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:8000/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-gray-900 dark:text-gray-100 text-xl font-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-none">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
                  Your <span className="text-blue-950 dark:text-amber-500">Profile</span>
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your account and view loyalty rewards
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {profile && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-800"
                  >
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Username
                    </h2>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{profile.user}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-800"
                  >
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Favorite Teams
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.favorite_teams && profile.favorite_teams.length > 0 ? (
                        profile.favorite_teams.map((team: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-none text-sm font-normal"
                          >
                            {team}
                          </motion.span>
                        ))
                      ) : (
                        <p className="text-gray-500">No favorite teams yet</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Loyalty Points
                    </h2>
                    <div className="flex items-baseline gap-2">
                      <motion.p
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                        className="text-4xl font-light text-blue-950 dark:text-amber-500"
                      >
                        {profile.gear_points || 0}
                      </motion.p>
                      <span className="text-gray-600 dark:text-gray-400">points</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Earn 1 point for every $10 spent
                    </p>
                  </motion.div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
