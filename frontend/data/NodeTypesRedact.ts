import RewritableNode from "@/components/discipline/redactor/customNodes/redact/Rewritablenode";
import VideoNode from "@/components/discipline/redactor/customNodes/redact/NodeVideo";
import EditNode from "@/components/discipline/redactor/customNodes/redact/EditNode";


const nodeTypesRedact = {
	Rewritable: RewritableNode,
    Video: VideoNode,
    Edit: EditNode
};

export default nodeTypesRedact;