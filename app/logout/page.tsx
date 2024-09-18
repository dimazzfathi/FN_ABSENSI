"use client";
import React, { useState } from 'react';

const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    // Tambahkan logika logout di sini
    alert('Logged out!');
    setShowPopup(false);
  };

function page() {
  return (
    <div>
      <li>
              <a onClick={() => setShowPopup(true)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </a>
              {showPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Apakah Anda yakin ingin logout?</h2>
                    <div className="flex ">
                      <button
                        onClick={() => setShowPopup(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded ml-auto"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
    </div>
  )
}

export default page
