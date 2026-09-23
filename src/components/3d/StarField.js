import * as THREE from 'three';

export class StarField {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.count = isMobile ? 500 : 1500;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);

    const colorPalette = [
      new THREE.Color(0xe89ca7),
      new THREE.Color(0xb76e79),
      new THREE.Color(0xffd700),
      new THREE.Color(0xf5f1ea),
      new THREE.Color(0xffffffff),
    ];

    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  update(elapsedTime) {
    if (this.points) {
      this.points.rotation.y = elapsedTime * 0.03;
      this.points.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
    }
  }

  destroy() {
    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      this.points.material.dispose();
    }
  }
}
