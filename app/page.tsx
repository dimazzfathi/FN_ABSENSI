"use client";
import React, { useState } from 'react'
import Navbar from './components/layout/navbar/page';
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