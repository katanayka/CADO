"use client";
import React, { FC } from "react";
import ReactFlow, { Controls } from "reactflow";

import "reactflow/dist/style.css";
import RewritableNode from "./redactor/customNodes/view/Rewritablenode";
import VideoNode from "./redactor/customNodes/view/NodeVideo"

interface GraphProps {
    nodes: any;
    edges: any;
}

const nodeTypes = {
	Rewritable: RewritableNode,
	VideoN: VideoNode,
};

const Graph: FC<GraphProps> = ({ nodes, edges }) => {
	return (
		<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
			<Controls />
		</ReactFlow>
	);
};

export default Graph;
