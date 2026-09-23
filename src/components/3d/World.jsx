import React, { useEffect, useRef } from 'react';
import { WorldRenderer } from './WorldRenderer';

export default function World() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const world = new WorldRenderer(mountRef.current);
    window.__miyaWorld = world;

    return () => {
      if (window.__miyaWorld === world) delete window.__miyaWorld;
      world.destroy();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none h-screen w-screen overflow-hidden"
    />
  );
}
