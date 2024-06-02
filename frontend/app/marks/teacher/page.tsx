'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Icon, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Radio, FormControlLabel, RadioGroup, Checkbox } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Header = dynamic(() => import('@/components/header'), { ssr: false });

export default function TeacherDashboard() {
    const isTeacher = getCookie('userType') === 'teacher';
    const username = getCookie('userId');
    const [marks, setMarks] = useState([]);
    const [maxPairs, setMaxPairs] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const getMarks = async () => {
        try {
            const response = await axios.get('/api/getMarks', {
                params: {
                    username: username
                }
            });
            const data = response.data.data;

            const groupedData = data.reduce((acc, curr) => {
                const { subject_name, username, grade, pair } = curr;
                if (!acc[subject_name]) {
                    acc[subject_name] = {
                        subject_name: subject_name,
                        students: {}
                    };
                }
                if (!acc[subject_name].students[username]) {
                    acc[subject_name].students[username] = {
                        username: username,
                        grades: []
                    };
                }
                acc[subject_name].students[username].grades.push({ grade, pair });
                return acc;
            }, {});

            const groupedDataArray = Object.values(groupedData).map(subject => ({
                ...subject,
                students: Object.values(subject.students)
            }));

            setMarks(groupedDataArray);

            const maxPairs = Math.max(
                ...data.map(item => item.pair)
            );
            setMaxPairs(maxPairs);
        } catch (error) {
            console.error("There was an error fetching the marks!", error);
        }
    };

    const handleRadioChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    useEffect(() => {
        console.log(selectedStudents);
    }, [selectedStudents]);

    useEffect(() => {
        getMarks();
    }, []);

    const calculateTotalScore = (studentUsername) => {
        const selectedStudent = marks
            .find(subject => subject.subject_name === selectedSubject)
            .students.find(student => student.username === studentUsername);

        if (selectedStudent) {
            return selectedStudent.grades.reduce((sum, grade) => sum + grade.grade, 0);
        }

        return 0;
    };

    const fillArray = (arr, length) => {
        if (length <= arr.length) return arr;
        return arr.concat(Array(length - arr.length).fill(0));
    };

    const summarizeNums = (array) => {
        return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    };

    const infillArray = (arr, length) => {
        for (let i = 0; i < length - arr.length; i++) {
            arr.push(0);
        }
        return arr;
    };

    const createArrayCumulative = (marksList) => {
        let marksCumulativeList = [...marksList];
        for (let i = 1; i < marksList.length; i++) {
            const sliceOfNums = marksCumulativeList.slice(i - 1, i + 1);
            marksCumulativeList[i] = summarizeNums(sliceOfNums);
        }
        return marksCumulativeList;
    };

    const getMaxNums = (marksList1, marksList2) => {
        return Math.max(marksList1.length, marksList2.length);
    };

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
                                    <ListItemText primary="Дисциплины" className='text-black' />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        <Link href={'/marks'}>
                            <ListItem disablePadding className="bg-blue-100 shadow-md">
                                <ListItemButton>
                                    <ListItemIcon>
                                        <BookmarkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Оценки" className='text-black' />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                </div>
                <div className="about bg-orange-700 h-full w-5/6 min-h-screen">
                    <Header />
                    <div className="px-6 flex flex-col gap-4 justify-center">
                        <RadioGroup value={selectedSubject} onChange={handleRadioChange}>
                            {marks?.map(subject => (
                                <div key={subject.subject_name} className='mb-4 flex  flex-wrap'>
                                    <FormControlLabel
                                        value={subject.subject_name}
                                        control={<Radio />}
                                        label={<Typography>{subject.subject_name}</Typography>}
                                        className='mb-2'
                                    />
                                    <div className='overflow-auto max-w-screen'>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography>{subject.subject_name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Студент</TableCell>
                                                                {Array.from({ length: maxPairs }, (_, index) => (
                                                                    <TableCell key={index}>Встреча {index + 1}</TableCell>
                                                                ))}
                                                                <TableCell>Результат</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {subject.students?.map(student => {
                                                                const totalScore = student.grades.reduce((sum, grade) => sum + grade.grade, 0);
                                                                return (
                                                                    <TableRow key={student.username}>
                                                                        <TableCell>{student.username}</TableCell>
                                                                        {Array.from({ length: maxPairs }, (_, index) => {
                                                                            const gradeObj = student.grades.find(g => g.pair === index + 1);
                                                                            return (
                                                                                <TableCell key={index}>
                                                                                    {gradeObj?.grade ?? ''}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                        <TableCell>{totalScore}</TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                        <Divider />

                        {selectedSubject && (
                            <>
                                <Typography variant="h5">Графики</Typography>
                                <Divider />
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Студенты</Typography>
                                    </AccordionSummary>

                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {marks.find(subject => subject.subject_name === selectedSubject).students.map(student => (
                                            <FormControlLabel
                                                key={student.username}
                                                control={
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student.username)}
                                                        onChange={(event) => {
                                                            const checked = event.target.checked;
                                                            setSelectedStudents(prev => {
                                                                if (checked) {
                                                                    return [...prev, student.username];
                                                                } else {
                                                                    return prev.filter(username => username !== student.username);
                                                                }
                                                            });
                                                        }}
                                                    />
                                                }
                                                label={student.username}
                                                sx={{ m: 0, minWidth: 100 }} // Adjust the minWidth as needed
                                            />
                                        ))}
                                    </div>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>График оценок</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <BarChart
                                            series={marks
                                                .find(subject => subject.subject_name === selectedSubject)
                                                .students
                                                .filter(student => selectedStudents.includes(student.username))
                                                .map(student => {
                                                    const grades = Array.from({ length: maxPairs }, (_, index) => {
                                                        const gradeObj = student.grades.find(g => g.pair === index + 1);
                                                        return gradeObj ? gradeObj.grade : 0;
                                                    });
                                                    const cumulativeGrades = createArrayCumulative(grades);
                                                    return {
                                                        data: [0].concat(cumulativeGrades),
                                                        label: student.username,
                                                        valueFormatter: (value) => (value == null ? 'NaN' : value.toString())
                                                    };
                                                })}
                                            xAxis={[{ scaleType: 'band', data: ['0'].concat(Array.from({ length: maxPairs }, (_, index) => (index + 1).toString())), categoryGapRatio: 0.2 }]}
                                            height={400}
                                            margin={{ top: 180, bottom: 20 }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                {selectedStudents.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                        >
                                            <Typography>График результатов студентов</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <BarChart
                                                xAxis={[{ data: ['Result'], scaleType: 'band', categoryGapRatio: 0.7 }]}
                                                series={selectedStudents.map(student => ({
                                                    data: [calculateTotalScore(student)],
                                                    label: student,
                                                    valueFormatter: (value) => (value == null ? 'NaN' : value.toString())
                                                }))}
                                                height={400}
                                                margin={{ top: 180, bottom: 20 }}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
