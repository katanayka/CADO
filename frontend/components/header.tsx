'use client'
import { getCookie, setCookie } from 'cookies-next';
import React, { useEffect } from 'react'

const Header = () => {
    const [userId, setUserId] = React.useState(getCookie("userId"));
    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    }
	if (!userId) {
		const newUserId = Math.random().toString(36).substring(7);
		setCookie("userId", newUserId, {
			sameSite: 'none',
			secure: true
		});
	}
    useEffect(() => {
        setCookie("userId", userId, {
            sameSite: 'none',
            secure: true
        });
    }, [userId]);
    return (
        <header className="bg-blue-500 p-2 flex justify-between items-center">
            <div></div>
            <div className="text-white">{userId}</div>
        </header>
    )
}

export default Header
