"use client"
import { Box, Typography } from '@mui/material';
import { getCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const Header = () => {
    const router = useRouter()
    const [userId, setUserId] = React.useState(getCookie("userId"));
    const handleLogout = () => {
        setCookie("userId", "", {
            sameSite: 'none',
            secure: true
        });
        window.location.reload(); // Reload the page after logout
    }
    return (
        <Box className="bg-gray-700 p-2 flex items-center justify-end flex-row text-white">
            {userId ?
                <Box className='flex gap-8'>
                    Здравствуйте, {userId}
                    <button onClick={handleLogout} type='submit'>
                        <Typography>Выйти</Typography>
                    </button>
                </Box>
                :

                <Link href={'/auth'}>
                    Войти
                </Link>

            }
        </Box>
    )
}

export default Header
