import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import { FC } from "react";

import "reactflow/dist/style.css";

interface nodeProps {
    id: string;
    position: { x: number; y: number };
    data: { label: string };
}

interface edgeProps {
    id: string;
    source: string;
    target: string;
}


interface GraphRedactorProps {
	nodes: nodeProps[];
    edges: edgeProps[];
}

const GraphRedactor: FC<GraphRedactorProps> = ({ nodes, edges }) => {
	return (
		<ReactFlow nodes={nodes} edges={edges} className="z-10">
			<Background />
			<Controls />
		</ReactFlow>
	);
};

export default GraphRedactor;
