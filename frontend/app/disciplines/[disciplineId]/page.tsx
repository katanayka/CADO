"use client"
import CollapseSkillsInfo from "@/components/discipline/collapseSkillsInfo";
import GraphBlock from "@/components/discipline/graphBlock";

interface paramProps {
	disciplineId: string;
}

export default function Page({ params }: { params: paramProps }) {
	return (
		<div>
			<div className="content flex h-full">
				<div className="user h-full w-1/6"></div>
				<div className="about bg-orange-700 h-full w-5/6 px-6 py-2 max-h-full">
					<h2 className="font-light text-sm">
						<div className="text-sm breadcrumbs">
							<ul>
								<li>
									<a href="/">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
										Home
									</a>
								</li>
								<li>
									<a href={`/disciplines/${params.disciplineId}`}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
										{decodeURIComponent(params.disciplineId)}
									</a>
								</li>
							</ul>
						</div>
					</h2>
					<h1 className="font-bold text-2xl">
						{decodeURIComponent(params.disciplineId)}
					</h1>
					<GraphBlock params={params} />
					<div className="big-tile">Здесь будет список как на том трекере
						<CollapseSkillsInfo />
					</div>
					<div className="big-tile h-72 stripes bg-hero-diagonal-lines"></div>
					<div className="big-tile h-48 bg-hero-diagonal-lines"></div>
				</div>
			</div>
		</div>
	);
}
