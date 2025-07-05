import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Search, ArrowRight } from 'lucide-react';
import './App.css';

const DSAVisualizer = () => {
  const [currentDS, setCurrentDS] = useState('array');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [inputValue, setInputValue] = useState('');
  
  // Array state
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Stack state
  const [stack, setStack] = useState([10, 20, 30]);
  const [stackAnimation, setStackAnimation] = useState('');
  
  // Queue state
  const [queue, setQueue] = useState([5, 15, 25]);
  const [queueAnimation, setQueueAnimation] = useState('');
  
  // Binary Tree state
  const [treeNodes, setTreeNodes] = useState({
    1: { value: 50, left: 2, right: 3, x: 400, y: 100 },
    2: { value: 30, left: 4, right: 5, x: 200, y: 200 },
    3: { value: 70, left: 6, right: 7, x: 600, y: 200 },
    4: { value: 20, left: null, right: null, x: 100, y: 300 },
    5: { value: 40, left: null, right: null, x: 300, y: 300 },
    6: { value: 60, left: null, right: null, x: 500, y: 300 },
    7: { value: 80, left: null, right: null, x: 700, y: 300 }
  });
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  
  // Bubble Sort Algorithm
  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isPlaying) return;
        
        setComparing([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
      setSorted(prev => [...prev, n - 1 - i]);
    }
    setSorted(prev => [...prev, 0]);
    setComparing([]);
    setIsPlaying(false);
  }, [array, speed, isPlaying]);
  
  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setComparing([]);
    setSorted([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const addToStack = () => {
    if (inputValue) {
      setStackAnimation('push');
      setTimeout(() => {
        setStack(prev => [...prev, parseInt(inputValue)]);
        setStackAnimation('');
        setInputValue('');
      }, 300);
    }
  };
  
  const popFromStack = () => {
    if (stack.length > 0) {
      setStackAnimation('pop');
      setTimeout(() => {
        setStack(prev => prev.slice(0, -1));
        setStackAnimation('');
      }, 300);
    }
  };
  
  const enqueue = () => {
    if (inputValue) {
      setQueueAnimation('enqueue');
      setTimeout(() => {
        setQueue(prev => [...prev, parseInt(inputValue)]);
        setQueueAnimation('');
        setInputValue('');
      }, 300);
    }
  };
  
  const dequeue = () => {
    if (queue.length > 0) {
      setQueueAnimation('dequeue');
      setTimeout(() => {
        setQueue(prev => prev.slice(1));
        setQueueAnimation('');
      }, 300);
    }
  };
  
  const searchTree = async (target) => {
    setHighlightedNodes([]);
    let current = 1;
    
    while (current && treeNodes[current]) {
      setHighlightedNodes([current]);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (treeNodes[current].value === target) {
        setHighlightedNodes([current]);
        return;
      } else if (target < treeNodes[current].value) {
        current = treeNodes[current].left;
      } else {
        current = treeNodes[current].right;
      }
    }
    setHighlightedNodes([]);
  };
  
  useEffect(() => {
    if (isPlaying && currentDS === 'array') {
      bubbleSort();
    }
  }, [isPlaying, currentDS, bubbleSort]);
  
  const renderArray = () => (
    <div className="array-container">
      <div className="controls">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn btn-primary"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Pause' : 'Sort'}</span>
        </button>
        <button
          onClick={resetArray}
          className="btn btn-secondary"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
        <div className="speed-control">
          <label>Speed:</label>
          <input
            type="range"
            min="100"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
            className="speed-slider"
          />
        </div>
      </div>
      
      <div className="array-bars">
        {array.map((value, index) => (
          <div
            key={index}
            className={`bar-container ${comparing.includes(index) ? 'comparing' : ''}`}
          >
            <div
              className={`bar ${
                sorted.includes(index) ? 'sorted' :
                comparing.includes(index) ? 'comparing-bar' : 'default-bar'
              }`}
              style={{ height: `${value * 2}px` }}
            >
              {value}
            </div>
            <div className="bar-index">{index}</div>
          </div>
        ))}
      </div>
      
      <div className="description">
        <h3>Bubble Sort</h3>
        <p>Compares adjacent elements and swaps them if they're in the wrong order</p>
      </div>
    </div>
  );
  
  const renderStack = () => (
    <div className="stack-container">
      <div className="controls">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="input-field"
        />
        <button
          onClick={addToStack}
          className="btn btn-success"
        >
          <Plus size={20} />
          <span>Push</span>
        </button>
        <button
          onClick={popFromStack}
          className="btn btn-danger"
        >
          <Minus size={20} />
          <span>Pop</span>
        </button>
      </div>
      
      <div className="stack-items">
        {stack.map((value, index) => (
          <div
            key={index}
            className={`stack-item ${
              index === stack.length - 1 && stackAnimation === 'push' ? 'push-animation' :
              index === stack.length - 1 && stackAnimation === 'pop' ? 'pop-animation' : ''
            }`}
          >
            {value}
          </div>
        ))}
        <div className="stack-base"></div>
        <div className="stack-label">Base</div>
      </div>
      
      <div className="description">
        <h3>Stack (LIFO)</h3>
        <p>Last In, First Out - elements are added and removed from the top</p>
      </div>
    </div>
  );
  
  const renderQueue = () => (
    <div className="queue-container">
      <div className="controls">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="input-field"
        />
        <button
          onClick={enqueue}
          className="btn btn-success"
        >
          <Plus size={20} />
          <span>Enqueue</span>
        </button>
        <button
          onClick={dequeue}
          className="btn btn-danger"
        >
          <Minus size={20} />
          <span>Dequeue</span>
        </button>
      </div>
      
      <div className="queue-items">
        <div className="queue-label">Front</div>
        <ArrowRight size={16} className="queue-arrow" />
        {queue.map((value, index) => (
          <div
            key={index}
            className={`queue-item ${
              index === queue.length - 1 && queueAnimation === 'enqueue' ? 'enqueue-animation' :
              index === 0 && queueAnimation === 'dequeue' ? 'dequeue-animation' : ''
            }`}
          >
            {value}
          </div>
        ))}
        <ArrowRight size={16} className="queue-arrow" />
        <div className="queue-label">Rear</div>
      </div>
      
      <div className="description">
        <h3>Queue (FIFO)</h3>
        <p>First In, First Out - elements are added at rear and removed from front</p>
      </div>
    </div>
  );
  
  const renderBinaryTree = () => (
    <div className="tree-container">
      <div className="controls">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search value"
          className="input-field"
        />
        <button
          onClick={() => inputValue && searchTree(parseInt(inputValue))}
          className="btn btn-primary"
        >
          <Search size={20} />
          <span>Search</span>
        </button>
      </div>
      
      <div className="tree-svg-container">
        <svg width="100%" height="400" className="tree-svg">
          {/* Draw edges */}
          {Object.entries(treeNodes).map(([id, node]) => (
            <g key={`edges-${id}`}>
              {node.left && treeNodes[node.left] && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={treeNodes[node.left].x}
                  y2={treeNodes[node.left].y}
                  stroke="#374151"
                  strokeWidth="2"
                />
              )}
              {node.right && treeNodes[node.right] && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={treeNodes[node.right].x}
                  y2={treeNodes[node.right].y}
                  stroke="#374151"
                  strokeWidth="2"
                />
              )}
            </g>
          ))}
          
          {/* Draw nodes */}
          {Object.entries(treeNodes).map(([id, node]) => (
            <g key={`node-${id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={highlightedNodes.includes(parseInt(id)) ? '#ef4444' : '#3b82f6'}
                stroke="#1e40af"
                strokeWidth="2"
                className="tree-node"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {node.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="description">
        <h3>Binary Search Tree</h3>
        <p>Left subtree has smaller values, right subtree has larger values</p>
      </div>
    </div>
  );
  
  const dataStructures = {
    array: { name: 'Array Sorting', component: renderArray },
    stack: { name: 'Stack', component: renderStack },
    queue: { name: 'Queue', component: renderQueue },
    tree: { name: 'Binary Tree', component: renderBinaryTree }
  };
  
  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Data Structures & Algorithms Visualizer</h1>
          <p>Interactive visualization of fundamental data structures and algorithms</p>
        </div>
        
        <div className="main-content">
          <div className="tabs">
            {Object.entries(dataStructures).map(([key, ds]) => (
              <button
                key={key}
                onClick={() => setCurrentDS(key)}
                className={`tab ${currentDS === key ? 'active' : ''}`}
              >
                {ds.name}
              </button>
            ))}
          </div>
          
          <div className="content">
            {dataStructures[currentDS].component()}
          </div>
        </div>
        
        <div className="info-section">
          <h2>About This Visualizer</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Features</h3>
              <ul>
                <li>Interactive array sorting with bubble sort algorithm</li>
                <li>Stack operations (push/pop) with animations</li>
                <li>Queue operations (enqueue/dequeue) with visual flow</li>
                <li>Binary search tree with search functionality</li>
                <li>Adjustable animation speed</li>
                <li>Step-by-step visualization</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>How to Use</h3>
              <ul>
                <li>Select a data structure from the tabs above</li>
                <li>Use the controls to interact with each structure</li>
                <li>Watch animations to understand the operations</li>
                <li>Adjust speed for better learning pace</li>
                <li>Reset to try different scenarios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAVisualizer;