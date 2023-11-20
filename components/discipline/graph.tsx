"use client";

import React from "react";
import ReactFlow from "reactflow";
import axios from "axios";
import { FC } from "react";

import { useEffect, useState } from "react";

import "reactflow/dist/style.css";
import RewritableNode from "./redactor/customNodes/Rewritablenode_non_pressable";

interface GraphProps {
	discipline: string;
}

const nodeTypes = {
	Rewritable: RewritableNode,
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
			}
		}
		fetchData();
	}, []);

	return <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />;
};

export default Graph;
