import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../app/globals.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'http://api.staging.bzpke.com/api/signup'; // Replace with your actual API endpoint URL

    const user = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json(); // Handle the response data as needed
      alert('Account created successfully!');
      router.push('/signin');
    } else {
      const errorData = await response.json();
      alert(`Failed to create account: ${errorData.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
            onSubmit={handleSubmit}>
        <p className="mb-5 text-3xl uppercase text-gray-600">Sign Up</p>
        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Full Name" required />
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Password" required />
        <input type="password" name="passwordConfirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
               className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
               autoComplete="off" placeholder="Confirm Password" required />
        <button className="bg-blue-600 hover:bg-blue-900 text-white font-bold p-2 rounded w-80"
                type="submit"><span>Sign Up</span></button>
      </form>
    </div>
  );
};

export default SignUp;
