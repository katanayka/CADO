"use client";

import React from "react";
import ReactFlow, { Controls, ReactFlowProvider, useReactFlow } from "reactflow";
import axios from "axios";
import { FC } from "react";

import { useEffect, useState } from "react";

import "reactflow/dist/style.css";
import RewritableNode from "./redactor/customNodes/view/Rewritablenode";
import VideoNode from "./redactor/customNodes/view/NodeVideo"

interface GraphProps {
	discipline: string;
}

const nodeTypes = {
	Rewritable: RewritableNode,
	VideoN: VideoNode,
};

const Graph: FC<GraphProps> = ({ discipline }) => {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get(
				`/api/discipline/data?discipline=${(discipline)}`
			);
			if (res.status === 200) {
				const data = await res.data;
				console.log("Data fetched:", data);
				setNodes(data.nodes)
				setEdges(data.edges)
				console.log("Loaded")
			}
		}
		fetchData();
	}, []);

	return (
		<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
			<Controls />
		</ReactFlow>
	);
};

export default Graph;
