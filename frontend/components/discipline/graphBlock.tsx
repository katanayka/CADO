"use client";
import { ReactFlowProvider, useStore } from "reactflow";
import { Collapse } from "react-daisyui";
import { IoMap } from "react-icons/io5";
import { EnsembleTree } from "@/services/treeSctructure";
import dynamic from 'next/dynamic';
import { FC, useState } from "react";
import { getCookie } from "cookies-next";
import { useSelector } from 'react-redux';
const RedactorLink = dynamic(() => import('@/components/discipline/redactorLink'), { ssr: false });
const Graph = dynamic(() => import('@/components/discipline/graph'));
interface GraphProps {
    data: EnsembleTree<any> | null;
    disciplineId: string;
    nodeTypes: { [key: string]: any };
}

const GraphBlock: FC<GraphProps> = ({ data, disciplineId, nodeTypes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isTeacher = getCookie("userType") === "teacher";
    const { nodes, edges } = data?.convertIntoNodesEdges() ?? { nodes: [], edges: [] };
    // Use redux to get selected node info
    const selectNodeInfo = useSelector((state: any) => state.selectedNodeInfo);
    return (
        <Collapse checkbox={true} icon={"arrow"} className="big-tile py-0 mapBlock" onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
            <Collapse.Title className="text-xl font-medium">
                <div className="flex mb-2">
                    <IoMap size={30} className="mx-6" /> Карта
                </div>
            </Collapse.Title>
            <Collapse.Content>
                {isOpen ?
                    <div className="flex flex-row space-x-4">
                        <div className="ourBlock big-tile h-[600px] w-full">
                            {isTeacher ? <RedactorLink disciplineId={disciplineId} /> : null}
                            <div className="h-full w-full flex items-center place-content-center border rounded-l -mt-1">
                                <ReactFlowProvider>

                                    <Graph nodes={nodes} edges={edges} nodeTypes={nodeTypes} />

                                </ReactFlowProvider>
                            </div>
                        </div>
                    </div>
                    : null}
            </Collapse.Content>
        </Collapse>
    );
};

export default GraphBlock;