'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapse, Progress } from 'react-daisyui';
import { HiPencil } from 'react-icons/hi';
import CollapseMenuTrackerRow from './collapseMenuTrackerRow';
import { useEffect, useState } from 'react';
import AnimatedRadialProgress from './animatedRadialProgress';


const CollapseMenu = ({ node, accessToEdit, userProgress, setUserProgress }: { node: any, accessToEdit: boolean, userProgress: any, setUserProgress: (userProgress: any) => void }) => {
    const router = usePathname();
    const [progressValue, setProgressValue] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const handleCheckboxChange = (itemId: string, checked: boolean) => {
        // Update `userProgress` with the new checkbox value
        setUserProgress({
            ...userProgress,
            [node.data.text]: {
                ...(userProgress[node.data.text] || {}),
                [itemId]: checked
            }
        });
    };

    useEffect(() => {
        const totalItems = node?.data?.theory?.length + node?.data?.practice?.length || 0;
        setTotalItems(totalItems);
        const checkedItems = [...(node?.data?.theory || []), ...(node?.data?.practice || [])].filter(item => userProgress[node.data.text] && userProgress[node.data.text][item]).length;
        const progressValue = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0
        setProgressValue(progressValue);
        console.log(progressValue)
    }, [userProgress]);

    let theoryList = node.data.theory;
    let practiceList = node.data.practice;
    if (theoryList || practiceList) {
        const node_name = (node.data.text)
        theoryList = theoryList.map((item: string) => {
            return {
                [item]: userProgress[node_name] ? userProgress[node_name][item] : false
            }
        });
    }
    const disciplineId = router.split('/')[2];
    return (
        <Collapse icon="arrow" checkbox={true}>
            <Collapse.Title className="text-s font-medium flex justify-between items-center">
                {node.data.text ? node.data.text : null}
                <div className='flex gap-2 items-center'>
                    {totalItems > 0 &&
                        <progress value={progressValue} max="100" className="progress transition-all duration-300 ease-in-out" />
                    }
                    {accessToEdit &&
                        <Link
                            href={`/disciplines/[disciplineId]/edit/[nodeId]`}
                            as={`/disciplines/${disciplineId}/edit/${node.id}`}
                            className="text-blue-500 hover:text-blue-700 btn-ghost rounded-full p-1 z-10 transition-colors"
                        >
                            <HiPencil />
                        </Link>
                    }
                </div>
            </Collapse.Title>
            <Collapse.Content className='right-0 p-0 pl-4 rounded-lg'>
                {node.data.inside ?
                    (<p>
                        {node.data.inside}
                    </p>)
                    : null}
                {(node.data.theory?.length > 0 || node.data.practice?.length > 0) ?
                    (
                        <>
                            <span className='font-bold text-lg mb-2 block'>
                                Чеклист:
                            </span>

                            <div className='p-2 bg-gray-100 rounded-lg mb-2 flex justify-between'>
                                <div>
                                    {node.data.theory.length > 0 &&
                                        <>
                                            <p>
                                                Вы знаете теорию, если:
                                            </p>
                                            {node.data.theory.map((item: string, index: number) => (
                                                <CollapseMenuTrackerRow key={index} item={item} ndt={node.data.text} checkedValue={userProgress[node.data.text] ? userProgress[node.data.text][item] : false} onCheckboxChange={(checked: boolean) => handleCheckboxChange(item, checked)} />
                                            ))}
                                        </>
                                    }
                                    {node.data.practice.length > 0 &&
                                        <>
                                            <p>
                                                Вы освоили практику, если:
                                            </p>
                                            {node.data.practice.map((item: string, index: number) => (
                                                <CollapseMenuTrackerRow key={index} item={item} ndt={node.data.text} checkedValue={userProgress[node.data.text] ? userProgress[node.data.text][item] : false} onCheckboxChange={(checked: boolean) => handleCheckboxChange(item, checked)} />
                                            ))}
                                        </>
                                    }
                                </div>
                                <div>
                                    <AnimatedRadialProgress value={progressValue} />
                                </div>
                            </div>
                        </>
                    )
                    : null}
                {node.children.map((child: any) => (
                    <CollapseMenu
                        key={child.id}
                        node={child}
                        accessToEdit={accessToEdit}
                        userProgress={userProgress}
                        setUserProgress={setUserProgress} />
                ))}
            </Collapse.Content>
        </Collapse>
    );
};

export default CollapseMenu;
