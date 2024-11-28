import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { RefreshCw } from "lucide-react";

interface NestedTopic {
  title?: string;
  topic?: string;
  definition?: {
    title?: string;
    topics?: NestedTopic[];
  };
  topics?: NestedTopic[];
}

interface Node {
  id: string;
  label: string;
  description: string;
  edges: string[];
  depth: number;
}

interface Props {
  className?: string;
  data: NestedTopic | { subject: string; topics: NestedTopic[] };
}

interface ViewportState {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

const INITIAL_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  width: 2000,
  height: 1500,
  scale: 1,
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SPEED = 0.005;
const ZOOM_SMOOTH_FACTOR = 0.3;

const NestedKnowledgeGraph: React.FC<Props> = ({ className, data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportState>(INITIAL_VIEWPORT);
  const [targetViewport, setTargetViewport] =
    useState<ViewportState>(INITIAL_VIEWPORT);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const animationFrameRef = useRef<number>();

  const getColorForDepth = (depth: number): string => {
    const colors = [
      "#FF4086", // Root - Pink
      "#FF5E86",
      "#FF7C86",
      "#FF9A86",
      "#FFB886",
      "#FFCB86", // Deepest - Yellow
    ];
    return colors[Math.min(depth, colors.length - 1)];
  };

  const getSizeForDepth = (depth: number): number => {
    const baseSize = 120;
    const scaleFactor = 0.8;
    return baseSize * Math.pow(scaleFactor, depth - 1);
  };

  const processNestedData = (
    nestedData: NestedTopic | { subject: string; topics: NestedTopic[] },
    parentId: string | null = null,
    currentDepth: number = 0
  ): Node[] => {
    const nodes: Node[] = [];
    const processNode = (
      item: NestedTopic,
      parentId: string | null,
      prefix: string,
      depth: number
    ) => {
      const nodeId = `${prefix}-${item.title || item.topic || ""}`;
      const nodeLabel = item.title || item.topic || "";
      const description = item.definition?.title || "";
      const node: Node = {
        id: nodeId,
        label: nodeLabel,
        description,
        edges: parentId ? [parentId] : [],
        depth,
      };
      nodes.push(node);

      const nestedTopics = item.definition?.topics || item.topics || [];
      nestedTopics.forEach((topic, index) => {
        processNode(topic, nodeId, `${prefix}-${index}`, depth + 1);
      });
    };

    if ("subject" in nestedData) {
      const rootNode: Node = {
        id: "root",
        label: nestedData.subject,
        description: "",
        edges: [],
        depth: 0,
      };
      nodes.push(rootNode);

      nestedData.topics.forEach((topic, index) => {
        processNode(topic, "root", `topic-${index}`, 1);
      });
    } else {
      // Check if this is "The Brain" topic and set it as root
      if ((nestedData as NestedTopic).title === "The Brain") {
        const rootNode: Node = {
          id: "root",
          label: (nestedData as NestedTopic).title,
          description: (nestedData as NestedTopic).definition?.title || "",
          edges: [],
          depth: 0,
        };
        nodes.push(rootNode);

        const nestedTopics =
          (nestedData as NestedTopic).definition?.topics || [];
        nestedTopics.forEach((topic, index) => {
          processNode(topic, "root", `topic-${index}`, 1);
        });
      }
      processNode(nestedData as NestedTopic, parentId, "topic", currentDepth);
    }

    return nodes;
  };

  const drawLine = (
    svg: SVGSVGElement,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x.toString());
    line.setAttribute("y1", start.y.toString());
    line.setAttribute("x2", end.x.toString());
    line.setAttribute("y2", end.y.toString());
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("pointer-events", "none");
    svg.appendChild(line);
  };

  const drawNode = (
    svg: SVGSVGElement,
    position: { x: number; y: number },
    radius: number,
    label: string,
    node: Node,
    setHovered: (node: Node | null) => void,
    color: string
  ) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("pointer-events", "bounding-box");

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", position.x.toString());
    circle.setAttribute("cy", position.y.toString());
    circle.setAttribute("r", radius.toString());
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "2");

