"use client";
import React, { useState } from 'react'
import Sidebar from '../sidebar/page';
import Link from 'next/link';
import Drop from "./app";
import { HomeIcon, AcademicCapIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/solid';
import { ClipboardDocumentIcon, ChartBarIcon, CalendarIcon, UserCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';


const Navbar = ({ toggleSidebar, isOpen }: { toggleSidebar: () => void; isOpen: boolean; }) => {

const [isClick, setisClick] = useState(false);
const toggleNavbar = () => {setisClick(!isClick);};
const [isMasterDataOpen, setMasterDataOpen] = useState(false);
const [isAkademikOpen, setAkademikOpen] = useState(false);
const [isSiswaOpen, setSiswaOpen] = useState(false);
const [isGuruOpen, setGuruOpen] = useState(false);
const [isAdminOpen, setAdminOpen] = useState(false);
const [activeMenu, setActiveMenu] = useState(''); // State untuk menu aktif


const toggleMasterData = () => {
  setMasterDataOpen(!isMasterDataOpen);
  setAkademikOpen(false);
  setSiswaOpen(false);
  setGuruOpen(false);
  setAdminOpen(false);
};

const toggleAkademik = () => {
  setAkademikOpen(!isAkademikOpen);
  setSiswaOpen(false);
  setGuruOpen(false);
  setAdminOpen(false);
};

const toggleSiswa = () => {
  setSiswaOpen(!isSiswaOpen);
  setAkademikOpen(false);
  setGuruOpen(false);
  setAdminOpen(false);
};

const toggleGuru = () => {
  setGuruOpen(!isGuruOpen);
  setAkademikOpen(false);
  setSiswaOpen(false);
  setAdminOpen(false);
};

const toggleAdmin = () => {
  setAdminOpen(!isAdminOpen);
  setMasterDataOpen(false);
  setAkademikOpen(false);
  setSiswaOpen(false);
  setGuruOpen(false);
};
const handleMenuClick = (menu) => {
  setActiveMenu(menu);
};
    return (
    <>
    <nav className="bg-teal-500 z-30 relative sticky top-0 shadow-lg">
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
                  <a href="" className='text-white'>Logo</a>
                </div>
              </div>
                    
                <div className="block">
                    <div className="ml-4 flex items-center space-x-4">
                    <span className="hidden text-right lg:block">
                      <span className='block text-sm font-medium text-black dark:text-text'>Bima</span>
                      <span className='block text-xs'>Admin</span>
                    </span>
                    <span className='w-10 h-10 rounded-full'>
                      <img src="/image/logo 2.jpg" alt="" width={112} height={112} className='bg-black w-auto h-auto rounded-full'/>
                    </span>

                    <Drop />
                </div>
                    
                </div>
                {/* <div className="md:hidden flex items-center">
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
                </div> */}
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

    
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 bg-teal-400 text-white w-64 p-5 transform 
            ${ isOpen ? 'translate-x-0' : '-translate-x-full'}  transition-transform duration-500 ease-in-out`}>
          <div>
          </div>
        <nav className='pt-16 min-h-screen'>
          <h2 className='px-4 opacity-75'>Menu</h2>
          <ul>
            <li className="mb-2">
              <Link href="/">
              <div onClick={() => handleMenuClick('dashboard')}className={`px-4 py-2 hover:bg-teal-200 rounded flex items-center cursor-pointer ${activeMenu === 'dashboard' ? 'bg-teal-500' : ''}`}>
                <HomeIcon className="h-6 w-6 mr-2" />
                <p>Dashboard</p>
              </div>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="../../components/absensi">
              <div onClick={() => handleMenuClick('absensi')}
                                className={`px-4 py-2 hover:bg-teal-200 rounded flex items-center cursor-pointer ${activeMenu === 'absensi' ? 'bg-teal-500' : ''}`}>
                <ClipboardDocumentIcon className="h-6 w-6 mr-2" />
                <p>Absensi</p>
              </div>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="../components/naik_kelas">
              <div onClick={() => handleMenuClick('naik_kelas')}
                                className={`px-4 py-2 hover:bg-teal-200 rounded flex items-center cursor-pointer ${activeMenu === 'naik_kelas' ? 'bg-teal-500' : ''}`}>
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                <p>Naik Kelas</p>
              </div>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={toggleMasterData}
                className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
              >
                <div onClick={() => handleMenuClick('master_data')}className={`w-full text-left px-4 py-2 hover:bg-teal-200 rounded focus:outline-none ${activeMenu === 'master_data' ? 'bg-teal-500' : ''}`} className="hover:bg-teal-200 rounded flex items-center cursor-pointer">
                <ChartBarIcon className="h-6 w-6 mr-2" />
                <p className='pe-7'>Master Data</p>
                {isMasterDataOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
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
                    <div className="hover:bg-teal-200 rounded flex items-center cursor-pointer">
                {/* <AcademicCapIcon className="h-6 w-6 mr-2" /> */}
                <p className='opacity-85'>Akademik</p>
              </div>
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isAkademikOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isAkademikOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <Link href="../../master_data/akademik/thn_ajaran">
                        <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">Tahun Ajaran</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="../../master_data/akademik/kelas">
                        <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">Kelas</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="../../master_data/akademik/jurusan">
                        <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">Jurusan</p>
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
                    <p className='opacity-85'>Siswa</p>
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isSiswaOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isSiswaOpen && (
                        <ul className="pl-4 mt-2 space-y-1">
                          <li>
                            <Link href="../../master_data/siswa/data_siswa">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">
                                Siswa
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="../../master_data/siswa/rombel">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">
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
                  className="w-full text-left block px-4 py-2 hover:bg-teal-200 rounded focus:outline-none opacity-85"
                  >
                    Guru
                  </button>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isGuruOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                    {isGuruOpen && (
                        <ul className="pl-4 mt-2 space-y-1">
                          <li>
                            <Link href="../../master_data/guru/mapel">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">
                                Mapel
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="../../master_data/guru/data_guru">
                              <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-70">
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
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-teal-200 rounded focus:outline-none"
                  >
                   <div onClick={() => handleMenuClick('master_data')}className={`w-full text-left flex items-center px-4 py-2 hover:bg-teal-200 rounded focus:outline-none ${activeMenu === 'master_data' ? 'bg-teal-500' : ''}`} className="hover:bg-teal-200 rounded flex items-center cursor-pointer">
                <UserGroupIcon className="h-6 w-6 mr-2" />
                <p className='pe-4'>Administrator</p>
                {isAdminOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </div>
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isAdminOpen ? 'max-h-screen ' : 'max-h-0 opacity-0'}`}>
                {isAdminOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <Link href="../../administrator/profile">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-85">
                        Profile
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="../../administrator/add_user">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-85">
                        Add User
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="../../administrator/logout">
                      <p className="block px-4 py-2 hover:bg-gray-600 rounded opacity-85">
                        Logout
                      </p>
                    </Link>
                  </li>
                </ul>
                )}
                </div>
            </li>
            <li className="mb-2">
              <Link href="../../../setting">
              <div onClick={() => handleMenuClick('setting')}
                                className={`px-4 py-2 hover:bg-teal-200 rounded flex items-center cursor-pointer ${activeMenu === 'setting' ? 'bg-teal-500' : ''}`}>
                <CogIcon className="h-6 w-6 mr-2" />
                <p>Setting</p>
              </div>
              </Link>
            </li>
            
            {/* Tambahkan menu lainnya di sini */}
          </ul>
        </nav>
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
