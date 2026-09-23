import React, { useEffect } from 'react';

// The proposal no longer creates a second WebGL renderer.
// It broadcasts state to the single persistent 3D world owned by App.jsx.
export default function Proposal3DScene({ proposalState }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('miya:proposal', { detail: { state: proposalState } }));
  }, [proposalState]);

  return null;
}
