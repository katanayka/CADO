'use client'

const Header = dynamic(() => import('@/components/header'), { ssr: false });
import { Divider, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';  // Import BarChart component
import dynamic from "next/dynamic";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

function createData(
    name: string,
    link: string,
    marks: number[][]
) {
    return { name, link, marks };
}

const chartSetting = {
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        },
    },
};

export default function Home() {
    const isTeacher = getCookie("userType") === "teacher";
    const username = getCookie("userId");
    const [selectedName, setSelectedName] = useState(null);
    const [marks, setMarks] = useState({});
    const [groupMarks, setGroupMarks] = useState([]);
    const [groupAverageScore, setGroupAverageScore] = useState(0)
    const [allStudentMarks, setAllStudentMarks] = useState({});
    const [cumulativeMarksGroup, setCumulativeMarksGroup] = useState([]);
    const [cumulativeMarksGroup_, setCumulativeMarksGroup_] = useState([]);

    const completedTasksTheory = [0, 2, 1, 3, 1, 0, 2, 1, 0, 0, 0, 2, 0, 1, 3, 0, 0, 0]
    const completedTasksPracti = [0, 0, 0, 3, 2, 1, 0, 0, 2, 0, 0, 1, 0, 2, 1, 0, 1, 0]

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
            let formattedData;
            if (!isTeacher) {

                formattedData = data.reduce((acc, curr) => {
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
            }

            setMarks(formattedData);
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
            const formattedData = data.reduce((acc, curr) => {
                const { pair, grade } = curr;
                if (!acc[pair - 1]) {
                    acc[pair - 1] = [];
                }
                acc[pair - 1].push(grade);
                return acc;
            }, []);
            setGroupMarks(formattedData);
        } catch (error) {
            console.error("There was an error fetching the group marks!", error);
        }
    };

    const getGroupCumulative = async (subjectName: string) => {
        try {
            const response = await axios.get('/api/getCumulativeGroupMarks', {
                params: {
                    username: username,
                    subject_name: subjectName
                }
            });
            const data = response.data.data;
            setCumulativeMarksGroup(data)
        } catch (error) {

        }
    }

    const getGroupMarksSum = async (subjectName: string) => {
        try {
            const response = await axios.get('/api/getGroupStudentTotalMarks', {
                params: {
                    username: username,
                    subject_name: subjectName
                }
            });
            const data = response.data.data;
            setGroupAverageScore(data)
        } catch (error) {
            console.error("There was an error fetching the group marks sum!", error);
        }
    };

    const getAllStudentMarks = async (subjectName: string) => {
        try {
            const response = await axios.get('/api/getAllStudentMarks', {
                params: {
                    username: username,
                    subject_name: subjectName
                }
            });
            const data = response.data.data;
            setAllStudentMarks(data);
        } catch (error) {
            console.error("There was an error fetching the marks for all students!", error);
        }
    };

    useEffect(() => {
        getMarks();
    }, []);

    useEffect(() => {
        if (selectedName) {
            getGroupMarks(selectedName);
            getGroupMarksSum(selectedName);
            getGroupCumulative(selectedName);
            if (isTeacher) {
                getAllStudentMarks(selectedName);
            }
        }
    }, [selectedName]);

    const rows = Object.keys(marks).map(subject_name => {
        // Получаем первые буквы каждого слова в subject_name и преобразуем их в верхний регистр,
        // если слово состоит больше чем из одной буквы
        const initials = subject_name.split(' ').map(word =>
            word.length > 1 ? word[0].toUpperCase() : word[0]
        ).join('');
        // Создаем URL на основе этих букв
        const url = `/disciplines/${encodeURIComponent(initials)}`;
        return createData(subject_name, url, marks[subject_name]);
    });



    console.log(rows)

    const maxMarksLength = Math.max(0, ...rows.map(row => row.marks.length));
    const maxGroupMarksLength = Math.max(0, ...groupMarks.map(group => group.length));
    let maxLength = Math.max(maxMarksLength, maxGroupMarksLength);

    const selectedRow = rows.find(row => row.name === selectedName);



    const fillArray = (arr, length) => {
        if (length <= arr.length) return arr; // No need to fill if arr is longer
        return arr.concat(Array(length - arr.length).fill(0));
    };

    const summarizeNums = (array: number[]) => {
        var sum = array.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0);
        return sum
    }

    const infillArray = (arr: number[], length: number) => {
        for (let i = 0; i < length - arr.length; i++) {
            arr.push(0)
        }
        return arr
    }

    const createArrayCumulative = (marksList: number[]) => {
        let marksCumulativeList = [...marksList];
        for (let i = 1; i < maxNums; i++) {
            const sliceOfNums = marksCumulativeList.slice(i - 1, i + 1)
            marksCumulativeList[i] = summarizeNums(sliceOfNums)
        }
        return marksCumulativeList
    }

    const getMaxNums = (marksList1: number[], marksList2: number[]) => {
        return Math.max(marksList1.length, marksList2.length);
    }

    const selectedMarks = selectedRow ? selectedRow.marks.map(group => group.reduce((a, b) => a + b, 0) / group.length) : [];
    const groupAverageMarks = groupMarks.map(group => group.reduce((a, b) => a + b, 0) / group.length);

    const filledSelectedMarks_ = fillArray(selectedMarks, maxLength);
    const filledGroupAverageMarks_ = fillArray(groupAverageMarks, maxLength);
    const maxNums = getMaxNums(filledSelectedMarks_, filledGroupAverageMarks_)
    const filledSelectedMarks__ = infillArray(selectedMarks, maxNums);
    const filledGroupAverageMarks__ = infillArray(groupAverageMarks, maxNums);
    const filledSelectedMarks = createArrayCumulative(filledSelectedMarks__)
    const filledGroupAverageMarks = createArrayCumulative(filledGroupAverageMarks__)

    maxLength = Math.max(filledSelectedMarks.length, filledGroupAverageMarks.length);
    let maxVal = 0;
    rows.forEach(row => {
        if (row.marks.length > maxVal) maxVal = row.marks.length;
    });

    const totalSelectedMarks = selectedRow ? selectedRow.marks.flat().reduce((a, b) => a + b, 0) : 0;
    const totalGroupGrades = groupMarks.flat();
    const totalGroupMarks = totalGroupGrades.length > 0 ? totalGroupGrades.reduce((a, b) => a + b, 0) / totalGroupGrades.length : 0;
    let newCumulutiveMarks = [...cumulativeMarksGroup]
    const lastCumulutiveValue = newCumulutiveMarks[newCumulutiveMarks.length - 1]
    for (let i = cumulativeMarksGroup.length; i < filledSelectedMarks.length; i++) {
        newCumulutiveMarks.push(lastCumulutiveValue)
    }

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
                                {!isTeacher ? (
                                    <>
                                        <BarChart
                                            series={[
                                                {
                                                    data: [0].concat(filledSelectedMarks),
                                                    valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                                                    label: 'Ваши оценки'
                                                },
                                                {
                                                    data: [0].concat(newCumulutiveMarks),
                                                    valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                                                    label: 'Средние оценки группы'
                                                }
                                            ]}
                                            height={200}
                                            margin={{ top: 10, bottom: 20 }}
                                        />
                                        <div className="flex items-start justify-start">
                                            <BarChart
                                                xAxis={[{ data: ['Результат'], scaleType: 'band', categoryGapRatio: 0.7 }]}  // Add scaleType: 'band' here
                                                series={[
                                                    {
                                                        data: [totalSelectedMarks],
                                                        label: 'Ваш результат'
                                                    },
                                                    {
                                                        data: [groupAverageScore],
                                                        label: 'Средний результат группы'
                                                    }
                                                ]}
                                                height={200}
                                                width={500}
                                                margin={{ top: 50, bottom: 20 }}
                                                {...chartSetting}
                                            />
                                        </div>
                                        <div className="flex items-start justify-start">
                                            <BarChart
                                                xAxis={[{ data: Array.from({ length: maxVal }, (_, index) => index + 1), scaleType: 'band', categoryGapRatio: 0.1 }]}  // Add scaleType: 'band' here
                                                series={[
                                                    {
                                                        data: completedTasksTheory,
                                                        label: 'Theory',
                                                    },
                                                    {
                                                        data: completedTasksPracti,
                                                        label: 'Practical',
                                                    },
                                                ]}
                                                height={200}
                                                margin={{ top: 10, bottom: 20 }}
                                                {...chartSetting}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <LineChart
                                        xAxis={[{ data: Array.from({ length: maxLength }, (_, index) => index + 1) }]}
                                        series={Object.keys(allStudentMarks).map(student => ({
                                            data: fillArray(allStudentMarks[student].map(mark => mark.grade), maxLength),
                                            label: student,
                                            valueFormatter: (value) => (value == null ? 'NaN' : value.toString())
                                        }))}
                                        height={400}
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
