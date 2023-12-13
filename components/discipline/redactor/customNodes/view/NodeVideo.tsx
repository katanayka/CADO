import React, { memo, useEffect, useState } from "react";
import { NodeResizer, ResizeParams } from "reactflow";
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
        video?: File | null;
        videoName: string;
    };
};

const NodeVideo: React.FC<Props> = memo(({ data }) => {
    const video = data.video;
    const videoType = data.video?.type;
    const videoName = data.videoName;
    return (
        <>
            <div className="border-solid border-2 rounded border-black p-2 column text-center bg-white"  style={{ width: 192, height: 192 }}>
                <>
                    <span className=" h-2/6 text-center text-sm">
                        {videoName}
                    </span>

                    <video className="w-full border" controls>
                        <source type={videoType} src={String(video)} />
                    </video>
                </>
            </div>
        </>
    )
});

NodeVideo.displayName = "NodeVideo";

export default NodeVideo;