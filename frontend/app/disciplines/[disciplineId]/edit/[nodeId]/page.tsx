"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { Form, Toggle } from 'react-daisyui';
import ParentComponent from '@/components/discipline/edit/trackerMenu';
import { v4 as uuidv4 } from 'uuid';

interface ParamProps {
    disciplineId: string;
    nodeId: string;
}

type nodeData = {
    id: string;
    type: string;
    data: {
        theory: any;
        practice: any;
        id: string;
        inside: string;
        label: string;
        text: string;
    };
    position: {
        x: number;
        y: number;
    };
    children: any[];
}

export default function Page({ params }: Readonly<{ params: ParamProps }>) {
    const { disciplineId, nodeId } = {
        disciplineId: decodeURIComponent(params.disciplineId),
        nodeId: decodeURIComponent(params.nodeId)
    }
    const [nodeData, setNodeData] = React.useState<any>(null)
    const [checked, setChecked] = React.useState(false)
    const [theory, setTheory] = React.useState<{ id: string; value: string }[]>([]);
    const [practice, setPractice] = React.useState<{ id: string; value: string }[]>([]);
    useEffect(() => {
        axios.get(`/api/discipline/data/node?disciplineId=${disciplineId}&nodeId=${nodeId}`)
            .then((response) => {
                const node_data = response.data.data as nodeData
                setNodeData(node_data)
                // Check if theory and practice are not empty
                if (node_data.data.theory.length > 0 || node_data.data.practice.length > 0) {
                    setChecked(true)
                    setTheory(node_data.data.theory.map((item: string) => {
                        return {
                            id: uuidv4(),
                            value: item
                        }
                    }))
                    setPractice(node_data.data.practice.map((item: string) => {
                        return {
                            id: uuidv4(),
                            value: item
                        }
                    }))
                }
                console.log(node_data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [disciplineId, nodeId])
    const handleToggle = (e: any) => {
        setChecked(e.target.checked)
    }
    const handleInfoChange = (e: any) => {
        setNodeData({
            ...nodeData,
            data: {
                ...nodeData.data,
                inside: e.target.value
            }
        })
    }
    const handleNameChange = (e: any) => {
        setNodeData({
            ...nodeData,
            data: {
                ...nodeData.data,
                text: e.target.value
            }
        })
    }
    const handleSave = () => {
        // Make axios request to save the data (/api/discipline/data/node/save) with disciplineId and updated nodeData
        let dataToPost = {
            disciplineId: disciplineId,
            nodeData: nodeData
        }
        if (checked) {
            dataToPost.nodeData.data.theory = theory.map((item) => item.value)
            dataToPost.nodeData.data.practice = practice.map((item) => item.value)
            // Clear empty values
            dataToPost.nodeData.data.theory = dataToPost.nodeData.data.theory.filter((item: string) => item !== '')
            dataToPost.nodeData.data.practice = dataToPost.nodeData.data.practice.filter((item: string) => item !== '')
        }
        axios.post(`/api/discipline/data/node/save`, {
            disciplineId: disciplineId,
            nodeData: nodeData
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <div className='bg-blue-500 w-full min-h-screen m-0 p-0'>
            <div className="flex items-center w-[80%] rounded-lg shadow-md h-full min-h-full mx-auto bg-white flex-col">
                <input className="text-2xl font-bold w-full p-4 text-center"
                    value={nodeData?.data.text}
                    onChange={handleNameChange} />
                <hr className="w-full" />
                <div className="flex flex-col p-4 w-[80%]">
                    <label className="text-lg font-semibold">Информация</label>
                    <textarea className="textarea textarea-primary h-[30rem]"
                        value={nodeData?.data.inside} 
                        onChange={handleInfoChange} />
                </div>
                <Form className="p-4 rounded-lg shadow">
                    <Form.Label title="Добавить трекер">
                        <Toggle className="m-2" onChange={handleToggle} checked={checked} />
                    </Form.Label>
                </Form>
                {checked ? <div className="flex flex-col p-4 w-[80%] rounded-lg shadow gap-2">
                    <div>
                        <p className="text-lg font-semibold">
                            Теория:
                        </p>
                        <div className="flex flex-col gap-4">
                            <ParentComponent items={theory} setItems={setTheory} placeHolder="Введите трекер теории" />
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const newItem = {
                                        id: uuidv4(), // Generate a unique id for the item
                                        value: '',
                                    }
                                    setTheory([...theory, newItem])
                                }}>
                                Add
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <p className="text-lg font-semibold">
                            Практика:
                        </p>
                        <div className="flex flex-col gap-4">
                            <ParentComponent items={practice} setItems={setPractice} placeHolder="Введите трекер практики" />
                            <button className="btn btn-primary"
                                onClick={() => {
                                    const newItem = {
                                        id: uuidv4(), // Generate a unique id for the item
                                        value: '',
                                    }
                                    setPractice([...practice, newItem])
                                }}>
                                Add
                            </button>
                        </div>
                    </div>
                </div> : null}

                <div className="flex space-x-2 mt-8 mb-8">
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    )
}
