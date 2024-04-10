"use client"
import React, { useState } from 'react';
import GraphRedactor from '@/components/discipline/redactor/graph_redactor';
import Toolbar from '@/components/discipline/redactor/toolbar';
import { ReactFlowProvider } from 'reactflow';
import Breadcrumbs from '@/components/discipline/breadcrumbs';

interface ParamProps {
    disciplineId: string;
}

const Page: React.FC<{ params: ParamProps }> = ({ params }) => {
    const [sharedData, setSharedData] = useState(null);
    return (
        <div className="m-0 p-0 h-full">
            <div className="content flex h-full">
                <Toolbar disciplineId={params.disciplineId} sharedData={sharedData} />
                <div className="about bg-orange-700 h-screen w-full">
                    <div className="ourBlock" style={{ height: "96%" }}>
                        <div className="absolute z-20">
                            <Breadcrumbs
                                items={[
                                    { href: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                                    { href: `/disciplines/${params.disciplineId}`, label: decodeURIComponent(params.disciplineId), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                                    { href: `/disciplines/${params.disciplineId}/redactor`, label: "Redactor", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                                    { label: "Add Element", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> }
                                ]} />
                        </div>
                        <div className="h-full">
                            <ReactFlowProvider>
                                <GraphRedactor setSharedData={setSharedData} dataTree={undefined} />
                            </ReactFlowProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
