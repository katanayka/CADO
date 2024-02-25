import {Tree} from "@/services/treeSctructure";
import { FC } from "react";
import CollapseMenu from "./collapseMenu";

interface Props {
    nodes: any;
    edges: any;
}

export const CollapseSkillsInfo: FC<Props> = ({ nodes, edges }) => {
    const tree = new Tree();
    tree.convertDataToTree({
        "nodes": nodes,
        "edges": edges
    });
    console.log("Tree struct", tree);
    return (
        <div>
            {(tree.root) ? <CollapseMenu node={tree.root.children[0]} /> : null}
        </div>
    );
}

export default CollapseSkillsInfo;
