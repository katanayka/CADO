import React, { memo, useEffect, useState } from "react";
import { Handle, Position, NodeResizer, ResizeParams } from "reactflow";
import sizes_nodes from "@/public/sizes";
import { FileInput } from "react-daisyui";

type Props = {
    data: {
        id: string
        parentId: string;
        text: string;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        onAddNode: (position: { x: number; y: number }, id: string, posEdge: Boolean) => void;
        position: { x: number; y: number };
        video?: string;
        videoName: string;
    };
};

const allowedTypes = [
    "video/x-flv",
    "video/mp4",
    "application/x-mpegURL",
    "video/MP2T",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
]

const NodeVideo: React.FC<Props> = memo(({ data }) => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedVideoName, setSelectedVideoName] = useState<string>("");
    const [size, setSize] = useState({
        width: sizes_nodes.VideoNode.width,
        height: sizes_nodes.VideoNode.height
    });

    const videoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
    
        const fileType = String(files[0]?.type);
        console.log(fileType);
    
        if (allowedTypes.includes(fileType)) {
            // Convert video to base64 and apply to data video
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                setSelectedVideo(reader.result as string);
                setSelectedVideoName(files[0].name);
                data.video = reader.result as string;
                data.videoName = files[0].name;
            };
        }
    };

    return (
        <>
            <NodeResizer isVisible={true} minWidth={sizes_nodes.VideoNode.width} minHeight={sizes_nodes.VideoNode.height} keepAspectRatio={true} />
            <div className="border-solid border-2 rounded border-black p-2 column text-center bg-white" style={{ width: 192, height: 192 }}>
                {selectedVideo === null ? (
                    <FileInput className="w-full h-full" bordered={true} onChange={videoHandler} />
                ) : (
                    <>
                        <span className=" h-2/6 text-center text-sm">
                            {selectedVideoName}
                        </span>
                        <video className="w-full border" controls>
                            <source src={selectedVideo} />
                        </video>
                    </>
                )}

                <Handle id="top" type="target" position={Position.Top} className="" />
                <Handle id="left" type="target" position={Position.Left} className="" />
                <Handle id="right" type="source" position={Position.Right} className="" />
                <Handle id="bottom" type="source" position={Position.Bottom} className="" />
            </div>

        </>
    )
});

NodeVideo.displayName = 'NodeVideoRedact';

export default NodeVideo;