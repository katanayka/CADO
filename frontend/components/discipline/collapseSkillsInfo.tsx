'use client'
import { EnsembleTree } from "@/services/treeSctructure";
import { FC, useState } from "react";
import CollapseMenu from "./collapseMenu";

interface Props {
    data: EnsembleTree<any> | null;
    accessToEdit: boolean;
    userProgress: any;
}

export const CollapseSkillsInfo: FC<Props> = ({ data, accessToEdit, userProgress }) => {
    const [userProgressState, setUserProgressState] = useState(userProgress);

    return (
        <div>
            <hr/>
            {(data) ? data.trees.map((tree, index) =>
                <div key={`${tree.root?.id}_`}>
                    <CollapseMenu 
                        node={tree.root} 
                        accessToEdit={accessToEdit} 
                        userProgress={userProgressState} 
                        setUserProgress={setUserProgressState} 
                    />
                    <hr />
                </div>
            ) : null}
        </div>
    );
}

export default CollapseSkillsInfo;
