'use client'
import Discipline from "../../data/Disciplines";
import Icon from "@/components/Icon";
import dynamic from 'next/dynamic';
import { Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { getCookie } from "cookies-next";
import axios from "axios";

const DropdownType = dynamic(() => import('@/components/dropdown-user-type'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });

function createData(
    name: string,
    link: string,
    marks: number[][]
) {
    return { name, link, marks };
}

const rows = [
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[0.5], [2, 0.5], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Алгоритмы и технологии параллельных и распределенных вычислений', 'http://localhost:3000/disciplines/%D0%90%D0%A2%D0%9F%D0%B8%D0%A0%D0%92', [[5], [3], [4], [7], [2], [6], [8], [1], [4], [7], [6], [9], [2], [1], [5], [3], [8]]),
    createData('Компьютерное зрение', 'http://localhost:3000/disciplines/%D0%9A%D0%97', [[6], [8], [7], [5], [9], [4], [8], [7], [6], [5], [9], [4], [3], [8]])
];

const rows_teacher = [
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[0.5], [2, 0.5], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 0.5], [2, 0.5], [0.5, 0.5], [2, 0.5], [0.5, 0.5], [2, 0.5], [0.5, 0.5], [2, 0.5], [0.5, 0.5], [2, 0.5], [0.5, 0.5], [2, 0.5], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[3], [2, 3], [3, 1], [3, 1], [3, 1], [2, 1], [3, 1], [2, 1], [3, 1], [2, 1], [3, 1], [2, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[0.5], [2, 0.5], [0.5, 1], [3, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[0.5], [2, 0.5], [0.5, 1], [3, 1], [0.5, 1], [2, 3], [0.5, 3], [2, 3], [0.5, 3], [2, 3], [0.5, 3], [2, 3], [0.5, 3], [2, 3], [0.5, 3], [3, 3], [0.5, 3], [2, 3], [0.5, 3], [3, 3], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Основы программирования и алгоритмизации', 'http://localhost:3000/disciplines/%D0%9E%D0%9F%D0%B8%D0%90', [[0.5], [2, 0.5], [0.5, 1], [3, 1], [0.5, 1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [2, 1], [1, 1], [3, 1], [1, 1], [2, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [0.5, 1], [3, 1], [1, 1], [15], [0, 5, 5]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Открытые технологии разработки программного обеспечения', 'http://localhost:3000/disciplines/%D0%9E%D0%A2%D0%A0%D0%9F%D0%9E', [[2], [1], [1], [2], [6], [3], [3], [2], [4], [5], [2], [6], [2], [0], [0], [0], [2], [6], [2], [2], [4], [2], [1], [2], [2]]),
    createData('Алгоритмы и технологии параллельных и распределенных вычислений', 'http://localhost:3000/disciplines/%D0%90%D0%A2%D0%9F%D0%B8%D0%A0%D0%92', [[5], [3], [4], [7], [2], [6], [8], [1], [4], [7], [6], [9], [2], [1], [5], [3], [8]]),
    createData('Компьютерное зрение', 'http://localhost:3000/disciplines/%D0%9A%D0%97', [[6], [8], [7], [5], [9], [4], [8], [7], [6], [5], [9], [4], [3], [8]])
]



const maxMarksLength = Math.max(...rows.map(row => row.marks.length));

export default function Home() {
    const isTeacher = getCookie("userType") === "teacher";
    console.log(isTeacher)
    const [selectedName, setSelectedName] = useState(null);

    const handleRadioChange = (event: { target: { value: SetStateAction<null>; }; }) => {
        setSelectedName(event.target.value);
    };

    // Select marks and lesson_id from /api/getMarks
    const [marks, setMarks] = useState([]);
    const [lesson_id, setLesson_id] = useState([]);
    // Get marks (GET and send username)
    const getMarks = async () => {
        try {
            const response = await axios.get('/api/getMarks', {
                params: {
                    username: getCookie("userId")
                }
            });
            const data = response.data.data;
            setMarks(data);
            console.log(data)
            // Assuming you will set lesson_id from another response or logic
            // setLesson_id(someLessonId);
        } catch (error) {
            console.error("There was an error fetching the marks!", error);
        }
    };

    useEffect(() => {
        getMarks();
    }, []);

    const selectedRow = rows.find(row => row.name === selectedName);
    const selectedMarks = selectedRow ? selectedRow.marks.map(group => group.reduce((a, b) => a + b, 0)) : [];

    return (
        <div>
            <div className="content flex h-full min-h-screen">
                <div className="bg-blue-500 flex-1">

                    <Icon />
                    {/* <DropdownType /> */}
                    {/* <UserIdShowcase /> */}
                    <Divider />
                    <List className="">
                        <Link href={'/'} className="hidden">
                            <ListItem disablePadding className="">
                                <ListItemButton>
                                    <ListItemIcon>

                                    </ListItemIcon>
                                    <ListItemText primary="Дисциплины" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        <Link href={'/marks'}>
                            <ListItem disablePadding className="bg-blue-100 shadow-md">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <BookmarkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Оценки" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />

                </div>
                <div className="about bg-orange-700 h-full w-5/6 min-h-screen">
                    <Header />
                    <div className="px-6 flex flex-col gap-4">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Выбрать</TableCell>
                                        <TableCell>Модуль</TableCell>
                                        {Array.from({ length: maxMarksLength }).map((_, index) => (
                                            <TableCell key={index} align="right" className="whitespace-nowrap">Встреча {index + 1}</TableCell>
                                        ))}
                                        <TableCell align="right">Результат</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Radio
                                                    checked={selectedName === row.name}
                                                    onChange={handleRadioChange}
                                                    value={row.name}
                                                    name="discipline-radio-button"
                                                    inputProps={{ 'aria-label': row.name }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row" className="whitespace-nowrap">
                                                <Link href={row.link}>{row.name}</Link>
                                            </TableCell>
                                            {row.marks.map((markGroup, index) => (
                                                <TableCell key={index} align="right">
                                                    {markGroup.join(', ')}
                                                </TableCell>
                                            ))}
                                            {Array.from({ length: maxMarksLength - row.marks.length }).map((_, index) => (
                                                <TableCell key={row.marks.length + index} align="right"></TableCell>
                                            ))}
                                            <TableCell align="right">
                                                {row.marks.flat().reduce((a, b) => a + b, 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {selectedName && (
                            <Paper className="mt-4 p-4">
                                <h2>{selectedName} - Успеваемость</h2>
                                {isTeacher ?
                                    null
                                    : <LineChart
                                        xAxis={[{ data: selectedMarks.map((_, index) => index + 1) }]}
                                        series={[
                                            {
                                                data: selectedMarks,
                                                valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                                            }
                                        ]}
                                        height={200}
                                        margin={{ top: 10, bottom: 20 }}
                                    />}

                            </Paper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
