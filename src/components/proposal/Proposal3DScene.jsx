import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Proposal3DScene({ proposalState, isMobile }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleGroupRef = useRef(null);
  const rainGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer Setup
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xe89ca7, 2, 50);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 3. Particle Systems Groups
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    particleGroupRef.current = particleGroup;

    const rainGroup = new THREE.Group();
    scene.add(rainGroup);
    rainGroupRef.current = rainGroup;

    // 4. Render Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate particles subtly
      if (particleGroup) {
        particleGroup.rotation.y = elapsedTime * 0.15;
      }
      if (rainGroup) {
        rainGroup.children.forEach((drop) => {
          drop.position.y -= drop.userData.speed;
          if (drop.position.y < -10) drop.position.y = 10;
        });
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --------------------------------------------------------------------------
  // Camera & Scene Animations Triggered by Proposal State
  // --------------------------------------------------------------------------
  useEffect(() => {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const particleGroup = particleGroupRef.current;
    const rainGroup = rainGroupRef.current;

    if (!camera || !scene) return;

    // YES FLOW
    if (proposalState === 'yes-intro') {
      gsap.to(camera.position, {
        z: 3.5,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }

    if (proposalState === 'yes-explosion') {
      // Spawn 3D Heart Particle Burst
      if (particleGroup) {
        while (particleGroup.children.length > 0) {
          particleGroup.remove(particleGroup.children[0]);
        }

        const particleCount = isMobile ? 120 : 350;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPalette = [
          new THREE.Color(0xb76e79),
          new THREE.Color(0xe89ca7),
          new THREE.Color(0xffffff),
          new THREE.Color(0xffd700),
        ];

        for (let i = 0; i < particleCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const r = Math.random() * 4 + 1;

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: isMobile ? 0.08 : 0.12,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        particleGroup.add(points);

        gsap.to(points.scale, {
          x: 2.2,
          y: 2.2,
          z: 2.2,
          duration: 2,
          ease: 'power2.out',
        });
      }
    }

    if (proposalState === 'yes-celebration') {
      gsap.to(camera.position, {
        x: 0.6,
        y: 0.3,
        z: 4,
        duration: 2.5,
        ease: 'sine.inOut',
      });
    }

    // NO FLOW
    if (proposalState === 'no-drain' || proposalState === 'no-rain') {
      scene.fog = new THREE.FogExp2(0x050505, 0.08);

      if (rainGroup && rainGroup.children.length === 0) {
        const rainCount = isMobile ? 400 : 1200;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -0.4, 0),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.35,
        });

        for (let i = 0; i < rainCount; i++) {
          const drop = new THREE.Line(lineGeo, lineMat);
          drop.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 20 - 10,
            (Math.random() - 0.5) * 15
          );
          drop.userData = { speed: Math.random() * 0.2 + 0.1 };
          rainGroup.add(drop);
        }
      }

      gsap.to(camera.position, {
        z: 11,
        duration: 2,
        ease: 'power2.inOut',
      });
    }

    // RESET TO IDLE
    if (proposalState === 'idle') {
      scene.fog = null;
      if (particleGroup) {
        while (particleGroup.children.length > 0) {
          particleGroup.remove(particleGroup.children[0]);
        }
      }
      if (rainGroup) {
        while (rainGroup.children.length > 0) {
          rainGroup.remove(rainGroup.children[0]);
        }
      }
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 8,
        duration: 1.2,
      });
    }
  }, [proposalState, isMobile]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-20 pointer-events-none w-full h-full"
    />
  );
}
