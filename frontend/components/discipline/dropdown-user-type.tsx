"use client"
import user_dict from "@/data/User-types";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from 'cookies-next';

export default function DropdownType() {
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const userTypeFromLocalStorage = getCookie("userType");
        if (userTypeFromLocalStorage) {
            setUserType(userTypeFromLocalStorage);
        } else {
            setCookie("userType", "Студент");
            setUserType("Студент");
        }
    }, []);

    const handleTypeChange = (val: string) => {
        setUserType(val);
        setCookie('userType', val);
    }

    return (
        <details className="dropdown flex p-4">
            <summary className="btn w-full">{userType}</summary>
            <ul className="dropdown-content z-[1] menu p-2 shadow rounded-box bg-white w-10/12">
                {
                    Object.keys(user_dict).map((key) => (
                        <li key={key}>
                            <a className="dropdown-list-item" key={key} onClick={() => handleTypeChange(user_dict[key])}>
                                {user_dict[key]}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </details>

    );
}