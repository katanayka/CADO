'use client'
import { getCookie, setCookie } from 'cookies-next';
import React, { useEffect } from 'react'

const UserIdShowcase = () => {
    // Check if userId is in cookies
    const [userId, setUserId] = React.useState(getCookie("userId"));
    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    }
	// If userId is not in cookies, then set userId to random string value
    useEffect(() => {
        setCookie("userId", userId, {
            sameSite: 'none',
            secure: true
        });
    }, [userId]);
    return (
        <div className="flex flex-col gap-2 items-center">
            {/* Place for userId key*/}
            <h3> User ID: </h3>
            <input type="text" value={userId} onChange={inputChangeHandler} className="border-2 border-gray-300 w-[80%]" />
        </div>
    )
}

export default UserIdShowcase
