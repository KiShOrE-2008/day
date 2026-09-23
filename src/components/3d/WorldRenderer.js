import * as THREE from 'three';

const PINK = 0xe89ca7;
const ROSE = 0xb76e79;
const GOLD = 0xffd76a;
const CREAM = 0xf5f1ea;

function makeHeartShape(scale = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.35 * scale);
  shape.bezierCurveTo(-1.15 * scale, 1.15 * scale, -2.2 * scale, 0.2 * scale, -1.35 * scale, -0.8 * scale);
  shape.bezierCurveTo(-0.7 * scale, -1.55 * scale, 0, -0.75 * scale, 0, -0.3 * scale);
  shape.bezierCurveTo(0, -0.75 * scale, 0.7 * scale, -1.55 * scale, 1.35 * scale, -0.8 * scale);
  shape.bezierCurveTo(2.2 * scale, 0.2 * scale, 1.15 * scale, 1.15 * scale, 0, 0.35 * scale);
  return shape;
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
    }
  });
}

export class WorldRenderer {
  constructor(container) {
    this.container = container;
    this.mobile = window.innerWidth < 768;
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.clock = new THREE.Clock();
    this.updatables = [];
    this.progress = 0;
    this.targetProgress = 0;
    this.proposalState = 'idle';
    this.proposalFx = null;
    this.destroyed = false;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080808, this.mobile ? 0.012 : 0.009);

    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 250);
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.createUniverse();
    this.createStoryWorld();
    this.createParticleField();
    this.createAmbientHearts();
    this.bindEvents();

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.tick = requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    this.handleScroll();
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    this.pinkLight = new THREE.PointLight(PINK, 3.5, 45);
    this.pinkLight.position.set(-4, 2, 5);
    this.scene.add(this.pinkLight);

    this.goldLight = new THREE.PointLight(GOLD, 2.2, 35);
    this.goldLight.position.set(5, -8, 3);
    this.scene.add(this.goldLight);
  }

  createUniverse() {
    const count = this.mobile ? 700 : 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color(PINK), new THREE.Color(ROSE), new THREE.Color(GOLD), new THREE.Color(CREAM)];

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = 8 - Math.random() * 78;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 42;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: this.mobile ? 0.07 : 0.105,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.scene.add(this.stars);
  }

  createStoryWorld() {
    this.story = new THREE.Group();
    this.scene.add(this.story);

    // Intro: a glowing heart suspended in space.
    const heartGeo = new THREE.ExtrudeGeometry(makeHeartShape(1.25), {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.06,
      bevelThickness: 0.05,
    });
    heartGeo.center();
    this.heroHeart = new THREE.Mesh(
      heartGeo,
      new THREE.MeshStandardMaterial({
        color: PINK,
        emissive: ROSE,
        emissiveIntensity: 1.35,
        metalness: 0.25,
        roughness: 0.28,
        transparent: true,
        opacity: 0.95,
      })
    );
    this.heroHeart.position.set(0, 0, -1);
    this.story.add(this.heroHeart);

    // First meeting: date portal.
    this.meetingRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.035, 12, 96),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.65 })
    );
    this.meetingRing.position.set(1.5, -7, -1);
    this.story.add(this.meetingRing);

    // Timeline: connected glowing nodes.
    this.timelineGroup = new THREE.Group();
    this.timelineGroup.position.set(-1.2, -12.5, -1);
    this.story.add(this.timelineGroup);
    const points = [];
    for (let i = 0; i < 7; i += 1) {
      const y = i * -1.7;
      const x = Math.sin(i * 1.4) * 1.5;
      points.push(new THREE.Vector3(x, y, 0));
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(i === 0 ? 0.25 : 0.16, 16, 16),
        new THREE.MeshStandardMaterial({ color: i === 0 ? PINK : GOLD, emissive: i === 0 ? ROSE : GOLD, emissiveIntensity: 1.5 })
      );
      node.position.copy(points[i]);
      this.timelineGroup.add(node);
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    this.timelineGroup.add(new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: PINK, transparent: true, opacity: 0.55 })
    ));

    // Memories: floating photo-frame placeholders. Real page photos remain above the canvas.
    this.memoryGroup = new THREE.Group();
    this.memoryGroup.position.set(0, -25, 0);
    this.story.add(this.memoryGroup);
    for (let i = 0; i < 9; i += 1) {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 1.85, 0.08),
        new THREE.MeshStandardMaterial({
          color: i % 2 ? ROSE : GOLD,
          emissive: i % 2 ? ROSE : GOLD,
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0.48,
          wireframe: true,
        })
      );
      frame.position.set((i % 3 - 1) * 2.6, -Math.floor(i / 3) * 1.7, (i % 2) * 0.5);
      frame.rotation.z = (Math.random() - 0.5) * 0.12;
      this.memoryGroup.add(frame);
    }

    // Wishes: constellation heart.
    this.wishesGroup = new THREE.Group();
    this.wishesGroup.position.set(0, -30, 0);
    this.story.add(this.wishesGroup);
    const wishCount = this.mobile ? 90 : 180;
    const wishPositions = new Float32Array(wishCount * 3);
    for (let i = 0; i < wishCount; i += 1) {
      const t = (i / wishCount) * Math.PI * 2;
      const x = 3.1 * Math.pow(Math.sin(t), 3);
      const y = -(2.4 * Math.cos(t) - 0.95 * Math.cos(2 * t) - 0.45 * Math.cos(3 * t) - 0.2 * Math.cos(4 * t));
      wishPositions[i * 3] = x + (Math.random() - 0.5) * 0.35;
      wishPositions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.35;
      wishPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    const wishGeo = new THREE.BufferGeometry();
    wishGeo.setAttribute('position', new THREE.BufferAttribute(wishPositions, 3));
    this.wishes = new THREE.Points(
      wishGeo,
      new THREE.PointsMaterial({ color: PINK, size: this.mobile ? 0.08 : 0.11, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    this.wishesGroup.add(this.wishes);

    // Letters: envelope field.
    this.lettersGroup = new THREE.Group();
    this.lettersGroup.position.set(-1.5, -35, 0);
    this.story.add(this.lettersGroup);
    for (let i = 0; i < 5; i += 1) {
      const envelope = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.55, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xf5e8e8, roughness: 0.7, metalness: 0.05 })
      );
      const seal = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({ color: ROSE, emissive: ROSE, emissiveIntensity: 0.8 })
      );
      seal.position.z = 0.12;
      envelope.add(body, seal);
      envelope.position.set((i % 3 - 1) * 2.7, -Math.floor(i / 3) * 2.0, i * 0.15);
      envelope.rotation.z = (Math.random() - 0.5) * 0.18;
      this.lettersGroup.add(envelope);
    }

    // Love letter: floating paper.
    this.letter = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 5.6),
      new THREE.MeshStandardMaterial({ color: 0xf8efe8, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.94 })
    );
    this.letter.position.set(0, -40, 0);
    this.story.add(this.letter);

    // Time capsule: metallic box + lock.
    this.capsuleGroup = new THREE.Group();
    this.capsuleGroup.position.set(1.3, -46, 0);
    const capsule = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 2.8, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x2a2022, metalness: 0.75, roughness: 0.28, emissive: ROSE, emissiveIntensity: 0.18 })
    );
    const lock = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.08, 10, 32),
      new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.7, metalness: 0.7 })
    );
    lock.position.z = 1.15;
    this.capsuleGroup.add(capsule, lock);
    this.story.add(this.capsuleGroup);

    // Finale ring.
    this.finaleGroup = new THREE.Group();
    this.finaleGroup.position.set(0, -52, 0);
    this.story.add(this.finaleGroup);
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.2 + i * 0.7, 0.025, 10, 96),
        new THREE.MeshBasicMaterial({ color: i === 1 ? GOLD : PINK, transparent: true, opacity: 0.5 })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.25;
      this.finaleGroup.add(ring);
    }
  }

  createParticleField() {
    const count = this.mobile ? 260 : 520;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.ambientParticles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: PINK, size: this.mobile ? 0.055 : 0.075, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
    );
    this.scene.add(this.ambientParticles);
    this.ambientParticleVelocity = velocities;
  }

  createAmbientHearts() {
    this.ambientHearts = new THREE.Group();
    this.scene.add(this.ambientHearts);
    const geo = new THREE.ExtrudeGeometry(makeHeartShape(0.18), { depth: 0.04, bevelEnabled: false });
    for (let i = 0; i < (this.mobile ? 10 : 18); i += 1) {
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: i % 2 ? PINK : GOLD, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
      );
      mesh.position.set((Math.random() - 0.5) * 10, 4 - Math.random() * 48, (Math.random() - 0.5) * 4);
      mesh.userData.phase = Math.random() * Math.PI * 2;
      mesh.userData.speed = 0.4 + Math.random() * 0.7;
      this.ambientHearts.add(mesh);
    }
  }

  bindEvents() {
    this.handleScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.targetProgress = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    };

    this.handleProposal = (event) => {
      this.proposalState = event.detail?.state || 'idle';
      this.runProposalState(this.proposalState);
    };
    window.addEventListener('miya:proposal', this.handleProposal);
  }

  setProgress(progress) {
    this.targetProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  runProposalState(state) {
    if (state === 'idle') {
      this.clearProposalFx();
      return;
    }

    if (state === 'yes-explosion') {
      this.clearProposalFx();
      this.createBurst(false);
    }

    if (state === 'yes-celebration') {
      this.createFireworks();
    }

    if (state === 'no-rain') {
      this.clearProposalFx();
      this.createRain();
      this.createHeartbreak();
    }
  }

  createBurst(sad = false) {
    const count = this.mobile ? 140 : 420;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = sad ? [0xffffff] : [PINK, ROSE, GOLD, CREAM];

    for (let i = 0; i < count; i += 1) {
      const t = Math.random() * Math.PI * 2;
      const heartX = 2.4 * Math.pow(Math.sin(t), 3);
      const heartY = 1.7 * Math.cos(t) - 0.7 * Math.cos(2 * t) - 0.35 * Math.cos(3 * t) - 0.15 * Math.cos(4 * t);
      positions[i * 3] = heartX * (0.65 + Math.random() * 0.35);
      positions[i * 3 + 1] = heartY * (0.65 + Math.random() * 0.35);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
      const len = Math.max(0.2, Math.hypot(positions[i * 3], positions[i * 3 + 1]));
      velocities[i * 3] = (positions[i * 3] / len) * (0.025 + Math.random() * 0.045);
      velocities[i * 3 + 1] = (positions[i * 3 + 1] / len) * (0.025 + Math.random() * 0.055);
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ size: this.mobile ? 0.095 : 0.13, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    this.proposalFx = { type: 'burst', object: points, velocities, age: 0 };
    this.scene.add(points);
  }

  createFireworks() {
    const group = new THREE.Group();
    for (let f = 0; f < (this.mobile ? 2 : 4); f += 1) {
      const count = this.mobile ? 55 : 95;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2;
        const r = 0.5 + Math.random() * 2.4;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = Math.sin(a) * r;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({ color: f % 2 ? GOLD : PINK, size: 0.09, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
      p.position.set((f - 1.5) * 2.2, 1.5 + (f % 2) * 1.3, -1);
      group.add(p);
    }
    this.proposalFx = { ...(this.proposalFx || {}), type: 'celebration', fireworks: group, age: 0 };
    this.scene.add(group);
  }

  createRain() {
    const count = this.mobile ? 420 : 1100;
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 22;
      const y = Math.random() * 22 - 11;
      const z = (Math.random() - 0.5) * 16;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x - 0.04;
      positions[i * 6 + 4] = y - (0.35 + Math.random() * 0.35);
      positions[i * 6 + 5] = z;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rain = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    this.proposalFx = { type: 'rain', rain, age: 0 };
    this.scene.add(rain);
  }

  createHeartbreak() {
    const left = new THREE.Mesh(
      new THREE.ExtrudeGeometry(makeHeartShape(1.2), { depth: 0.2, bevelEnabled: false }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.75 })
    );
    const right = left.clone();
    left.scale.x = 0.5;
    right.scale.x = 0.5;
    left.position.x = -0.62;
    right.position.x = 0.62;
    right.rotation.y = Math.PI;
    const group = new THREE.Group();
    group.add(left, right);
    group.position.set(0, -1, 0);
    this.proposalFx.heart = group;
    this.scene.add(group);
  }

  clearProposalFx() {
    if (!this.proposalFx) {
      this.scene.fog.density = this.mobile ? 0.012 : 0.009;
      return;
    }
    const fx = this.proposalFx;
    ['object', 'fireworks', 'rain', 'heart'].forEach((key) => {
      if (fx[key]) {
        this.scene.remove(fx[key]);
        disposeObject(fx[key]);
      }
    });
    this.proposalFx = null;
    this.scene.fog.density = this.mobile ? 0.012 : 0.009;
  }

  updateProposalFx(delta) {
    const fx = this.proposalFx;
    if (!fx) return;
    fx.age += delta;

    if (fx.type === 'burst' && fx.object) {
      const pos = fx.object.geometry.attributes.position.array;
      for (let i = 0; i < fx.velocities.length / 3; i += 1) {
        fx.velocities[i * 3 + 1] -= 0.00075;
        pos[i * 3] += fx.velocities[i * 3];
        pos[i * 3 + 1] += fx.velocities[i * 3 + 1];
        pos[i * 3 + 2] += fx.velocities[i * 3 + 2];
      }
      fx.object.geometry.attributes.position.needsUpdate = true;
      fx.object.material.opacity = Math.max(0, 1 - fx.age / 4.2);
      if (fx.age > 4.2) this.clearProposalFx();
    }

    if (fx.type === 'celebration' && fx.fireworks) {
      fx.fireworks.rotation.y += delta * 0.35;
      fx.fireworks.children.forEach((p, i) => {
        p.scale.multiplyScalar(1 + delta * 0.12);
        p.material.opacity = Math.max(0.1, 1 - fx.age / 5);
        p.position.y += Math.sin(fx.age * 2 + i) * delta * 0.03;
      });
      if (fx.age > 5.5) this.clearProposalFx();
    }

    if (fx.type === 'rain' && fx.rain) {
      const pos = fx.rain.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 6) {
        pos[i + 1] -= delta * 10;
        pos[i + 4] -= delta * 10;
        if (pos[i + 1] < -12) {
          pos[i + 1] = 12;
          pos[i + 4] = 11.5;
        }
      }
      fx.rain.geometry.attributes.position.needsUpdate = true;
      this.scene.fog.density = 0.055;
      if (fx.heart) {
        fx.heart.rotation.z += delta * 0.08;
        fx.heart.position.y -= delta * 0.18;
        fx.heart.children[0].position.x -= delta * 0.12;
        fx.heart.children[1].position.x += delta * 0.12;
      }
    }
  }

  updateCamera() {
    const eased = THREE.MathUtils.damp(this.progress, this.targetProgress, 4.5, 1 / 60);
    this.progress = eased;
    const y = -56 * eased;
    const wave = Math.sin(eased * Math.PI * 6) * 0.8;
    this.camera.position.y = y;
    this.camera.position.x = wave * (this.mobile ? 0.35 : 0.7);
    this.camera.position.z = 10 - Math.sin(eased * Math.PI) * 2.3;
    this.camera.rotation.x = Math.sin(eased * Math.PI * 2) * 0.025;
    this.camera.rotation.y = -wave * 0.018;
    this.camera.lookAt(this.camera.position.x * 0.12, y - 0.7, 0);

    if (this.heroHeart) {
      this.heroHeart.rotation.y += 0.003;
      this.heroHeart.rotation.z = Math.sin(this.clock.elapsedTime * 0.7) * 0.08;
      this.heroHeart.scale.setScalar(1 + Math.sin(this.clock.elapsedTime * 1.4) * 0.035);
    }
  }

  handleResize() {
    this.mobile = window.innerWidth < 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if (this.destroyed) return;
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    this.updateCamera();

    this.stars.rotation.y = elapsed * 0.008;
    this.wishesGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.05;
    this.lettersGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.05;
    this.capsuleGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.08;
    this.finaleGroup.rotation.z = elapsed * 0.12;
    this.memoryGroup.children.forEach((mesh, i) => {
      mesh.position.y += Math.sin(elapsed * 0.7 + i) * 0.0008;
      mesh.rotation.y += 0.0008;
    });
    this.ambientHearts.children.forEach((heart) => {
      heart.position.y += Math.sin(elapsed * heart.userData.speed + heart.userData.phase) * 0.0018;
      heart.rotation.y += 0.003;
    });

    if (this.pinkLight) this.pinkLight.position.x = Math.sin(elapsed * 0.45) * 6;
    if (this.goldLight) this.goldLight.position.y = Math.cos(elapsed * 0.35) * 7;

    this.updateProposalFx(delta);
    this.renderer.render(this.scene, this.camera);
    this.tick = requestAnimationFrame(this.animate);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.tick);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('miya:proposal', this.handleProposal);
    this.clearProposalFx();
    disposeObject(this.scene);
    this.renderer.dispose();
    if (this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
