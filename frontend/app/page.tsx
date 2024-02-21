import Link from "next/link";
import Discipline from "../data/Disciplines";
import Icon from "@/components/Icon";
import dynamic from 'next/dynamic';

const DropdownType = dynamic(() => import('@/components/dropdown-user-type'), { ssr: false });

export default function Home() {

	return (
		<div>
			<div className="content flex h-full min-h-screen">
				<div className="bg-blue-500 flex-1">
					<Icon/>
					<DropdownType />
				</div>
				<div className="about bg-orange-700 h-full w-5/6 px-6 py-2 min-h-screen">
					<h1> Предметные дисциплины </h1>
					<div className="flex flex-wrap">
						{Object.keys(Discipline).map((key) => (
							<div className="big-tile h-48 w-full" key={key}>
								<h2>Дисциплина: {key}</h2>
								<Link
									href="/disciplines/[disciplineId]"
									as={`/disciplines/${Discipline[key]}`}
									className="text-blue-500 underline"
								>
									{key}
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}