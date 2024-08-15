"use client";
import React, { useState } from 'react'
import Layout from "../../../components/layout/page"
import Navbar from "../../../components/layout/navbar/page"
import Footer from "../../../components/layout/footer/page"

  const Page = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

  return (
    <>
    <div>
    <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    
    {/* Main Content */}
    <main className={`px-30 transition-transform duration-300 z-40 ${isOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="flex-1 p-6 ">
          <div className="min-h-screen"><h1>dgrhrhrdfh</h1>
          </div>
      </div>
    </main>
    <Footer />
  </div>
  </>
  )
}

export default Page
