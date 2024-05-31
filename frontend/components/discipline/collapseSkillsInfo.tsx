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

    const handleNextClick = () => {
        setCurrentValue(prevValue => prevValue + 1);
    };

    const handlePrevClick = () => {
        setCurrentValue(prevValue => prevValue - 1);
    };

    return (
        <div>
            <hr />
            <button
                onClick={handlePrevClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                prev
            </button>
            <button
                onClick={handleNextClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                next
            </button>
            {data ? data.trees.map((tree, index) =>
                <div key={`${tree.root?.id}_`}>
                    <CollapseMenu
                        node={tree.root?.children[currentValue % (tree.root?.children?.length || 1)]}
                        accessToEdit={accessToEdit}
                        userProgress={userProgressState}
                        setUserProgress={setUserProgressState}
                    />
                    <hr />
                </div>
            ) : null}
        </div>
    );
};

export default CollapseSkillsInfo;