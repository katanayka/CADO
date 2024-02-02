import { ReactFlowProvider } from "reactflow";
import Graph from "./graph";
import { Collapse } from "react-daisyui";
import { IoMap } from "react-icons/io5";

import dynamic from 'next/dynamic';

const RedactorLink = dynamic(() => import('@/components/discipline/redactorLink'), { ssr: false });

export default function GraphBlock({ params }: { params: { disciplineId: string } }) {
    return (
        <Collapse checkbox={true} icon={"arrow"} className="big-tile py-0">
            <Collapse.Title className="text-xl font-medium">
                <div className="flex mb-2">
                    <IoMap size={30} className="mx-6"/> Карта
                </div>
            </Collapse.Title>
            <Collapse.Content>
                <div className="ourBlock big-tile h-96 w-full">
                    <RedactorLink params={params}/>
                    <div className="bg-hero-graph-paper h-full w-full flex items-center place-content-center border rounded-l -mt-1">
                        <ReactFlowProvider>
                            <Graph discipline={params.disciplineId} />
                        </ReactFlowProvider>
                    </div>
                </div>
            </Collapse.Content>
        </Collapse>
    );
}