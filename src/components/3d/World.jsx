import React, { useEffect, useRef } from 'react';
import { WorldRenderer } from './WorldRenderer';
import { StarField } from './StarField';
import { FloatingPhotos } from './FloatingPhotos';
import { CameraController } from './CameraController';

export default function World() {
  const mountRef = useRef(null);
  const worldInstance = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Initialize persistent WorldRenderer Engine
    const world = new WorldRenderer(container);
    worldInstance.current = world;

    // 2. Initialize 3D StarField Universe
    const starField = new StarField(world.scene, isMobile);
    world.addUpdatable(starField);

    // 3. Initialize Floating 3D Photos for Memories
    const floatingPhotos = new FloatingPhotos(world.scene, isMobile);
    world.addUpdatable(floatingPhotos);

    // 4. Initialize Camera Controller for ScrollStorytelling
    const cameraController = new CameraController(world.camera);

    return () => {
      cameraController.destroy();
      floatingPhotos.destroy();
      starField.destroy();
      world.destroy();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
