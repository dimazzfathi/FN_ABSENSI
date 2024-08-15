"use client";
import React, { useState } from 'react'
import Sidebar from '../sidebar/page';
import Link from 'next/link';
import Drop from "./app"

    const Navbar = ({ toggleSidebar, isOpen }: { toggleSidebar: () => void; isOpen: boolean; }) => {

    const [isClick, setisClick] = useState(false);
    const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
    const [isAkademikOpen, setIsAkademikOpen] = useState(false);
    const [isSiswaOpen, setIsSiswaOpen] = useState(false);
    const [isGuruOpen, setIsGuruOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
  
    const toggleNavbar = () => {
      setisClick(!isClick);
    };
    const toggleMasterData = () => {
      setIsMasterDataOpen(!isMasterDataOpen);
    };
    const toggleAkademik = () => {
      setIsAkademikOpen(!isAkademikOpen);
    };
    const toggleSiswa = () => {
      setIsSiswaOpen(!isSiswaOpen);
    };
    const toggleGuru = () => {
      setIsGuruOpen(!isGuruOpen);
    };
    const toggleAdmin = () => {
      setIsAdminOpen(!isAdminOpen);
    };
    return (
    <>
    <nav className="bg-teal-400 z-50 relative sticky top-0">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                
                <button
                    onClick={toggleSidebar}
                    className=" justify-between focus:outline-none">
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                    </svg>
                </button>
                 <div className="flex-shrink-0 p-4">
                  <a href="/" className='text-white'>Logo</a>
                </div>
              </div>
                <div className="hidden md:block">
                    <div className="ml-4 flex items-center space-x-4">
                    <span className='w-12 h-12 rounded-full'>
                      <img src="" alt="" width={112} height={112} className='bg-transparent w-auto h-auto'/>
                    </span>
                    <Drop />
                    </div>
                    
                </div>
                <div className="md:hidden flex items-center">
                    <button
                    className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ' onClick={toggleNavbar}>
                         {isClick ? (
                            <svg className='h-6 w-6'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6L12 12' />
                            </svg> 
                         ) : (
                            <svg className='h-6 w-6'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                         )}
                    </button>
                </div>
          </div>
      </div>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isClick ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
        {isClick && (
            <div className="md:hidden z-10">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="/" className='text-white block hover:bg-white hover:text-black rounded-lg p-2'>
                    Home
                    </a>
                    <a href="/" className='text-white block hover:bg-white hover:text-black rounded-lg p-2'>
                    About
                    </a>
                    <a href="/" className='text-white block hover:bg-white hover:text-black rounded-lg p-2'>
                    Contact
                    </a>
                </div>
            </div>
        )}</div>
                
    </nav>

    <div className="flex flex-1 flex-col lg:ml-72.5 z-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-teal-400 text-white w-64 p-5 transform 
            ${ isOpen ? 'translate-x-0' : '-translate-x-full'}  transition-transform duration-500 ease-in-out`}>
          <div>
          </div>
        <nav className='pt-16'>
          <ul>
            <li className="mb-2">
              <Link href="/">
              <div className="px-4 py-2 hover:bg-teal-200 rounded">
                <p>
                  Dashboard
                </p>
              </div>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/absensi">
                <p className="block px-4 py-2 hover:bg-teal-200 rounded">
                  Absensi
                </p>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/naik-kelas">
                <p className="block px-4 py-2 hover:bg-teal-200 rounded">
                  Naik Kelas
                </p>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={toggleMasterData}
                className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
              >
                Master Data
                
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${
                    isMasterDataOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                
              </button>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isMasterDataOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
              {isMasterDataOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                  <button
                  onClick={toggleAkademik}
                  className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
                  >
                    Akademik
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isAkademikOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isAkademikOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <Link href="/master-data/akademik">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Tahun Ajaran
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/master-data/siswa">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Kelas
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/master-data/guru">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Jurusan
                      </p>
                    </Link>
                  </li>
                </ul>
                    )}
                    </div>
                  </li>
                  <li>
                  <button
                  onClick={toggleSiswa}
                  className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
                  >
                    Siswa
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isSiswaOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isSiswaOpen && (
                        <ul className="pl-4 mt-2 space-y-1">
                          <li>
                            <Link href="/master-data/akademik">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                                Siswa
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/master-data/siswa">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                                Rombel
                              </p>
                            </Link>
                          </li>
                        </ul>
                      )}
                  </div>
                  </li>
                  <li>
                  <button
                  onClick={toggleGuru}
                  className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
                  >
                    Guru
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isGuruOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isGuruOpen && (
                        <ul className="pl-4 mt-2 space-y-1">
                          <li>
                            <Link href="/master-data/akademik">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                                Mapel
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/master-data/siswa">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                                Guru
                              </p>
                            </Link>
                          </li>
                        </ul>
                      )}
                  </div>
                  </li>
                </ul>
              )}
              </div>
            </li>
            <li className="mb-2">
                <button
                    onClick={toggleAdmin}
                    className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
                  >
                    Administrator
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isAdminOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                {isAdminOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <Link href="/master-data/akademik">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Profile
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/master-data/siswa">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Add User
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/master-data/siswa">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded">
                        Logout
                      </p>
                    </Link>
                  </li>
                </ul>
                )}
                </div>
            </li>
            <li className="mb-2">
              <Link href="/naik-kelas">
                <p className="block px-4 py-2 hover:bg-teal-200 rounded">
                  Setting
                </p>
              </Link>
            </li>
            
            {/* Tambahkan menu lainnya di sini */}
          </ul>
        </nav>
      </div>
    </div>

      {/* Main content */}
      {/* <main
        className={`px-30 transition-transform duration-300 relative ${
          isOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="flex-1 p-6 transition-transform duration-300">
          <div className="min-h-screen">
            <h1>hhhhhh</h1>
          </div>
        </div>
      </main> */}
    </>
  );
};

export default Navbar
