"use client";
import { ReactFlowProvider, useStore } from "reactflow";
import { Collapse } from "react-daisyui";
import { IoMap } from "react-icons/io5";
import { EnsembleTree } from "@/services/treeSctructure";
import dynamic from 'next/dynamic';
import { FC, useState } from "react";
import { getCookie } from "cookies-next";
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
                                    <div className="w-[30%] h-full flex flex-col gap-3 px-3">
                                        {/*<...>*/}
                                        <div className="relative top-[50%] left-[-30px] w-full">
                                            
                                        </div>
                                        <div className="w-full text-center">
                                            Python
                                        </div>
                                        <div className="overflow-auto">
                                            Python - это высокоуровневый язык программирования, известный своей простотой и читаемостью кода. Он широко используется как для написания маленьких сценариев, так и для разработки крупных веб-приложений и научных вычислений. Python поддерживает различные парадигмы программирования, включая процедурное, объектно-ориентированное и функциональное программирование.
                                        </div>
                                    </div>
                                </ReactFlowProvider>
                            </div>
                        </div>
                        {/* <div className="big-tile h-96 stripes bg-hero-diagonal-lines w-1/4">

                        </div> */}
                    </div>
                    : null}
            </Collapse.Content>
        </Collapse>
    );
};

export default GraphBlock;