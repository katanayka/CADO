"use client"
import Breadcrumbs from "@/components/discipline/breadcrumbs";
import GraphBlock from "@/components/discipline/graphBlock";
import nodeTypesView from "@/data/NodeTypesView";
import { EnsembleTree } from "@/services/treeSctructure";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "@/store";
import { getCookie } from "cookies-next";

interface ParamProps {
	disciplineId: string;
}

const CollapseSkillsInfo = dynamic(() => import("@/components/discipline/collapseSkillsInfo"))

export default function Page({ params }: Readonly<{ params: ParamProps }>) {
	const [ensemble, setEnsemble] = useState<EnsembleTree<any> | null>(null);
	const isTeacher = getCookie("userType") === "teacher";

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get(
				`/api/discipline/data?discipline=${(params.disciplineId)}`
			);
			if (res.status === 200) {
				const data = await res.data;
				console.log(data)
				setEnsemble(new EnsembleTree<any>(data.dataTree));
				console.log(ensemble)
			}
		}
		fetchData();
	}, []);
	
	return (
		<div>
			<Provider store={store}>
				<div className="content flex h-full min-h-screen">
					<div className="bg-blue-500 user w-1/6"></div>
					<div className="about bg-orange-700 w-5/6 px-6 py-2">
						<Breadcrumbs
							items={[
								{ href: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
								{ href: `/disciplines/${params.disciplineId}`, label: decodeURIComponent(params.disciplineId), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> }
							]}
						/>
						<h1 className="font-bold text-2xl">
							{decodeURIComponent(params.disciplineId)}
						</h1>
						<GraphBlock data={ensemble} disciplineId={params.disciplineId} nodeTypes={nodeTypesView} />
						{ensemble ?
							<div className="big-tile max-h-[40rem] overflow-auto">
								<CollapseSkillsInfo data={ensemble} accessToEdit={isTeacher} />
							</div> :
							null
						}

						<div className="big-tile h-72 stripes bg-hero-diagonal-lines"></div>
						<div className="big-tile h-48 bg-hero-diagonal-lines"></div>
					</div>
				</div>
			</Provider>
		</div>
	);
}
