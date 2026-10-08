"use client";

import { BaseEdge, getBezierPath, type Edge, type EdgeProps } from "@xyflow/react";

export type SignalEdgeData = {
  /** Draw a travelling signal along the edge. */
  signal: boolean;
  /** Faster, brighter signal while the pointer is on a connected node. */
  hot: boolean;
  reduced: boolean;
};

export type SignalFlowEdge = Edge<SignalEdgeData, "signal">;

/** A bezier edge with an SVG signal travelling along it when active. The
 *  signal is drawn with animateMotion, so it costs no JavaScript per frame. */
export function SignalEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, interactionWidth, data }: EdgeProps<SignalFlowEdge>) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const show = data?.signal && !data.reduced;
  const dur = data?.hot ? "1.1s" : "2.4s";
  return (
    <>
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} interactionWidth={interactionWidth} />
      {show && (
        <g aria-hidden="true">
          <circle r={data?.hot ? 3.2 : 2.4} fill="var(--accent-bright)">
            <animateMotion dur={dur} repeatCount="indefinite" path={path} />
          </circle>
          <circle r={data?.hot ? 7 : 5} fill="var(--accent)" opacity={0.18}>
            <animateMotion dur={dur} repeatCount="indefinite" path={path} />
          </circle>
        </g>
      )}
    </>
  );
}
