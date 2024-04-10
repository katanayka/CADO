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
        <>
            {/* Place for userId key*/}
            <h3> User ID: </h3>
            <input type="text" value={userId} className="" onChange={inputChangeHandler} />
        </>
    )
}

export default UserIdShowcase
