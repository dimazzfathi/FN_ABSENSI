"use client";
import React, { useState } from 'react'
import Footer from '../components/footer/page';
import Navbar from '../components/navbar/page';
import Sidebar from '../components/sidebar/page';
const Page = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
      setIsOpen(!isOpen);
  };
  return (
    
    <>
    <div className=''>
      <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </div>
    </>

    
  );
}

export default Page