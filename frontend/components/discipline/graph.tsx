"use client";
import React, { FC } from "react";
import ReactFlow, { Controls, useStoreApi } from "reactflow";

import "reactflow/dist/style.css";

interface GraphProps {
	nodes: any;
	edges: any;
	nodeTypes: { [key: string]: any };
}

const Graph: FC<GraphProps> = ({ nodes, edges, nodeTypes }) => {
	const store = useStoreApi();
	if (process.env.NODE_ENV === "development") {
		store.getState().onError = (code, message) => {
			if (code === "002") {
				return;
			}
			console.warn(message);
		};
	}
	return (
		<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
			<Controls />
		</ReactFlow>
	);
};

export default Graph;
