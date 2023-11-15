import React, { useCallback, useState } from "react";
import ReactFlow, {
	Controls,
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	Node,
	NodeChange,
	EdgeChange,
	Edge,
} from "reactflow";
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
	nodes_i: nodeProps[];
	edges_i: edgeProps[];
}

const GraphRedactor: FC<GraphRedactorProps> = ({ nodes_i, edges_i }) => {
	const [nodes, setNodes] = useState(nodes_i)
	const [edges, setEdges] = useState(edges_i)
	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds: Node<any>[]) => applyNodeChanges(changes, nds)),
		[]
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds)),
		[]
	);
	return (
		<ReactFlow
			nodes={nodes}
			onNodesChange={onNodesChange}
			edges={edges}
			onEdgesChange={onEdgesChange}
			className="z-10"
			snapToGrid={true}
			snapGrid={[24, 24]}
		>
			<Background />
			<Controls />
		</ReactFlow>
	);
};

export default GraphRedactor;
