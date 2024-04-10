import { EnsembleTree } from "@/services/treeSctructure";
import { FC } from "react";
import CollapseMenu from "./collapseMenu";

interface Props {
    data: EnsembleTree<any> | null;
    accessToEdit: boolean;
}

export const CollapseSkillsInfo: FC<Props> = ({ data, accessToEdit }) => {
    return (
        <div>
            <hr/>
            {(data) ? data.trees.map((tree, index) =>
                <div key={`${tree.root?.id}_`}>
                    <CollapseMenu node={tree.root} accessToEdit={accessToEdit} />
                    <hr />
                </div>
            ) : null}
        </div>
    );
}

export default CollapseSkillsInfo;
