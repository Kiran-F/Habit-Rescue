import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F5] dark:bg-[#141917] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
