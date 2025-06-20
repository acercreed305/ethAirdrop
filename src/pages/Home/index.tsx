import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/config';

const Home: React.FC = () => {
  return (
    <div className="bg-white dark:bg-background-dark transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-white dark:bg-background-dark transition-colors duration-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1 bg-blue-50 dark:bg-card-dark text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold tracking-wide">
              <span role="img" aria-label="fire">🔥</span> LIMITED TIME OFFER - 24 HOURS LEFT!
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              <span className="block">EXCLUSIVE ETH AIRDROP</span>
              <span className="block text-blue-600 dark:text-blue-400">CLAIM 1000 ETH NOW!</span>
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join 50,000+ users who have already claimed their free ETH! Don't miss this once-in-a-lifetime opportunity.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex-1 bg-gray-100 dark:bg-card-dark rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className="text-red-500 mr-2 text-lg">●</span>
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">LIVE: Users claiming right now</span>
                </div>
                <div className="flex gap-6 mt-2 sm:mt-0">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">1,247</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Claims Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">$2.4M</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Distributed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">23:47:12</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Time Left</div>
                  </div>
                </div>
              </div>
            </div>
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition-colors duration-200"
            >
              🎁 CLAIM MY FREE ETH NOW
            </Link>
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>⚡ Instant payout</span>
              <span>·</span>
              <span>🔒 100% Secure</span>
              <span>·</span>
              <span>💎 No strings attached</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative">
              <img
                className="w-auto object-contain mx-auto"
                src="/img/hero.png"
                alt="ETH Airdrop"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Success Stories Section */}
      <section className="bg-gray-50 dark:bg-card-dark transition-colors duration-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-8">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Success Stories</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Our Users Are Saying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-background-dark rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">John M.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Just claimed my 1000 ETH! This is absolutely amazing! 🚀 The process was so easy and I got my tokens instantly. Thank you team!"
              </p>
              <div className="mt-3 flex text-yellow-500 dark:text-yellow-400">
                ★★★★★
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-background-dark rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  SK
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah K.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "I was skeptical at first but decided to try it. OMG! I actually received 1000 ETH in my wallet! This is life-changing! 💎"
              </p>
              <div className="mt-3 flex text-yellow-500 dark:text-yellow-400">
                ★★★★★
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-background-dark rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  AM
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">Alex M.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">30 minutes ago</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "Best decision ever! Got my ETH in seconds. The team is legit and the process is super smooth. Highly recommend! 🎉"
              </p>
              <div className="mt-3 flex text-yellow-500 dark:text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <section className="bg-white dark:bg-background-dark transition-colors duration-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">50,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 dark:text-green-400">$2.4M</div>
              <div className="text-gray-600 dark:text-gray-400">Total Distributed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 dark:text-blue-300">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 dark:text-yellow-400">24h</div>
              <div className="text-gray-600 dark:text-gray-400">Time Left</div>
            </div>
          </div>
        </div>
      </section>
      {/* Urgency Section */}
      <section className="bg-gray-100 dark:bg-card-dark transition-colors duration-300 py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center mb-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
            <span className="mr-2">⚠️</span> URGENT: Airdrop Ending Soon!
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            Due to overwhelming demand, we're closing registrations in the next 24 hours. Don't miss your chance to claim 1000 ETH!
          </p>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            ⏰ 23:47:12
          </div>
          <Link
            to={ROUTES.DASHBOARD}
            className="inline-block px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition-colors duration-200"
          >
            🚨 CLAIM NOW BEFORE IT'S TOO LATE
          </Link>
        </div>
      </section>
      {/* Security Section */}
      <section className="bg-white dark:bg-background-dark transition-colors duration-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-8">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Security</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Your Security is Our Priority
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 dark:bg-card-dark rounded-lg p-6 shadow border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">100% Secure</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Advanced blockchain security ensures your funds are always safe.
              </p>
            </div>
            <div className="text-center bg-gray-50 dark:bg-card-dark rounded-lg p-6 shadow border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Instant Payout</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Receive your ETH rewards immediately after verification.
              </p>
            </div>
            <div className="text-center bg-gray-50 dark:bg-card-dark rounded-lg p-6 shadow border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-white mx-auto mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Verified Platform</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Audited smart contracts and verified by leading security firms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 