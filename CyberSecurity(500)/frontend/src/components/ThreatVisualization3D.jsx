/**
 * Advanced 3D Threat Landscape Visualization
 * Enterprise-grade 3D visualization for NEXUS CYBER INTELLIGENCE
 */

import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import axios from 'axios';

// Threat sphere component
const ThreatSphere = ({ threat, position, onHover, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  const getThreatColor = (severity) => {
    const colors = {
      'Critical': '#ff0000',
      'High': '#ff6b6b',
      'Medium': '#ffa500',
      'Low': '#ffff00',
      'Info': '#00ff00'
    };
    return colors[severity] || '#ffa500';
  };

  const getThreatSize = (severity) => {
    const sizes = {
      'Critical': 0.3,
      'High': 0.25,
      'Medium': 0.2,
      'Low': 0.15,
      'Info': 0.1
    };
    return sizes[severity] || 0.2;
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={getThreatSize(threat.severity)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(threat);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(threat);
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={getThreatColor(threat.severity)}
        emissive={getThreatColor(threat.severity)}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Network node component
const NetworkNode = ({ threat, position, onHover, onClick }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const getThreatColor = (severity) => {
    const colors = {
      'Critical': '#ff0000',
      'High': '#ff6b6b',
      'Medium': '#ffa500',
      'Low': '#ffff00',
      'Info': '#00ff00'
    };
    return colors[severity] || '#ffa500';
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(threat);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(threat);
      }}
    >
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color={getThreatColor(threat.severity)}
        emissive={getThreatColor(threat.severity)}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Connection line component
const ConnectionLine = ({ start, end }) => {
  const points = [start, end];
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00ff00" transparent opacity={0.6} />
    </line>
  );
};

// Scene component
const Scene = ({ threats, viewMode, onThreatHover, onThreatSelect }) => {
  const { scene } = useThree();

  // Create connections for network view
  const connections = [];
  if (viewMode === 'network') {
    for (let i = 0; i < threats.length; i++) {
      for (let j = i + 1; j < threats.length; j++) {
        if (Math.random() < 0.3) {
          connections.push({
            start: threats[i].position,
            end: threats[j].position
          });
        }
      }
    }
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, 10]} color="#ff6b6b" intensity={1} />
      <pointLight position={[10, -10, 10]} color="#4ecdc4" intensity={1} />
      
      {/* Threat objects */}
      {threats.map((threat, index) => {
        const position = viewMode === 'globe' 
          ? [
              Math.sin(index * 0.5) * 2,
              Math.cos(index * 0.3) * 2,
              Math.sin(index * 0.7) * 2
            ]
          : [
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10
            ];

        return viewMode === 'network' ? (
          <NetworkNode
            key={index}
            threat={threat}
            position={position}
            onHover={onThreatHover}
            onClick={onThreatSelect}
          />
        ) : (
          <ThreatSphere
            key={index}
            threat={threat}
            position={position}
            onHover={onThreatHover}
            onClick={onThreatSelect}
          />
        );
      })}
      
      {/* Network connections */}
      {viewMode === 'network' && connections.map((connection, index) => (
        <ConnectionLine
          key={index}
          start={connection.start}
          end={connection.end}
        />
      ))}
    </>
  );
};

const ThreatVisualization3D = ({ 
  threats = [], 
  realTime = true, 
  interactive = true,
  theme = 'dark',
  onThreatSelect = () => {},
  onThreatHover = () => {},
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [hoveredThreat, setHoveredThreat] = useState(null);
  const [viewMode, setViewMode] = useState('globe');
  const [filterOptions, setFilterOptions] = useState({
    severity: 'all',
    type: 'all',
    timeRange: '24h'
  });
  const [threatData, setThreatData] = useState(threats);

  // Load real-time threat data
  const loadThreatData = useCallback(async () => {
    try {
      const response = await axios.get('/api/threats/realtime');
      if (response.data.success) {
        setThreatData(response.data.threats);
      }
    } catch (error) {
      console.error('Error loading threat data:', error);
      // Use fallback data
      setThreatData([
        { id: 1, type: 'Malware', severity: 'High', country: 'US', timestamp: new Date().toISOString() },
        { id: 2, type: 'Phishing', severity: 'Medium', country: 'UK', timestamp: new Date().toISOString() },
        { id: 3, type: 'DDoS', severity: 'Critical', country: 'CN', timestamp: new Date().toISOString() },
        { id: 4, type: 'Ransomware', severity: 'High', country: 'RU', timestamp: new Date().toISOString() },
        { id: 5, type: 'Botnet', severity: 'Medium', country: 'DE', timestamp: new Date().toISOString() }
      ]);
    }
    setIsLoading(false);
  }, []);

  // Handle threat selection
  const handleThreatSelect = useCallback((threat) => {
    setSelectedThreat(threat);
    onThreatSelect(threat);
  }, [onThreatSelect]);

  // Handle threat hover
  const handleThreatHover = useCallback((threat) => {
    setHoveredThreat(threat);
    onThreatHover(threat);
  }, [onThreatHover]);

  // Load data on mount
  React.useEffect(() => {
    if (realTime) {
      loadThreatData();
      const interval = setInterval(loadThreatData, 5000);
      return () => clearInterval(interval);
    } else {
      setThreatData(threats);
      setIsLoading(false);
    }
  }, [realTime, threats, loadThreatData]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-lg">Loading 3D Visualization...</div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">View Controls</h3>
          <div className="space-y-2">
            <button
              onClick={() => setViewMode('globe')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'globe' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              Globe View
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'network' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              Network View
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <div className="space-y-2">
            <select
              value={filterOptions.severity}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threat information panel */}
      {(selectedThreat || hoveredThreat) && (
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-75 rounded-lg p-4 text-white max-w-sm">
          <h3 className="text-lg font-semibold mb-2">
            {selectedThreat ? 'Selected Threat' : 'Hovered Threat'}
          </h3>
          <div className="space-y-1 text-sm">
            <div><strong>Type:</strong> {(selectedThreat || hoveredThreat)?.type}</div>
            <div><strong>Severity:</strong> {(selectedThreat || hoveredThreat)?.severity}</div>
            <div><strong>Country:</strong> {(selectedThreat || hoveredThreat)?.country}</div>
            <div><strong>Timestamp:</strong> {(selectedThreat || hoveredThreat)?.timestamp}</div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0' }}
      >
        <Scene
          threats={threatData}
          viewMode={viewMode}
          onThreatHover={handleThreatHover}
          onThreatSelect={handleThreatSelect}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          enableZoom
          enablePan
          maxDistance={50}
          minDistance={2}
        />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ThreatVisualization3D;