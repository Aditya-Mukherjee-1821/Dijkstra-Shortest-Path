import React, { useState } from 'react';
import './App.css'; // Ensure you have the appropriate CSS
import { dijkstra } from './utils/helper';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newEdge, setNewEdge] = useState({ from: '', to: '', weight: '' });
  const [src, setSrc] = useState(0);
  const [dest, setDest] = useState(0);
  const [colouredEdges, setColouredEdges] = useState([]);

  const handleAddNode = () => {
    const newNodeId = nodes.length;
    const newNode = { id: newNodeId, value: newNodeId, x: 50, y: 50 };
    setNodes([...nodes, newNode]);
  };

  const handleMouseDown = (index, event) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;

    const handleMouseMove = (moveEvent) => {
      const newX = nodes[index].x + (moveEvent.clientX - startX);
      const newY = nodes[index].y + (moveEvent.clientY - startY);
      const updatedNodes = nodes.map((node, i) =>
        i === index ? { ...node, x: newX, y: newY } : node
      );
      setNodes(updatedNodes);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEdge({ ...newEdge, [name]: value });
  };

  const handleAddEdge = (e) => {
    e.preventDefault();
    const { from, to, weight } = newEdge;
    if (from !== '' && to !== '' && weight !== '') {
      const edge = {
        from: parseInt(from, 10),
        to: parseInt(to, 10),
        weight: parseInt(weight, 10),
      };
      setEdges([...edges, edge]);
      setNewEdge({ from: '', to: '', weight: '' });

      // Update nodes if new ones are introduced
      const nodeIds = new Set(nodes.map((node) => node.id));
      const newNodes = [];
      if (!nodeIds.has(edge.from)) {
        newNodes.push({ id: edge.from, value: edge.from, x: 50, y: 50 });
      }
      if (!nodeIds.has(edge.to)) {
        newNodes.push({ id: edge.to, value: edge.to, x: 100, y: 100 });
      }
      setNodes([...nodes, ...newNodes]);
    }
  };

  const handleShortestPath = () => {
    if (nodes.length === 0) {
      alert('Please add nodes first.');
      return;
    }
    if (src === dest) {
      alert('Source and Destination cannot be the same.');
      return;
    }

    let edgesList = edges.map((obj) => [obj.from, obj.to, obj.weight]);
    let shortestPathEdges = dijkstra(nodes.length, edgesList, src, dest);
    if(shortestPathEdges.length === 0){
      alert("No direct or indirect path exists between source and destination.")
      return;
    }

    // Map the shortest path edges to ensure correct rendering
    let mappedColouredEdges = shortestPathEdges
      .map((edge) => {
        const fromNode = nodes.find((node) => node.id === edge[0]);
        const toNode = nodes.find((node) => node.id === edge[1]);
        if (fromNode && toNode) {
          return { from: edge[0], to: edge[1], weight: edge[2] };
        }
        return null;
      })
      .filter(Boolean);

    // Highlight the shortest path edges
    setColouredEdges(mappedColouredEdges);
  };

  return (
    <div>
      <button
        class="btn btn-primary m-2"
        onClick={handleAddNode}
      >
        Add Node
      </button>
      <form onSubmit={handleAddEdge}>
        <div className="custom-form">
          <input
            className="form-control m-2"
            type="number"
            name="from"
            placeholder="From Node ID"
            value={newEdge.from}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-control m-2"
            type="number"
            name="to"
            placeholder="To Node ID"
            value={newEdge.to}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-control m-2"
            type="number"
            name="weight"
            placeholder="Edge Weight"
            value={newEdge.weight}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          className="btn btn-primary m-2"
          type="submit"
        >
          Add Edge
        </button>
      </form>
      <div>
        <div className="custom-form">
          <label className="m-2">Source:</label>
          <input
            className="form-control m-2"
            type="number"
            value={src}
            onChange={(e) => setSrc(parseInt(e.target.value))}
          />
          <label>Destination:</label>
          <input
            className="form-control m-2"
            type="number"
            value={dest}
            onChange={(e) => setDest(parseInt(e.target.value))}
          />
        </div>

        <button
          className="btn btn-primary m-2"
          onClick={handleShortestPath}
        >
          Find Shortest Path
        </button>
      </div>
      <div
        className="container"
        onMouseDown={(e) => e.preventDefault()}
      >
        {edges.map((edge, index) => {
          const fromNode = nodes.find((node) => node.id === edge.from);
          const toNode = nodes.find((node) => node.id === edge.to);

          if (!fromNode || !toNode) return null;

          const isColoured = colouredEdges.some(
            (colouredEdge) =>
              (colouredEdge.from === edge.from &&
                colouredEdge.to === edge.to) ||
              (colouredEdge.from === edge.to && colouredEdge.to === edge.from)
          );

          return (
            <svg
              key={index}
              className="line"
              style={{ zIndex: isColoured ? 3 : 1 }} // Higher zIndex for coloured edges
            >
              <line
                x1={fromNode.x + 25}
                y1={fromNode.y + 25}
                x2={toNode.x + 25}
                y2={toNode.y + 25}
                stroke={isColoured ? 'red' : 'black'} // Different stroke color for coloured edges
                strokeWidth="2"
              />
              <text
                x={(fromNode.x + toNode.x) / 2 + 25}
                y={(fromNode.y + toNode.y) / 2 + 25}
              >
                {edge.weight}
              </text>
            </svg>
          );
        })}
        {nodes.map((node, index) => (
          <div
            key={index}
            onMouseDown={(e) => handleMouseDown(index, e)}
            className="node"
            style={{
              left: node.x,
              top: node.y,
            }}
          >
            {node.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
