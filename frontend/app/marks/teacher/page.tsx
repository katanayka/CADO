'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import _ from 'lodash';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Icon, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Radio, FormControlLabel, RadioGroup, Checkbox, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Header = dynamic(() => import('@/components/header'), { ssr: false });

const TeacherDashboard = () => {
    const username = getCookie('userId');
    const [marks, setMarks] = useState([]);
    const [maxPairs, setMaxPairs] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [alignChart, setAlignChart] = useState("false");

    const getMarks = useCallback(async () => {
        try {
            const response = await axios.get('/api/getMarks', { params: { username } });
            const data = response.data.data;

            const groupedData = _.chain(data)
                .groupBy('subject_name')
                .map((students, subject_name) => ({
                    subject_name,
                    students: _.chain(students)
                        .groupBy('username')
                        .map((grades, username) => ({
                            username,
                            grades: grades.map(({ grade, pair }) => ({ grade, pair }))
                        }))
                        .value()
                }))
                .value();

            setMarks(groupedData);
            setMaxPairs(Math.max(...data.map(item => item.pair)));
        } catch (error) {
            console.error("There was an error fetching the marks!", error);
        }
    }, [username]);

    useEffect(() => {
        getMarks();
    }, [getMarks]);

    const handleRadioChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const calculateTotalScore = useCallback((studentUsername) => {
        const selectedStudent = marks
            .find(subject => subject.subject_name === selectedSubject)
            .students.find(student => student.username === studentUsername);

        return selectedStudent ? _.sumBy(selectedStudent.grades, 'grade') : 0;
    }, [marks, selectedSubject]);

    const createArrayCumulative = (marksList) => {
        return _.reduce(marksList, (acc, curr, idx) => {
            acc.push((acc[idx - 1] || 0) + curr);
            return acc;
        }, []);
    };

    const handleAlignment = (event, newAlignment) => {
        setAlignChart(newAlignment);
    };

    const handleCheckboxChange = (event, studentUsername) => {
        setSelectedStudents(prev => event.target.checked
            ? [...prev, studentUsername]
            : prev.filter(username => username !== studentUsername));
    };

    const selectedSubjectData = useMemo(() => {
        return marks.find(subject => subject.subject_name === selectedSubject) || {};
    }, [marks, selectedSubject]);

    const selectedStudentsData = useMemo(() => {
        return selectedSubjectData.students?.filter(student => selectedStudents.includes(student.username)) || [];
    }, [selectedSubjectData, selectedStudents]);

    const chartData = useMemo(() => {
        return selectedStudentsData.map(student => {
            const grades = Array.from({ length: maxPairs }, (_, index) => {
                const gradeObj = student.grades.find(g => g.pair === index + 1);
                return gradeObj ? gradeObj.grade : 0;
            });
            const cumulativeGrades = createArrayCumulative(grades);
            return {
                data: [0, ...cumulativeGrades],
                label: student.username,
                valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
                stack: alignChart === "true" ? 'total' : undefined
            };
        });
    }, [selectedStudentsData, maxPairs, alignChart]);

    const sortedChartData = useMemo(() => {
        return alignChart === "true"
            ? _.sortBy(chartData, student => _.sum(student.data))
            : chartData;
    }, [chartData, alignChart]);

    return (
        <div>
            <div className="content flex h-full min-h-screen">
                <div className="bg-blue-500 flex-1">
                    <Icon />
                    <Divider />
                    <List>
                        <Link href='/'>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon />
                                    <ListItemText primary="Дисциплины" className='text-black' />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        <Link href='/marks'>
                            <ListItem disablePadding className="bg-blue-100 shadow-md">
                                <ListItemButton>
                                    <ListItemIcon><BookmarkIcon /></ListItemIcon>
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
                            {marks.map(subject => (
                                <div key={subject.subject_name} className='mb-4 flex flex-wrap'>
                                    <FormControlLabel
                                        value={subject.subject_name}
                                        control={<Radio />}
                                        label={<Typography>{subject.subject_name}</Typography>}
                                        className='mb-2'
                                    />
                                    <div className='overflow-auto max-w-screen'>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                                                const totalScore = _.sumBy(student.grades, 'grade');
                                                                return (
                                                                    <TableRow key={student.username}>
                                                                        <TableCell>{student.username}</TableCell>
                                                                        {Array.from({ length: maxPairs }, (_, index) => {
                                                                            const gradeObj = student.grades.find(g => g.pair === index + 1);
                                                                            return (
                                                                                <TableCell key={index}>{gradeObj?.grade ?? ''}</TableCell>
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
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Студенты</Typography>
                                    </AccordionSummary>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {selectedSubjectData.students?.map(student => (
                                            <FormControlLabel
                                                key={student.username}
                                                control={
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student.username)}
                                                        onChange={(event) => handleCheckboxChange(event, student.username)}
                                                    />
                                                }
                                                label={student.username}
                                                sx={{ m: 0, minWidth: 100 }}
                                            />
                                        ))}
                                    </div>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>График оценок</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ToggleButtonGroup
                                            value={alignChart}
                                            exclusive
                                            onChange={handleAlignment}
                                            aria-label="text alignment"
                                        >
                                            <ToggleButton value="true" aria-label="Do not align charts">
                                                <PersonOutlineIcon />
                                            </ToggleButton>
                                            <ToggleButton value="false" aria-label="Align charts">
                                                <PeopleOutlineIcon />
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        <BarChart
                                            series={sortedChartData}
                                            xAxis={[{ scaleType: 'band', data: ['0', ...Array.from({ length: maxPairs }, (_, index) => (index + 1).toString())], categoryGapRatio: 0.7 }]}
                                            height={400}
                                            margin={{ top: 180, bottom: 20 }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                {selectedStudents.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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

export default TeacherDashboard;
