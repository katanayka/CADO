import Graph from "@/components/discipline/graph";
import Image from "next/image";
import {FC} from "react";

interface pageProps {
	params: {discipline: string}
}

const Page: FC<pageProps> = ({params}) => {
	return (
		<div>
			<div className="content flex h-full">
				<div className="user h-full w-1/6"></div>
				<div className="about bg-orange-700 h-full w-5/6 px-6 py-2 max-h-full">
					<h2 className="font-light text-sm">
						<a
							href={"/"}
							className="underline text-blue-500 underline-offset-1"
						>
							Каталог МУП
						</a>
						{" >"} Карточка МУП
					</h2>
					<h1 className="font-bold text-2xl">{decodeURIComponent(params.discipline)}</h1>
					<div className="ourBlock big-tile h-96 p-24">
						<a href={"/"} className="">
							<Image
								src="/open_link.svg"
								alt="Open link"
								width={24}
								height={24}
								priority
								className="p-0.5"
							/>
						</a>
						<div className="bg-hero-graph-paper h-full w-full flex items-center place-content-center border rounded-l -mt-6">
							<Graph 
								discipline={params.discipline}
							/>
						</div>
					</div>
					<div className="big-tile h-72 stripes bg-hero-diagonal-lines"></div>
					<div className="big-tile h-48 bg-hero-diagonal-lines"></div>
				</div>
			</div>
		</div>
	);
}

export default Page;