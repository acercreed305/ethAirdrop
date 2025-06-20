import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="bg-white dark:bg-background-dark rounded-lg p-6 mb-8 text-center shadow transition-colors duration-300">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About CryptoRewards Foundation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are a leading blockchain foundation dedicated to democratizing access to cryptocurrency through our innovative airdrop programs.
          </p>
        </section>

        {/* Company Story Section */}
        <section className="bg-gray-50 dark:bg-card-dark rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Founded in 2021 by a team of blockchain veterans from Silicon Valley, CryptoRewards Foundation has been at the forefront of the DeFi revolution. Our mission is to bridge the gap between traditional finance and the crypto ecosystem.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                With over $50 million in funding from top-tier investors including Andreessen Horowitz and Paradigm, we've built one of the most trusted platforms in the cryptocurrency space.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our team consists of 25+ blockchain experts, including former employees from Coinbase, Binance, and Ethereum Foundation, ensuring the highest standards of security and innovation.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">To democratize access to cryptocurrency and create financial opportunities for everyone, regardless of their background or location.</p>
              </div>
              <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300">To become the world's leading platform for cryptocurrency distribution and education, serving millions of users worldwide.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-white dark:bg-background-dark rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2.5M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$150M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">98.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Support Available</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 dark:bg-card-dark rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">MS</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Michael Stevens</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">CEO & Founder</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Former VP at Coinbase, 15+ years in fintech</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">SC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sarah Chen</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">CTO</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Ex-Binance, Ethereum core contributor</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">DJ</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">David Johnson</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">Head of Security</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Former FBI cybercrime specialist</p>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="bg-white dark:bg-background-dark rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Trusted Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Coinbase</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Binance</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Ethereum</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">Chainlink</div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="bg-gray-50 dark:bg-card-dark rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🏆 Best DeFi Platform 2023</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Awarded by Crypto Awards Foundation</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🔒 Security Excellence Award</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Recognized by Blockchain Security Alliance</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">⭐ Top 10 Crypto Startups</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Featured in Forbes Crypto 2023</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🌍 Global Innovation Prize</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Winner at World Blockchain Summit</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white dark:bg-background-dark rounded-lg shadow p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>📍 123 Blockchain Street, San Francisco, CA 94105</p>
                <p>📧 support@cryptorewards.foundation</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>🌐 www.cryptorewards.foundation</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Business Hours</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                <p>Sunday: Closed</p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