    circle.addEventListener("mouseenter", () => {
      circle.setAttribute("fill", color);
      circle.setAttribute("filter", "brightness(0.8)");
      setHovered(node);
    });
    circle.addEventListener("mouseleave", () => {
      circle.setAttribute("fill", color);
      circle.setAttribute("filter", "none");
      setHovered(null);
    });

    group.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", position.x.toString());
    text.setAttribute("y", position.y.toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("pointer-events", "none");

    const fontSize = Math.max(12, radius / 4);
    text.setAttribute("font-size", `${fontSize}px`);

    const words = label.split(" ");
    const maxCharsPerLine = Math.floor(radius / (fontSize * 0.3));
    let line = "";
    let yOffset = -fontSize;

    words.forEach((word, index) => {
      if (line.length + word.length > maxCharsPerLine) {
        const tspan = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );
        tspan.textContent = line;
        tspan.setAttribute("x", position.x.toString());
        tspan.setAttribute("dy", index === 0 ? "0" : `${fontSize}px`);
        tspan.setAttribute("pointer-events", "none");
        text.appendChild(tspan);
        line = word;
        yOffset += fontSize;
      } else {
        line = line ? `${line} ${word}` : word;
      }

      if (index === words.length - 1) {
        const tspan = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );
        tspan.textContent = line;
        tspan.setAttribute("x", position.x.toString());
        tspan.setAttribute(
          "dy",
          text.childNodes.length === 0 ? "0" : `${fontSize}px`
        );
        tspan.setAttribute("pointer-events", "none");
        text.appendChild(tspan);
      }
    });

    const totalHeight = yOffset + fontSize;
    const startY = position.y - totalHeight / 2;
    text.setAttribute("y", startY.toString());

    group.appendChild(text);
    svg.appendChild(group);
  };

  const calculateNodePositions = (
    nodes: Node[],
    width: number,
    height: number,
    nodeSizes: Map<string, number>
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const centerX = width / 2;
    const centerY = height / 2;

    const rootNode = nodes.find((n) => n.id === "root");
    if (rootNode) {
      positions.set(rootNode.id, { x: centerX, y: centerY });
    }

    const nodesByDepth = new Map<number, Node[]>();
    nodes.forEach((node) => {
      if (!nodesByDepth.has(node.depth)) {
        nodesByDepth.set(node.depth, []);
      }
      nodesByDepth.get(node.depth)?.push(node);
    });

    nodesByDepth.forEach((depthNodes, depth) => {
      if (depth === 0) return;

      const radius = depth * 800;
      const angleStep = (2 * Math.PI) / depthNodes.length;

      depthNodes.forEach((node, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.set(node.id, { x, y });
      });
    });

    return positions;
  };

  useEffect(() => {
    const animate = () => {
      setViewport((current) => {
        const dx = (targetViewport.x - current.x) * ZOOM_SMOOTH_FACTOR;
        const dy = (targetViewport.y - current.y) * ZOOM_SMOOTH_FACTOR;
        const dw = (targetViewport.width - current.width) * ZOOM_SMOOTH_FACTOR;
        const dh =
          (targetViewport.height - current.height) * ZOOM_SMOOTH_FACTOR;
        const ds = (targetViewport.scale - current.scale) * ZOOM_SMOOTH_FACTOR;

        const newViewport = {
          x: (current.x + dx) / 2,
          y: (current.y + dy) / 2,
          width: current.width + dw,
          height: current.height + dh,
          scale: current.scale + ds,
        };

        if (
          Math.abs(dx) < 0.1 &&
          Math.abs(dy) < 0.1 &&
          Math.abs(dw) < 0.1 &&
          Math.abs(dh) < 0.1 &&
          Math.abs(ds) < 0.001
        ) {
          return targetViewport;
        }

        return newViewport;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetViewport]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!svgRef.current) return;

      const zoomDelta = -e.deltaY * ZOOM_SPEED;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, targetViewport.scale * (1 + zoomDelta))
      );
      const scaleFactor = newScale / targetViewport.scale;

      // Calculate the point to zoom towards (center of viewport)
      const viewportCenterX = targetViewport.x + targetViewport.width / 2;
      const viewportCenterY = targetViewport.y + targetViewport.height / 2;

      setTargetViewport((current) => ({
        ...current,
        x: viewportCenterX - (viewportCenterX - current.x) / scaleFactor,
        y: viewportCenterY - (viewportCenterY - current.y) / scaleFactor,
        width: current.width / scaleFactor,
        height: current.height / scaleFactor,
        scale: newScale,
      }));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [targetViewport]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 2000;
    const height = 1500;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const nodes = processNestedData(data);
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const nodeSizes = new Map<string, number>();

    nodes.forEach((node) => {
      const size = getSizeForDepth(node.depth);
      nodeSizes.set(node.id, size);
    });

    const nodePositions = calculateNodePositions(
      nodes,
      width,
      height,
      nodeSizes
    );

    nodes.forEach((node) => {
      node.edges.forEach((edgeId) => {
        const startPos = nodePositions.get(node.id);
        const endPos = nodePositions.get(edgeId);
        if (startPos && endPos) {
          drawLine(svg, startPos, endPos);
        }
      });
    });

    nodes.forEach((node) => {
      const pos = nodePositions.get(node.id);
      const size = nodeSizes.get(node.id) || 40;
      if (pos) {
        drawNode(
          svg,
          pos,
          size,
          node.label,
          node,
          setHoveredNode,
          getColorForDepth(node.depth)
        );
      }
    });
  }, [data]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = ((e.clientX - dragStart.x) / targetViewport.scale) * 10;
    const dy = ((e.clientY - dragStart.y) / targetViewport.scale) * 10;

    setTargetViewport((current) => ({
      ...current,
      x: current.x - dx,
      y: current.y - dy,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setTargetViewport(INITIAL_VIEWPORT);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
        className={twMerge(
          "bg-gray-900 cursor-grab select-none",
          isDragging && "cursor-grabbing",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />

      {/* Hover Information Card */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-10 animate-fade-in">
          <h3 className="font-bold text-lg text-gray-900">
            {hoveredNode.label}
          </h3>
          {hoveredNode.description && (
            <p className="mt-2 text-gray-600">{hoveredNode.description}</p>
          )}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => {
              const newScale = Math.min(MAX_SCALE, targetViewport.scale * 2);
              const scaleFactor = newScale / targetViewport.scale;
              setTargetViewport((current) => ({
                ...current,
                x: current.x + (current.width / 2) * (1 - 1 / scaleFactor),
                y: current.y + (current.height / 2) * (1 - 1 / scaleFactor),
                width: current.width / scaleFactor,
                height: current.height / scaleFactor,
                scale: newScale,
              }));
            }}
            className="p-2 hover:bg-gray-100 transition-colors duration-200"
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="w-full h-px bg-gray-200" />
          <button
            onClick={() => {
              const newScale = Math.max(MIN_SCALE, targetViewport.scale / 2);
              const scaleFactor = newScale / targetViewport.scale;
              setTargetViewport((current) => ({
                ...current,
                x: current.x + (current.width / 2) * (1 - 1 / scaleFactor),
                y: current.y + (current.height / 2) * (1 - 1 / scaleFactor),
                width: current.width / scaleFactor,
                height: current.height / scaleFactor,
                scale: newScale,
              }));
            }}
            className="p-2 hover:bg-gray-100 transition-colors duration-200"
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
          title="Reset View"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-sm text-gray-600">
        {Math.round(viewport.scale * 100)}%
      </div>
    </div>
  );
};

export default NestedKnowledgeGraph;
