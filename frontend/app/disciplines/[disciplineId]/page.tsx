"use client"
import CollapseSkillsInfo from "@/components/discipline/collapseSkillsInfo";
import Breadcrumbs from "@/components/discipline/breadcrumbs";
import GraphBlock from "@/components/discipline/graphBlock";
import { useEffect, useState } from "react";
import axios from "axios";

interface paramProps {
	disciplineId: string;
}

export default function Page({ params }: { params: paramProps }) {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get(
				`/api/discipline/data?discipline=${(params.disciplineId)}`
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
		<div>
			<div className="content flex h-full">
				<div className="user h-full w-1/6"></div>
				<div className="about bg-orange-700 h-full w-5/6 px-6 py-2 max-h-full">
					<Breadcrumbs
						items={[
							{ href: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
							{ href: `/disciplines/${params.disciplineId}`, label: decodeURIComponent(params.disciplineId), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> }
						]}
					/>
					<h1 className="font-bold text-2xl">
						{decodeURIComponent(params.disciplineId)}
					</h1>
					<GraphBlock nodes={nodes} edges={edges} disciplineId={params.disciplineId} />
					<div className="big-tile max-h-[40rem] overflow-auto">
						<CollapseSkillsInfo nodes={nodes} edges={edges}/>
					</div>
					<div className="big-tile h-72 stripes bg-hero-diagonal-lines"></div>
					<div className="big-tile h-48 bg-hero-diagonal-lines"></div>
				</div>
			</div>
		</div>
	);
}
