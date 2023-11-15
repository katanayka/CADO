"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import { useState } from "react";
import "reactflow/dist/style.css";

interface paramProps {
	disciplineId: string;
}

export default function Page({ params }: { params: paramProps }) {
	const [nodes, setNodes] = useState([
		{
			id: "1", // required
			position: { x: 0, y: 0 }, // required
			data: { label: "Node 1" },
		},
		{
			id: "2", // required
			position: { x: 100, y: 100 }, // required
			data: { label: "Node 2" },
		},
	]);
	const [edges, setEdges] = useState([
		{
			id: "e1-2", // required
			source: "1", // required
			target: "2", // required
		},
	]);
	// 
	return (
		<div>
			<div className="content flex h-full min-h-screen w-screen">
				<div className="user h-full w-1/24">
					<ul className="menu rounded-box gap-2 items-center">
						<li>
							<a>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
							</a>
						</li>
						<li>
							<a>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</a>
						</li>
						<li>
							<a>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</a>
						</li>
					</ul>
				</div>
				<div className="about bg-orange-700 h-screen w-full">
					<div className="ourBlock h-full">
						<GraphRedactor nodes={nodes} edges={edges} />
					</div>
				</div>
			</div>
		</div>
	);
}
