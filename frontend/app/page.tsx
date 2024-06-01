"use client"
import Discipline from "../data/Disciplines";
import Icon from "@/components/Icon";
import dynamic from 'next/dynamic';
import discipline_card from "@/components/discipline_card";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Link from "next/link";
import { getCookie } from "cookies-next";

const DropdownType = dynamic(() => import('@/components/dropdown-user-type'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });


export default function Home() {
    return (
        <div>

            <div className="content flex h-full min-h-screen">
                <div className="bg-blue-500 flex-1">
                    <Icon />
                    {/* <DropdownType /> */}
                    {/* <UserIdShowcase /> */}
                    <Divider />
                    <List className="">
                        <Link href={'/'}>
                            <ListItem disablePadding className="bg-blue-100 shadow-md">
                                <ListItemButton>
                                    <ListItemIcon>

                                    </ListItemIcon>
                                    <ListItemText primary="Модули" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        <Link href={'/marks'}>
                            <ListItem disablePadding >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <BookmarkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Оценки   " />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                </div>
                <div className="about bg-orange-700 h-full w-5/6 min-h-screen">
                    <Header/>
                    <div className="px-6 flex flex-col gap-4">
                        <h1> Предметные дисциплины </h1>
                        <div className="flex flex-wrap">
                            {Object.keys(Discipline).map((key) => (
                                discipline_card({ key, Discipline: Discipline[key] })
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
