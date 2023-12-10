"use client"
import React from 'react';
import { DisciplineContext } from '../page';
import GraphRedactor from '@/components/discipline/redactor/graph_redactor';
import Toolbar from '@/components/discipline/redactor/toolbar';

interface paramProps {
    disciplineId: string;
}

const Page: React.FC<{ params: paramProps }> = ({ params }) => {
    return (
        <>
            <div className="content flex h-full w-screen">
                <Toolbar disciplineId={params.disciplineId} />
                <div className="about bg-orange-700 h-screen w-full">
                    <div className="ourBlock h-full">
                        <div style={{ height: "4%" }}>
                            <div className="text-sm breadcrumbs ml-4">
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
                                    <li>
                                        <a className="inline-flex gap-2 items-center" href={`/disciplines/${params.disciplineId}/redactor`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                            Add Document
                                        </a>
                                    </li>
                                    <li>
                                        <span className="inline-flex gap-2 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            Add Element
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style={{ height: "96%" }}>
                            <DisciplineContext.Provider value={params.disciplineId}>
                                <GraphRedactor />
                            </DisciplineContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
