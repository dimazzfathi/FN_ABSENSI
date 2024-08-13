"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
  const [isAkademikOpen, setIsAkademikOpen] = useState(false);
  const [isSiswaOpen, setIsSiswaOpen] = useState(false);
  const [isGuruOpen, setIsGuruOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
    <div className="flex">
      {/* Button to toggle sidebar */}
      {/* <button
        // onClick={toggleSidebar}
        className="p-4 focus:outline-none"
      >
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
      </button> */}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-teal-400 text-white w-64 p-5 transform
        transition-transform duration-300 ease-in-out`}
        //  ${ isOpen ? 'translate-x-0' : '-translate-x-full'} 
      >
        <h2 className="text-2xl font-semibold mb-5">Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/">
                <p className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Dashboard
                </p>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/absensi">
                <p className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Absensi
                </p>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/naik-kelas">
                <p className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Naik Kelas
                </p>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={toggleMasterData}
                className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded focus:outline-none"
              >
                Master Data
              </button>
              {isMasterDataOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                  <button
                  onClick={toggleAkademik}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded focus:outline-none"
                  >
                    Akademik
                  </button>
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
                  </li>
                  <li>
                  <button
                  onClick={toggleSiswa}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded focus:outline-none"
                  >
                    Siswa
                  </button>
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
                  </li>
                  <li>
                  <button
                  onClick={toggleGuru}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded focus:outline-none"
                  >
                    Guru
                  </button>
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
                  </li>
                </ul>
              )}
            </li>
            <li className="mb-2">
                <button
                    onClick={toggleAdmin}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded focus:outline-none"
                  >
                    Administrator
                </button>
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
            </li>
            <li className="mb-2">
              <Link href="/naik-kelas">
                <p className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Setting
                </p>
              </Link>
            </li>
            
            {/* Tambahkan menu lainnya di sini */}
          </ul>
        </nav>
      </div>

      {/* Overlay untuk menutup sidebar ketika diklik */}
      {isOpen && (
        <div
          className="fixed inset-0 opacity-50"
          // onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
