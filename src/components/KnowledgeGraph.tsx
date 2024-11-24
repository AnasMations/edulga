import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
}

interface Props {
  className?: string;
  data: NestedTopic | { subject: string; topics: NestedTopic[] };
}

const NestedKnowledgeGraph: React.FC<Props> = ({ className, data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 2000, height: 1500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const processNestedData = (
    nestedData: NestedTopic | { subject: string; topics: NestedTopic[] },
    parentId: string | null = null
  ): Node[] => {
    const nodes: Node[] = [];
    const processNode = (
      item: NestedTopic,
      parentId: string | null,
      prefix: string
    ) => {
      const nodeId = `${prefix}-${item.title || item.topic || ''}`;
      const nodeLabel = item.title || item.topic || '';
      const description = item.definition?.title || '';
      const node: Node = {
        id: nodeId,
        label: nodeLabel,
        description,
        edges: parentId ? [parentId] : []
      };
      nodes.push(node);

      // Process nested topics
      const nestedTopics = item.definition?.topics || item.topics || [];
      nestedTopics.forEach((topic, index) => {
        processNode(topic, nodeId, `${prefix}-${index}`);
      });
    };

    if ('subject' in nestedData) {
      // Root node for the subject
      const rootNode: Node = {
        id: 'root',
        label: nestedData.subject,
        description: '',
        edges: []
      };
      nodes.push(rootNode);

      // Process top-level topics
      nestedData.topics.forEach((topic, index) => {
        processNode(topic, 'root', `topic-${index}`);
      });
    } else {
      processNode(nestedData as NestedTopic, parentId, 'topic');
    }

    return nodes;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = 2000;
    const height = 1500;
    const baseNodeRadius = 40;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const nodes = processNestedData(data);
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const nodeSizes = new Map<string, number>();
    
    nodes.forEach(node => {
      // Adjust size based on whether it's a root, main topic, or subtopic
      const depth = node.id.split('-').length;
      const size = baseNodeRadius + (50 / depth);
      nodeSizes.set(node.id, size);
    });

    const nodePositions = calculateNodePositions(nodes, width, height, nodeSizes);

    // Draw edges
    nodes.forEach(node => {
      node.edges.forEach(edgeId => {
        const startPos = nodePositions.get(node.id);
        const endPos = nodePositions.get(edgeId);
        if (startPos && endPos) {
          drawLine(svg, startPos, endPos);
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      const size = nodeSizes.get(node.id) || baseNodeRadius;
      if (pos) {
        drawNode(svg, pos, size, node.label, node, setHoveredNode);
      }
    });
  }, [data]);

  const calculateNodePositions = (
    nodes: Node[],
    width: number,
    height: number,
    nodeSizes: Map<string, number>
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const centerX = width / 2;
    const centerY = height / 2;

    // Position root node at center
    const rootNode = nodes.find(n => n.id === 'root');
    if (rootNode) {
      positions.set(rootNode.id, { x: centerX, y: centerY });
    }

    // Organize nodes by depth
    const nodesByDepth = new Map<number, Node[]>();
    nodes.forEach(node => {
      const depth = node.id.split('-').length;
      if (!nodesByDepth.has(depth)) {
        nodesByDepth.set(depth, []);
      }
      nodesByDepth.get(depth)?.push(node);
    });

    // Position nodes in concentric circles based on depth
    nodesByDepth.forEach((depthNodes, depth) => {
      if (depth === 1) return; // Skip root node
      
      const radius = depth * 200;
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

  const drawLine = (
    svg: SVGSVGElement,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', start.x.toString());
    line.setAttribute('y1', start.y.toString());
    line.setAttribute('x2', end.x.toString());
    line.setAttribute('y2', end.y.toString());
    line.setAttribute('stroke', '#4B5563');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  };

  const drawNode = (
    svg: SVGSVGElement,
    position: { x: number; y: number },
    radius: number,
    label: string,
    node: Node,
    setHovered: (node: Node | null) => void
  ) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', position.x.toString());
    circle.setAttribute('cy', position.y.toString());
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', '#2563EB');
    circle.setAttribute('stroke', '#1E40AF');
    circle.setAttribute('stroke-width', '2');
    
    // Add hover effects
    circle.addEventListener('mouseenter', () => {
      circle.setAttribute('fill', '#1E40AF');
      setHovered(node);
    });
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('fill', '#2563EB');
      setHovered(null);
    });
    
    group.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', position.x.toString());
    text.setAttribute('y', position.y.toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', `${Math.max(10, radius / 3)}px`);
    
    // Break long text into multiple lines
    const words = label.split(' ');
    const lineHeight = Math.max(12, radius / 3);
    let line = '';
    let yOffset = 0;
    
    words.forEach((word, index) => {
      if (line.length + word.length > 15) {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line;
        tspan.setAttribute('x', position.x.toString());
        tspan.setAttribute('dy', index === 0 ? `-${lineHeight}px` : `${lineHeight}px`);
        text.appendChild(tspan);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
      
      if (index === words.length - 1) {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line;
        tspan.setAttribute('x', position.x.toString());
        tspan.setAttribute('dy', text.childNodes.length === 0 ? '0' : `${lineHeight}px`);
        text.appendChild(tspan);
      }
    });
    
    group.appendChild(text);
    svg.appendChild(group);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;

    setViewBox(vb => ({
      ...vb,
      x: vb.x - dx * 2,
      y: vb.y - dy * 2
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const newScale = scale * zoomFactor;

    if (newScale < 0.1 || newScale > 10) return;

    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const svgPoint = svgRef.current!.createSVGPoint();
    svgPoint.x = mouseX;
    svgPoint.y = mouseY;
    const pointInGraph = svgPoint.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());

    setViewBox(vb => ({
      x: pointInGraph.x - (mouseX / newScale) * (vb.width / svgRef.current!.clientWidth),
      y: pointInGraph.y - (mouseY / newScale) * (vb.height / svgRef.current!.clientHeight),
      width: vb.width / zoomFactor,
      height: vb.height / zoomFactor
    }));

    setScale(newScale);
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className={twMerge('bg-gray-900', className)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <h3 className="font-bold text-lg">{hoveredNode.label}</h3>
          {hoveredNode.description && (
            <p className="mt-2 text-gray-600">{hoveredNode.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NestedKnowledgeGraph;