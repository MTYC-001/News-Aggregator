
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../app/globals.css';

{/*This is to handle the sign in (Marvin Tan)*/}
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      
      const response = await fetch('https://api.staging.bzpke.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in localStorage
        router.push('/'); // Redirect to the homepage/dashboard
      } else {
        // If the response is not OK, get the error message from the response
        const errorData = await response.json();
        alert(errorData.message); // Show the error message to the user
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while trying to sign in.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
            onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
          autoComplete="off"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
          autoComplete="off"
          placeholder="Password"
          required
        />
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold p-2 rounded w-80"
          type="submit"
        >
          Sign In
        </button>
        <p className="mt-4">
          Don&apos;t have an account?
          <Link href="/signup">
            <span className="text-blue-600 hover:text-blue-800 ml-1">Sign up</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
