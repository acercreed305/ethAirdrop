import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { ROUTES } from './constants/config';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-dark-primary transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;
