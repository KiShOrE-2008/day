import * as THREE from 'three';

export class WorldRenderer {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Render Loop
    this.clock = new THREE.Clock();
    this.updatables = [];
    this.isRendering = true;

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);

    window.addEventListener('resize', this.handleResize);
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.pinkLight = new THREE.PointLight(0xe89ca7, 3, 40);
    this.pinkLight.position.set(-5, 5, 5);
    this.scene.add(this.pinkLight);

    this.goldLight = new THREE.PointLight(0xffd700, 2, 40);
    this.goldLight.position.set(5, -5, 5);
    this.scene.add(this.goldLight);
  }

  addUpdatable(object) {
    this.updatables.push(object);
  }

  removeUpdatable(object) {
    this.updatables = this.updatables.filter((item) => item !== object);
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    if (!this.isRendering) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update updatables
    this.updatables.forEach((item) => {
      if (typeof item.update === 'function') {
        item.update(elapsedTime, delta);
      }
    });

    // Subtle ambient light oscillation
    if (this.pinkLight) {
      this.pinkLight.position.x = Math.sin(elapsedTime * 0.5) * 6;
    }
    if (this.goldLight) {
      this.goldLight.position.y = Math.cos(elapsedTime * 0.5) * 6;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    this.isRendering = false;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);

    if (this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
