"use client";

import { Background, BackgroundVariant, ReactFlow, type Edge, type EdgeTypes, type Node, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useMemo, useState } from "react";
import { products, type ProductId } from "@/content/products";
import type { Dictionary } from "@/i18n/dictionaries";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { NODE_H, NODE_W, ProductNode, STUDIO_H, STUDIO_W, StudioNode, type ProductFlowNode, type StudioFlowNode } from "./ProductNode";
import { SignalEdge } from "./SignalEdge";

const nodeTypes: NodeTypes = { product: ProductNode, studio: StudioNode };
const edgeTypes: EdgeTypes = { signal: SignalEdge };

interface ProductMapProps {
  dict: Dictionary;
  /** Product whose row is currently in view. */
  active: ProductId | null;
  onSelect: (id: ProductId) => void;
  entered: boolean;
  className?: string;
}

// One wide band: three products above the studio, three below. Every node
// is fully readable at this size; the map is a table of contents.
const GAP_X = 150;
const ROW_TOP = 0;
const ROW_BOTTOM = 200;
const COL = (i: number) => i * (NODE_W + GAP_X);
const STUDIO_X = COL(1) + NODE_W / 2 - STUDIO_W / 2;
const STUDIO_Y = (ROW_TOP + NODE_H + ROW_BOTTOM) / 2 - STUDIO_H / 2;

export function ProductMap({ dict, active, onSelect, entered, className = "" }: ProductMapProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo<Node[]>(() => {
    const top = products.slice(0, 3);
    const bottom = products.slice(3, 6);
    const place = (list: typeof products, y: number, offset: number): ProductFlowNode[] =>
      list.map((p, i) => ({
        id: p.id,
        type: "product",
        position: { x: COL(i), y },
        draggable: false,
        selectable: false,
        focusable: false,
        data: {
          id: p.id,
          name: p.name,
          latinName: p.latinName,
          status: p.release?.tag ?? (p.live ? "live" : "wip"),
          live: p.live,
          cobuilt: p.ownership === "cobuilt",
          active: active === p.id,
          entered,
          delay: 120 + (offset + i) * 70,
          onSelect,
        },
      }));
    const studio: StudioFlowNode = {
      id: "studio",
      type: "studio",
      position: { x: STUDIO_X, y: STUDIO_Y },
      draggable: false,
      selectable: false,
      focusable: false,
      data: { title: dict.products.studioNode.title, subtitle: dict.products.studioNode.subtitle, entered },
    };
    return [studio, ...place(top, ROW_TOP, 0), ...place(bottom, ROW_BOTTOM, 3)];
  }, [dict, active, entered, onSelect]);

  const edges = useMemo<Edge[]>(
    () =>
      products.map((p, i) => {
        const isActive = active === p.id;
        const hot = hovered === p.id;
        const topRow = i < 3;
        const cobuilt = p.ownership === "cobuilt";
        return {
          id: `studio-${p.id}`,
          source: "studio",
          target: p.id,
          sourceHandle: topRow ? "top" : "bottom",
          targetHandle: topRow ? "in-bottom" : "in-top",
          type: "signal",
          data: { signal: (isActive || hot) && entered, hot, reduced },
          focusable: false,
          selectable: false,
          className: [cobuilt ? "is-example" : "", isActive ? "is-active" : "", hot ? "is-hot" : ""].join(" ").trim(),
          interactionWidth: 14,
          ariaLabel: cobuilt ? dict.products.legend.cobuilt : dict.products.legend.own,
          style: { strokeWidth: 1.25 },
        };
      }),
    [dict, active, hovered, entered, reduced],
  );

  return (
    <div className={`${className} ${entered ? "rf-enter" : ""}`} role="group" aria-label={dict.products.mapAria}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.3}
        maxZoom={1.2}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        disableKeyboardA11y
        autoPanOnNodeFocus={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          if (node.type === "product") onSelect(node.id as ProductId);
        }}
        onNodeMouseEnter={(_, node) => setHovered(node.id)}
        onNodeMouseLeave={() => setHovered(null)}
        colorMode="dark"
        nodeOrigin={[0, 0]}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} />
      </ReactFlow>
    </div>
  );
}
