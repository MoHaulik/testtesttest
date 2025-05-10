/**
 * Bubble character module for Crystal Runner
 * This module exports functions to create and update the bubble player character
 */
import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

/**
 * Creates a soap bubble player character
 * @returns {THREE.Group} The bubble player object
 */
export function createBubblePlayer() {
  const grp = new THREE.Group();
  
  // Create sphere geometry for soap bubble
  const geom = new THREE.SphereGeometry(0.12, 32, 32);
  
  // Create soap bubble material (iridescent, transparent)
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    envMapIntensity: 2.0,
    opacity: 0.8,
    transparent: true
  });
  
  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  grp.add(mesh);
  
  // Rainbow colored point light
  const bubbleLight = new THREE.PointLight(0xffffff, 1.0, 0.5);
  grp.add(bubbleLight);
  
  return grp;
}

/**
 * Updates the bubble player's animation and appearance
 * @param {THREE.Group} player - The bubble player object
 * @param {Number} time - Current game time for animation
 */
export function updateBubblePlayer(player, time) {
  // Make the bubble wobble slightly
  player.scale.x = 1.0 + Math.sin(time * 5) * 0.03;
  player.scale.y = 1.0 + Math.sin(time * 4.5) * 0.02;
  player.scale.z = 1.0 + Math.sin(time * 4.2) * 0.025;
  
  // Update bubble light color to create rainbow effect
  if (player && player.children.length > 1) {
    const bubbleLight = player.children[1];
    const hue = (time * 0.2) % 1;
    const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
    bubbleLight.color = color;
  }
}

/**
 * Creates a bubble pop explosion effect
 * @param {THREE.Vector3} position - Position for the explosion
 * @param {THREE.Scene} scene - The scene to add particles to
 * @returns {Array} The created particle objects
 */
export function createBubblePop(position, scene) {
  const particles = [];
  
  // Water splash effect for bubble popping
  for (let i = 0; i < 20; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ 
        color: 0x84f7fd, 
        transparent: true, 
        opacity: 0.8 
      })
    );
    
    p.position.copy(position);
    p.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1, 
        (Math.random() - 0.5) * 0.1, 
        (Math.random() - 0.5) * 0.1
      ),
      life: 1.0
    };
    
    scene.add(p);
    particles.push(p);
  }
  
  const flash = new THREE.PointLight(0x84f7fd, 3, 1.5);
  flash.position.copy(position);
  scene.add(flash);
  
  // Remove flash after animation
  setTimeout(() => scene.remove(flash), 200);
  
  return particles;
}
