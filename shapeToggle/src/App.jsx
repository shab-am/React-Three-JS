import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createCube() {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function createSphere() {
  const geometry = new THREE.SphereGeometry(1.5, 32, 32);
  const material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function createCone() {
  const geometry = new THREE.ConeGeometry(1.5, 3, 32);
  const material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function ThreeScene({ shape }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;

    let currentShape;
    const addShapeToScene = (selectedShape) => {
      if (currentShape) {
        scene.remove(currentShape);
      }

      switch (selectedShape) {
        case 'cube':
          currentShape = createCube();
          break;
        case 'sphere':
          currentShape = createSphere();
          break;
        case 'cone':
          currentShape = createCone();
          break;
        default:
          currentShape = createCube();
      }

      scene.add(currentShape);
    };

    addShapeToScene(shape);

    const animate = () => {
      if (currentShape) {
        currentShape.rotation.x += 0.01;
        currentShape.rotation.y += 0.01;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);  // Stop the animation loop
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [shape]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default function App() {
  const [shape, setShape] = useState('cube');

  return (
    <div style={{ height: '100vh' }} className='main'>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }} className='content'>
        <button onClick={() => setShape('cube')}>Cube</button>
        <button onClick={() => setShape('sphere')}>Sphere</button>
        <button onClick={() => setShape('cone')}>Cone</button>
      </div>
      <ThreeScene shape={shape} />
    </div>
  );
}
