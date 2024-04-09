import React from 'react'

interface ParamProps {
    disciplineId: string;
    nodeId: string;
}

export default function Page({ params }: Readonly<{ params: ParamProps }>) {
    return (
        <>
            <div>page</div>
            <p>
                params.disciplineId: {
                    params.disciplineId
                }
            </p>
            <p>
                params.nodeId: {
                    params.nodeId
                }
            </p>
        </>
    )
}
