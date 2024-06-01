'use client'
import { EnsembleTree } from "@/services/treeSctructure";
import { FC, useState } from "react";
import CollapseMenu from "./collapseMenu";

interface Props {
    data: EnsembleTree<any> | null;
    accessToEdit: boolean;
    userProgress: any;
}

const CollapseSkillsInfo: FC<Props> = ({ data, accessToEdit, userProgress }) => {
    const [userProgressState, setUserProgressState] = useState(userProgress);
    const [currentValue, setCurrentValue] = useState(0);

    const handleTitleClick = (index: number) => {
        setCurrentValue(index);
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const getVisibleChildren = (children: any[], currentIndex: number, pageSize: number) => {
        const startIndex = Math.max(0, currentIndex - Math.floor(pageSize / 2));
        const endIndex = Math.min(children.length, startIndex + pageSize);
        return children.slice(startIndex, endIndex);
    };

    const pageSize = 9;

    return (
        <div>
            <hr />
            <div className="flex space-x-2">
                {data?.trees.map((tree) =>
                    tree.root?.children && getVisibleChildren(tree.root.children, currentValue, pageSize).map((child, index) => {
                        const childIndex = tree.root?.children.indexOf(child);
                        const isSelected = childIndex === currentValue;
                        return (
                            <button
                                key={`${tree.root?.id}_${index}`}
                                onClick={() => handleTitleClick(tree.root?.children?.indexOf(child) as number)}
                                className={`bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded ${isSelected ? 'bg-gray-400 text-white' : ''}`}
                            >
                                {truncateText(child?.data.text || `Title ${index + 1}`, 29)}
                            </button>
                        );
                    })
                )}
            </div>
            <hr />
            {data?.trees.map((tree) =>
                tree.root?.children && (
                    <div key={`${tree.root?.id}_`}>
                        <CollapseMenu
                            node={tree.root.children[currentValue % (tree.root.children?.length || 1)]}
                            accessToEdit={accessToEdit}
                            userProgress={userProgressState}
                            setUserProgress={setUserProgressState}
                        />
                        <hr />
                    </div>
                )
            )}
        </div>
    );
};

export default CollapseSkillsInfo;
