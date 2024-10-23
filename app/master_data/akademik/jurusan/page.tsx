
"use client";
import React, { useState } from 'react'
import Layout from "../../../layout/page"
import Navbar from "../../../components/navbar/page"
import Footer from "../../../components/footer/page"
import Jurusan from '../jurusan/hal';




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
    <main className={`px-30 transition-transform relative duration-300 z-10 ${
    isOpen ? 'ml-0 md:ml-64' : 'ml-0'
  }`}>
      <div className="flex-1 p-6 ">
          <div className="min-h-screen">
          <Jurusan />
          </div>
      </div>
    </main>
    <Footer />
  </div>
  </>
  )
}

export default Page
