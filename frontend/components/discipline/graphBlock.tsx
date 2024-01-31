import { getCookie } from "cookies-next";
import Image from "next/image";
import { ReactFlowProvider } from "reactflow";
import Graph from "@/components/discipline/graph";
import { Accordion, Collapse } from "react-daisyui";

export default function GraphBlock({ params }: { params: { disciplineId: string } }) {
    return (
        <Collapse checkbox={true} className="big-tile py-0">
            <Collapse.Title className="text-xl font-medium">
                Click to open this one and close others
            </Collapse.Title>
            <Collapse.Content>
                <div className="ourBlock big-tile h-96 w-full">
                    <a href={"/disciplines/" + params.disciplineId + "/redactor"} style={
                        typeof getCookie("userType") === "string"
                            ?
                            getCookie("userType") == "Преподаватель"
                                ?
                                {}
                                :
                                { visibility: "hidden" }
                            :
                            {}
                    }>
                        <Image
                            src="/open_link.svg"
                            alt="Open link"
                            width={24}
                            height={24}
                            priority={true}
                            quality={100}
                            className="p-0.5 bg-white rounded-full xl:-ml-5 xl:-mt-5"
                        />
                    </a>
                    <div className="bg-hero-graph-paper h-full w-full flex items-center place-content-center border rounded-l -mt-1">
                        <ReactFlowProvider>
                            <Graph discipline={params.disciplineId} />
                        </ReactFlowProvider>
                    </div>
                </div>
            </Collapse.Content>
        </Collapse>
    );
}