import React, { memo } from "react";
import { Handle, Position } from "reactflow";

type Props = {
  data: {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

const RewritableNode: React.FC<Props> = memo(({ data }) => {
  return (
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white">
      <Handle type="target" position={Position.Top} />
      <div>
        Custom Rewritable Node: <strong>{data.text}</strong>
      </div>
      <input
        type="text"
        onChange={data.onChange}
        defaultValue={data.text}
        className="nodrag input input-bordered w-full max-w-xs"
      />
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1">
          Click
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </div>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
});

export default RewritableNode;
