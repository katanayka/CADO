import Link from 'next/link'
import React from 'react'
import Progress_bar from './progress_bar'

type Props = {
    key: string;
    Discipline: string;
}

export default function discipline_card({ key, Discipline }: Props) {
    return (
        <div className="big-tile h-48 w-full flex justify-between text-l" key={key}>
            <div>
                <h2>Дисциплина:
                    <p className="font-bold text-2xl">
                        {key}
                    </p>
                </h2>
                <Link
                    href="/disciplines/[disciplineId]"
                    as={`/disciplines/${Discipline}`}
                    className="text-blue-500 underline hover:text-blue-700 hover:no-underline rounded-md"
                >
                    Перейти к дисциплине
                </Link>
            </div>
            <div className='flex flex-col justify-between w-1/3 h-[30%] dir-column mt-auto mb-4'>
                <div>
                    <label>Прогресс изучения дисциплины:</label>
                    <Progress_bar value={50} />
                </div>
                <div>
                    <label>Время на изучение:</label>
                    <Progress_bar value={25} />
                </div>
            </div>
        </div>
    )
}
