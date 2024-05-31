'use client'
import { getCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Button } from 'react-daisyui';

const Header = () => {
    const router = useRouter()
    const [userId, setUserId] = React.useState(getCookie("userId"));
    const handleLogout = () => {
        setCookie("userId", "", {
            sameSite: 'none',
            secure: true
        });
        router.refresh()
    }
    return (
        <header className="bg-gray-700 p-2 flex items-center justify-end flex-row text-white">
            {userId ?
                <form className='flex gap-8'>
                    <div className="">Здравствуйте, {userId}</div>
                    <button onClick={handleLogout} type='submit'>
                        Выйти
                    </button>
                </form>
                :
                <div>
                    <Link href={'/auth'}>
                        Войти
                    </Link>
                </div>
            }
        </header>
    )
}

export default Header
