'use client'
import { getCookie, setCookie } from 'cookies-next';
import React, { useEffect } from 'react';

const UserIdShowcase = () => {
    const [userId, setUserId] = React.useState(getCookie("userId") || "");
    const [password, setPassword] = React.useState("");

    const inputChangeHandlerLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    }

    const inputChangeHandlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        if (!userId) {
            const newUserId = Math.random().toString(36).substring(7);
            setCookie("userId", newUserId, {
                sameSite: 'none',
                secure: true
            });
        }
    }, [userId]);

    useEffect(() => {
        setCookie("userId", userId, {
            sameSite: 'none',
            secure: true
        });
    }, [userId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("User ID:", userId);
        console.log("Password:", password);

        const userData = { userId, password };
        const jsonData = JSON.stringify(userData);
        localStorage.setItem("userData", jsonData);
    }

    const handleLoginClick = () => {
        console.log("Login button clicked");
    }

    const handleRegisterClick = () => {
        console.log("Register button clicked");
    }
    

    return (
        <div className="flex flex-col gap-2 items-center">
            <h3> Login: </h3>
            <input type="text" value={userId} onChange={inputChangeHandlerLogin} className="border-2 border-gray-300 w-[80%]" />
            <h3> Password: </h3>
            <input type="password" value={password} onChange={inputChangeHandlerPassword} className="border-2 border-gray-300 w-[80%]" />
            <button onClick={handleLoginClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Login
            </button>
            <button onClick={handleRegisterClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
            </button>
        </div>
    )
}

export default UserIdShowcase;
