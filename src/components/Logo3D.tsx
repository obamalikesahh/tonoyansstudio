"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

interface Logo3DProps {
  onIntroComplete?: () => void;
  interactive?: boolean;
}

export default function Logo3D({ onIntroComplete, interactive = true }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera starting back for zoom
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 4. Subtle Warm Cream Marble Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5ebe0, 3.4);
    dirLight1.position.set(6, 12, 8);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe8d8c4, 2.0);
    dirLight2.position.set(-6, -5, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfff5ea, 2.8, 30);
    pointLight.position.set(0, 0, 6);
    scene.add(pointLight);

    // 5. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = false;

    // 6. Load GLB & Ideal 2.5s Spin Intro
    let pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    const loader = new GLTFLoader();

    loader.load(
      "/logo.glb",
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Exact centering at (0, 0, 0) inside pivotGroup
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        pivotGroup.add(model);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = maxDim > 0 ? 3.4 / maxDim : 1.2;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.2;
              mat.metalness = 0.92;
              mat.needsUpdate = true;
            }
          }
        });

        // Start small & rotated
        pivotGroup.scale.set(0.01, 0.01, 0.01);
        pivotGroup.rotation.y = 0;
        pivotGroup.position.set(0, 0, 0);

        setLoading(false);

        // Ideal 2.5s Spin Intro Timeline (Perfect smooth speed!)
        const tl = gsap.timeline({
          onComplete: () => {
            setIntroDone(true);
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.5;
            if (onIntroComplete) onIntroComplete();
          },
        });

        tl.to(camera.position, {
          z: 5.2,
          duration: 2.5,
          ease: "power2.out",
        }, 0);

        tl.to(pivotGroup.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 2.5,
          ease: "power2.out",
        }, 0);

        tl.to(pivotGroup.rotation, {
          y: Math.PI * 4, // 2 full smooth rotations over 2.5 seconds
          duration: 2.5,
          ease: "power1.inOut",
        }, 0);
      },
      undefined,
      (err) => {
        console.error("Error loading /logo.glb:", err);
        setLoading(false);
        if (onIntroComplete) onIntroComplete();
      }
    );

    // Mouse tilt tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      if (pivotGroup && introDone && interactive) {
        pivotGroup.rotation.x = THREE.MathUtils.lerp(pivotGroup.rotation.x, mouseY * 0.2, 0.05);
        pivotGroup.rotation.z = THREE.MathUtils.lerp(pivotGroup.rotation.z, -mouseX * 0.12, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl sm:max-w-2xl aspect-square flex items-center justify-center select-none group mx-auto my-auto min-h-[350px]">
      {/* Subtle Cream Marble Halo Glow */}
      <div className={`absolute inset-4 rounded-full bg-gradient-to-tr from-[#E8D8C4]/20 via-[#D5C2A5]/15 to-transparent blur-3xl transition-opacity duration-700 pointer-events-none ${introDone ? "opacity-80 group-hover:opacity-100" : "opacity-40"}`} />

      {/* Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing z-0 flex items-center justify-center" />
    </div>
  );
}
