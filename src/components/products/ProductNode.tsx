"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";
import type { ProductId } from "@/content/products";
import { Symbol } from "@/components/brand/Wordmark";

export type ProductNodeData = {
  id: ProductId;
  name: string;
  latinName?: string;
  /** Short, never truncated: version tag or a one-word state. */
  status: string;
  live: boolean;
  cobuilt: boolean;
  active: boolean;
  entered: boolean;
  delay: number;
  onSelect: (id: ProductId) => void;
};

export type StudioNodeData = {
  title: string;
  subtitle: string;
  entered: boolean;
};

export type ProductFlowNode = Node<ProductNodeData, "product">;
export type StudioFlowNode = Node<StudioNodeData, "studio">;

export const NODE_W = 196;
export const NODE_H = 58;
export const STUDIO_W = 128;
export const STUDIO_H = 58;

/** A node is a jump link: name, Latin name, status. Nothing to truncate. */
export function ProductNode({ data }: NodeProps<ProductFlowNode>) {
  const { name, latinName, status, live, cobuilt, active, entered, delay, onSelect, id } = data;
  // The entrance keyframe fills forwards and would override the hover lift,
  // so its class is removed once it has played.
  const [settled, setSettled] = useState(false);
  const enterClass = !entered ? "opacity-0" : settled ? "" : "rf-node-enter";
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="target" position={Position.Right} id="in-right" isConnectable={false} />
      <Handle type="target" position={Position.Top} id="in-top" isConnectable={false} />
      <Handle type="target" position={Position.Bottom} id="in-bottom" isConnectable={false} />
      <button
        type="button"
        className={`product-node nodrag nopan ${enterClass}`}
        style={{ width: NODE_W, height: NODE_H, ["--enter-delay" as string]: `${delay}ms` }}
        onAnimationEnd={() => setSettled(true)}
        aria-current={active ? "true" : undefined}
        data-active={active}
        data-cobuilt={cobuilt}
        onClick={() => onSelect(id)}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-[560] tracking-[-0.01em] text-text">{name}</span>
            {latinName && <span className="mono text-[11px] text-text-3">{latinName}</span>}
          </span>
          <span className="status-dot" data-live={live} aria-hidden="true" />
        </span>
        <span className="mono mt-1 block text-[11px] text-text-3">{status}</span>
      </button>
    </>
  );
}

export function StudioNode({ data }: NodeProps<StudioFlowNode>) {
  return (
    <>
      <Handle type="source" position={Position.Top} id="top" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={false} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={false} />
      <Handle type="source" position={Position.Right} id="right" isConnectable={false} />
      <div className={`studio-node ${data.entered ? "rf-node-enter" : "opacity-0"}`} style={{ width: STUDIO_W, height: STUDIO_H }}>
        <Symbol size={18} />
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-[600] tracking-[-0.03em] text-text">{data.title}</span>
          <span className="mono mt-1 text-[10.5px] text-text-3">{data.subtitle}</span>
        </span>
      </div>
    </>
  );
}
