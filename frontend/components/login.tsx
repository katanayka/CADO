'use client'
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { getCookie, setCookie } from 'cookies-next';

const UserIdShowcase = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const inputChangeHandlerLogin = (e: { target: { value: any; }; }) => {
        const newUserId = e.target.value;
        setUserId(newUserId);
        setCookie("userId", newUserId, {
			sameSite: 'none',
			secure: true
		});
    }
    const inputChangeHandlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleLoginClick = () => {
        axios.post('/api/login', { userId, password })
            .then(_ => {
                console.log("Logged in successfully!");
                inputChangeHandlerLogin;
                window.location.reload(); 
            })
            .catch(_ => {
                setError("Invalid credentials. Please try again.");
            });
    }

    const handleRegisterClick = () => {
        axios.post('/api/register', { userId, password })
            .then(_ => {
                console.log("User registered successfully!");
                window.location.reload(); 
            })
            .catch(_ => {
                setError("Registration failed. Please try again.");
            });
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <h3> Login: </h3>
            <input type="text" value={userId} onChange={inputChangeHandlerLogin} className="border-2 border-gray-300 w-[80%]" />
            <h3> Password: </h3>
            <input type="password" value={password} onChange={inputChangeHandlerPassword} className="border-2 border-gray-300 w-[80%]" />
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleLoginClick} className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
            </button>
            <button onClick={handleRegisterClick} className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Register
            </button>
        </div>
    )
}

export default UserIdShowcase;
