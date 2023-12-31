import React, { useState } from 'react';
import { useRouter }  from 'next/navigation';
import '../app/globals.css';
import Link from 'next/link'; // Import Link from Next.js
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/signin', { // Assuming '/api/signin' is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token
        router.push('/');
      } else {
        console.error('Response not OK:', response);
        alert('Failed to sign in. Check your credentials.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('An error occurred while signing in.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
            onSubmit={handleSubmit}>
        {/* Form elements */}
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Password" required />
        <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold p-2 rounded w-80"
                type="submit"><span>Sign In</span></button>

        {/* Link to the signup page */}
        <p className="mt-4">
          Don't have an account? 
          <Link href="/signup">
            <span className="text-blue-600 hover:text-blue-800 ml-1 cursor-pointer">Sign up</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
