"use client";
import React, { useState } from 'react'
import Footer from './footer/page';
import Navbar from './navbar/page';
import Sidebar from './sidebar/page';
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