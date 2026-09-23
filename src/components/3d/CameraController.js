import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.ctx = gsap.context(() => {});
    this.initScrollTriggers();
  }

  initScrollTriggers() {
    const sectionWaypoints = [
      { id: 'intro-section', pos: { x: 0, y: 0, z: 10 }, rot: { x: 0, y: 0 } },
      { id: 'birthday-reveal-section', pos: { x: 0, y: -3.5, z: 8.5 }, rot: { x: -0.05, y: 0.05 } },
      { id: 'first-meeting-section', pos: { x: 1.8, y: -7, z: 7.5 }, rot: { x: 0.08, y: -0.08 } },
      { id: 'timeline-section', pos: { x: -1.8, y: -11, z: 7 }, rot: { x: 0, y: 0.08 } },
      { id: 'memories-section', pos: { x: 0, y: -15, z: 6.5 }, rot: { x: -0.05, y: -0.05 } },
      { id: 'birthday-wishes-section', pos: { x: 0, y: -19, z: 8 }, rot: { x: 0, y: 0 } },
      { id: 'open-when-section', pos: { x: -1.5, y: -23, z: 7 }, rot: { x: -0.08, y: -0.08 } },
      { id: 'love-letter-section', pos: { x: 0, y: -27, z: 6 }, rot: { x: 0, y: 0 } },
      { id: 'time-capsule-section', pos: { x: 1.5, y: -31, z: 7.5 }, rot: { x: 0.08, y: -0.05 } },
      { id: 'finale-section', pos: { x: 0, y: -35, z: 9 }, rot: { x: 0, y: 0 } },
      { id: 'proposal-section', pos: { x: 0, y: -39, z: 8 }, rot: { x: 0, y: 0 } },
    ];

    sectionWaypoints.forEach((wp) => {
      const element = document.getElementById(wp.id);
      if (!element) return;

      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => this.animateCamera(wp.pos, wp.rot),
        onEnterBack: () => this.animateCamera(wp.pos, wp.rot),
      });
    });
  }

  animateCamera(pos, rot) {
    if (!this.camera) return;

    gsap.to(this.camera.position, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration: 1.4,
      ease: 'power2.out',
    });

    gsap.to(this.camera.rotation, {
      x: rot.x,
      y: rot.y,
      duration: 1.4,
      ease: 'power2.out',
    });
  }

  destroy() {
    this.ctx.revert();
  }
}
