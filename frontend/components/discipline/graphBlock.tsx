"use client"
import { ReactFlowProvider } from "reactflow";
import { Collapse } from "react-daisyui";
import { IoMap } from "react-icons/io5";

import dynamic from 'next/dynamic';
import { FC } from "react";
import { getCookie } from "cookies-next";

const RedactorLink = dynamic(() => import('@/components/discipline/redactorLink'), { ssr: false });
const Graph = dynamic(() => import('@/components/discipline/graph'));

interface GraphProps {
    nodes: any;
    edges: any;
    disciplineId: string;
}

const GraphBlock: FC<GraphProps> = ({ nodes, edges, disciplineId }) => {
    const isTeacher = getCookie("userType") === "Преподаватель";
    return (
        <Collapse checkbox={true} icon={"arrow"} className="big-tile py-0">
            <Collapse.Title className="text-xl font-medium">
                <div className="flex mb-2">
                    <IoMap size={30} className="mx-6"/> Карта
                </div>
            </Collapse.Title>
            <Collapse.Content>
                <div className="ourBlock big-tile h-96 w-full">
                    {isTeacher ? <RedactorLink disciplineId={disciplineId} /> : null}
                    
                    <div className="bg-hero-graph-paper h-full w-full flex items-center place-content-center border rounded-l -mt-1">
                        <ReactFlowProvider>
                            <Graph nodes={nodes} edges={edges} />
                        </ReactFlowProvider>
                    </div>
                </div>
            </Collapse.Content>
        </Collapse>
    );
};

export default GraphBlock;