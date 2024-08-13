"use client";
import Link from 'next/link';
import React, { useState } from 'react';




const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventdefault();

        try {
            const response = await fetch('http://localhost:3005/api/login',{
               method: 'POST',
               headers: {
                'Content-Type': 'application/json',
               },
               body: JSON.stringify({ username, password }),
            });
            if (!response.ok){
                throw new Error('Login failed');
            }
            const data = await response.json();
            // Menangani login yang berhasil, misalnya, menyimpan token atau mengalihkan ke halaman lain
            console.log('Login successful:', data);
            // Contoh: dialihkan ke halaman administrator setelah login berhasil
            window.location.href = '/administrator';
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Username atau password salah. Coba lagi.');
          }
    };
  return (
    <main className="bg-pageBg bg-cover bg-center bg-no-repeat min-h-screen">
      <div className="flex justify-center items-center w-full min-h-screen bg-black bg-opacity-15">
        <aside className="bg-white w-full max-w-md rounded-xl bg-opacity-20 shadow-lg shadow-black mx-4 sm:mx-8 md:mt-16 lg:mt-24">
          <h1 className="text-center text-black font-light text-4xl bg-teal-400 rounded-t-xl p-4 font-times">Login</h1>
          <form className="flex flex-col p-6 space-y-4" action="">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="py-2 px-3 w-full text-black text-lg font-light outline-none rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="py-2 px-3 w-full text-black text-lg font-light outline-none rounded-md"
            />
            <div className="flex justify-between items-center mt-5">
              <Link href="" className="text-zinc-500 transition hover:text-black">
                Belum Mendaftar?
              </Link>
              <button
                type="submit"
                className="bg-black text-teal-400 font-medium py-2 px-6 transition hover:text-white rounded-md"
              >
                <Link href="../../">Login</Link>
                
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
   
  )
}

export default LoginForm
