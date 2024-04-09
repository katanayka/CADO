import React, { useEffect } from 'react'

type NodeChangeModalProps = {
    selectedNode: {
        id: string;
        parentId: string;
        text: string;
        inside: string;
    }
    saveSelectedNode: (data: { id: string; parentId: string; text: string; inside: string }) => void
    closeModal: () => void
}

const NodeChangeModal: React.FC<NodeChangeModalProps> = ({ selectedNode, saveSelectedNode, closeModal }) => {
    const [node, setNode] = React.useState(selectedNode);
    useEffect(() => {
        setNode(selectedNode)
    }, [selectedNode])
    const changeNodeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNode({ ...node, text: e.currentTarget.value })
    }
    const changeNodeInside = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNode({ ...node, inside: e.currentTarget.value })
    }

    const saveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = { ...selectedNode }
        data.text = (e.currentTarget[0] as HTMLInputElement).value;
        data.inside = (e.currentTarget[1] as HTMLTextAreaElement).value;
        saveSelectedNode(data);
    }
    return (
        <div className='fixed z-10 overflow-y-auto w-96 h-[95%] bg-slate-400 p-4 rounded-lg shadow-lg top-0 right-[1%] mt-[1.25%] backdrop-filter backdrop-blur-sm bg-opacity-60'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-white'>Изменить узел</h1>
                <button className='text-white font-bold'
                    onClick={() => closeModal()}>
                    &times;
                </button>
            </div>
            <form className='flex flex-col gap-4 mt-4' onSubmit={saveSubmit}>
                <div className='flex flex-col gap-2'>
                    <label className='text-white'>
                        Название
                    </label>
                    <input type='text' className='p-2 bg-slate-500 text-white rounded-lg'
                        value={node.text}
                        onChange={changeNodeText} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-white'>
                        Содержание
                    </label>
                    <textarea className='p-2 bg-slate-500 text-white rounded-lg h-96'
                        value={node.inside}
                        onChange={changeNodeInside} />
                </div>
                <button type="submit" className='bg-slate-500 text-white p-2 rounded-lg mt-4'>
                    Save
                </button>
            </form>
        </div>

    )
}

export default NodeChangeModal
