import * as THREE from 'three';

export class FloatingPhotos {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const textureLoader = new THREE.TextureLoader();
    const samplePhotos = [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    ];

    const cardGeometry = new THREE.PlaneGeometry(1.6, 2.2);

    samplePhotos.forEach((url, i) => {
      textureLoader.load(url, (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });

        const mesh = new THREE.Mesh(cardGeometry, material);
        mesh.position.set(
          (i - 1) * 2.8,
          -15 + (i % 2 === 0 ? 0.4 : -0.4),
          (Math.random() - 0.5) * 1.5
        );
        mesh.rotation.y = (i - 1) * 0.2;
        mesh.rotation.z = (Math.random() - 0.5) * 0.1;

        mesh.userData = { initialY: mesh.position.y, speed: 0.5 + i * 0.2 };
        this.group.add(mesh);
      });
    });
  }

  update(elapsedTime) {
    if (this.group) {
      this.group.children.forEach((mesh) => {
        mesh.position.y = mesh.userData.initialY + Math.sin(elapsedTime * mesh.userData.speed) * 0.15;
        mesh.rotation.y += Math.cos(elapsedTime * 0.5) * 0.002;
      });
    }
  }

  destroy() {
    if (this.group) {
      this.scene.remove(this.group);
      this.group.children.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.dispose();
        }
      });
    }
  }
}
