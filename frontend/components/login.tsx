'use client'
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const UserIdShowcase = () => {
    const router = useRouter()
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLoginClick = () => {
        axios.post('/api/login', { userId, password })
            .then(_ => {
                console.log(_.data['userType'])
                console.log("Logged in successfully!");
                setCookie("userId", userId, {
                    sameSite: 'none',
                    secure: true
                });
                if (_.data['userType'] == 1) {
                    setCookie("userType", 'teacher', {
                        sameSite: 'none',
                        secure: true
                    });
                } else {
                    setCookie("userType", null, {
                        sameSite: 'none',
                        secure: true
                    });
                }

                router.push('/')
            })
            .catch(_ => {
                setError("Invalid credentials. Please try again.");
            });
    }

    const handleRegisterClick = () => {
        axios.post('/api/register', { userId, password })
            .then(_ => {
                console.log("User registered successfully!");
                setCookie("userId", userId, {
                    sameSite: 'none',
                    secure: true
                });
                router.push('/')
            })
            .catch(_ => {
                setError("Registration failed. Please try again.");
            });
    }
    return (
        <div className="flex items-center w-screen h-screen align-middle justify-center bg-blue-400">
            <div className="flex flex-col gap-2 items-center justify-center w-[400px] h-[400px] shadow-2xl bg-white border pb-12">
                <div className='flex flex-col w-full gap-4 pl-12'>
                    <h1 className='font-light text-xl'>
                        Вход
                    </h1>
                    <input type="text" value={userId} onChange={(e) => { setUserId(e.target.value) }} className="border-2 border-gray-300 w-[80%] h-9" />
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="border-2 border-gray-300 w-[80%] h-9" />
                    {error && <p className="text-red-500">{error}</p>}
                    <button onClick={handleLoginClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 w-[80%] h-9">
                        Войти
                    </button>
                    <button onClick={handleRegisterClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 w-[80%] h-9">
                        Зарегистрироваться
                    </button>
                </div>

            </div>
        </div>
    )
}

export default UserIdShowcase;
