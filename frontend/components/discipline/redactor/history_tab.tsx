import React from 'react'
import { Button, Collapse } from 'react-daisyui'

interface HistoryTabProps {
    historyList: React.MutableRefObject<any>
}

export default function HistoryTab({ historyList }: HistoryTabProps) {
    return (
        <div className='absolute top-12 right-12 w-1/6 border-2 bg-white rounded-md'>
            <Collapse checkbox={true} icon='arrow'>
                <Collapse.Title className="text-xl font-medium">
                    История
                </Collapse.Title>
                <Collapse.Content>
                    <div className='overflow-auto max-h-96'>
                        {historyList.current.map((item: any) => {
                            return (
                                <div key={item.id} className='p-1 border-b-2 border-slate-500'>
                                    <div className=' flex'>
                                        <div className='flex-1'>
                                            {`${item.action === 'add' || 'Edge created' ? 'Создано' : item.action === 'update' ? 'Изменено' : 'Удалено'} ${item.id}`}
                                        </div>
                                        <div className='flex-2'>
                                            <Button size='xs' shape='circle' onClick={() => console.log('revert action')} className='flex items-center justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 23 23" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Collapse.Content>
            </Collapse>
        </div>
    )
}
