'use client'

const Header = dynamic(() => import('@/components/header'), { ssr: false });
import { Divider, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { LineChart } from '@mui/x-charts/LineChart';
import dynamic from "next/dynamic";

function createData(
    name: string,
    link: string,
    marks: number[][]
) {
    return { name, link, marks };
}

export default function Home() {
    const isTeacher = getCookie("userType") === "teacher";
    const username = getCookie("userId");
    const [selectedName, setSelectedName] = useState(null);
    const [marks, setMarks] = useState({});
    const [groupMarks, setGroupMarks] = useState([]);
    const [userMaxLength, setUserMaxLength] = useState(0);

    const handleRadioChange = (event: { target: { value: SetStateAction<null>; }; }) => {
        setSelectedName(event.target.value);
    };

    const getMarks = async () => {
        try {
            const response = await axios.get('/api/getMarks', {
                params: {
                    username: username
                }
            });
            const data = response.data.data;
            // Assuming data is in the format [{grade: 4, pair: 1, subject_name: 'Программирование и основы алгоритмизации'}, ...]
            const formattedData = data.reduce((acc, curr) => {
                const { subject_name, pair, grade } = curr;
                if (!acc[subject_name]) {
                    acc[subject_name] = [];
                }
                if (!acc[subject_name][pair - 1]) {
                    acc[subject_name][pair - 1] = [];
                }
                acc[subject_name][pair - 1].push(grade);
                return acc;
            }, {});
            setMarks(formattedData);
            setUserMaxLength(formattedData.length)
            console.log(formattedData);
        } catch (error) {
            console.error("There was an error fetching the marks!", error);
        }
    };

    const getGroupMarks = async (subjectName: string) => {
        try {
            const response = await axios.get('/api/getGroupMarks', {
                params: {
                    username: username,
                    subject_name: subjectName
                }
            });
            const data = response.data.data;
            // Assuming data is in the format [{grade: 4, pair: 1, subject_name: 'Программирование и основы алгоритмизации'}, ...]
            const formattedData = data.reduce((acc, curr) => {
                const { pair, grade } = curr;
                if (!acc[pair - 1]) {
                    acc[pair - 1] = [];
                }
                acc[pair - 1].push(grade);
                return acc;
            }, []);
            setGroupMarks(formattedData);
            console.log(formattedData);
        } catch (error) {
            console.error("There was an error fetching the group marks!", error);
        }
    };

    useEffect(() => {
        getMarks();
    }, []);

    useEffect(() => {
        if (selectedName) {
            getGroupMarks(selectedName);
        }
    }, [selectedName]);

    const rows = Object.keys(marks).map(subject_name => {
        return createData(subject_name, `/disciplines/${encodeURIComponent(subject_name)}`, marks[subject_name]);
    });

    const maxMarksLength = Math.max(0, ...rows.map(row => row.marks.length));
    const maxGroupMarksLength = Math.max(0, ...groupMarks.map(group => group.length));
    let maxLength = Math.max(maxMarksLength, maxGroupMarksLength);

    const selectedRow = rows.find(row => row.name === selectedName);

    // Fill with zeros to make both series equal in length to maxLength
    const fillArray = (arr, length) => {
        if (length <= arr.length) return arr; // No need to fill if arr is longer
        return arr.concat(Array(length - arr.length).fill(0));
    };

    const selectedMarks = selectedRow ? selectedRow.marks.map(group => group.reduce((a, b) => a + b, 0) / group.length) : [];
    const groupAverageMarks = groupMarks.map(group => group.reduce((a, b) => a + b, 0) / group.length);

    // Fill with zeros to make both series equal in length to maxLength
    const filledSelectedMarks = fillArray(selectedMarks, maxLength);
    const filledGroupAverageMarks = fillArray(groupAverageMarks, maxLength);

    maxLength = Math.max(filledSelectedMarks.length, filledGroupAverageMarks.length)
    let maxVal = 0
    rows.forEach(row => {
         console.log(row.marks.length)
         if (row.marks.length > maxVal) maxVal = row.marks.length
    });


    return (
        <div>
            <div className="content flex h-full min-h-screen">
                <div className="bg-blue-500 flex-1">
                    <Icon />
                    <Divider />
                    <List className="">
                        <Link href={'/'}>
                            <ListItem disablePadding className="">
                                <ListItemButton>
                                    <ListItemIcon></ListItemIcon>
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
                                        {Array.from({ length: maxVal }).map((_, index) => (
                                            <TableCell key={index} align="right" className="whitespace-nowrap">Встреча {index + 1}</TableCell>
                                        ))}
                                        <TableCell align="right">Результат</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                                            {Array.from({ length: maxVal - row.marks.length }).map((_, index) => (
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
                                {isTeacher ? null : (
                                    <LineChart
                                        xAxis={[{ data: Array.from({ length: maxLength }, (_, index) => index + 1) }]}
                                        series={[
                                            {
                                                data: filledSelectedMarks,
                                                valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                                                label: 'Ваши оценки'
                                            },
                                            {
                                                data: filledGroupAverageMarks,
                                                valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                                                label: 'Средние оценки группы'
                                            }
                                        ]}
                                        height={200}
                                        margin={{ top: 10, bottom: 20 }}
                                    />

                                )}
                            </Paper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
