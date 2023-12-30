import React, { useState } from 'react';
import { useRouter }  from 'next/navigation';
import '../app/globals.css';
const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST request to your API endpoint
    const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    });

    if (response.ok) {
      alert('Account created successfully!');
      router.push('/signin');
    } else {
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
            onSubmit={handleSubmit}>
        <p className="mb-5 text-3xl uppercase text-gray-600">Sign Up</p>
        <input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="First Name" required />
        <input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Last Name" required />
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-purple-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Password" required />
        <button className="bg-purple-600 hover:bg-purple-900 text-white font-bold p-2 rounded w-80"
                type="submit"><span>Sign Up</span></button>
      </form>
    </div>
  );
};

export default SignUp;
