"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import Toolbar from "@/components/discipline/redactor/toolbar";
import { useState } from "react";
import "reactflow/dist/style.css";
import { ReactFlowProvider } from "reactflow";
import Breadcrumbs from "@/components/discipline/breadcrumbs";

interface ParamProps {
  disciplineId: string;
}

export default function Page({ params }: Readonly<{ params: ParamProps }>) {
  const [sharedData, setSharedData] = useState(null);
  return (
    <div className="m-0 p-0 h-full">
      <div className="content flex h-full">
        <Toolbar disciplineId={params.disciplineId} sharedData={sharedData} />
        <div className="about bg-orange-700 w-full">
          <div className="ourBlock" style={{height:"96%"}}>
            <div className="absolute z-20">
              <Breadcrumbs items={[
                { href: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                { href: `/disciplines/${params.disciplineId}`, label: decodeURIComponent(params.disciplineId), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                { label: "Add Document", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
              ]} />
            </div>
            <div className="h-full">
              <ReactFlowProvider>
                <GraphRedactor setSharedData={setSharedData} />
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
