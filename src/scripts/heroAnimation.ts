// imports
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  ScanlineEffect,
  PixelationEffect,
  BlendFunction,
  GlitchEffect,
  SelectiveBloomEffect,
} from "postprocessing";
import { COLORS } from "./colors";

// constants
const EASING = 0.1;
const EYE_MAX_ROTATION_X = Math.PI * 0.25;
const EYE_MAX_ROTATION_Y = Math.PI * 0.25;
const EYE_TRACKING_SENSITIVITY = 0.003;
const RENDER_TARGET_SIZE = 1024;
const PIXEL_SIZE = 4;

// helpers
function mobileDetection(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipad|ipod|blackberry|webos/.test(userAgent);
}

class HeroAnimation {
  // --- Canvas & FPS ---
  private canvas: HTMLCanvasElement;
  private isMobile: boolean;
  private lastFrameTime: number;
  private targetFrameTime: number;

  // --- Scenes & Cameras ---
  private mainScene!: THREE.Scene;
  private screenScene!: THREE.Scene;
  private mainCamera!: THREE.PerspectiveCamera;
  private screenCamera!: THREE.PerspectiveCamera;

  // --- Renderer ---
  private mainRenderer!: THREE.WebGLRenderer;

  // --- State ---
  private screenMesh: THREE.Mesh | undefined;
  private eyeModel: THREE.Group | undefined;
  private monitorGroup: THREE.Group | undefined;
  private mainDirectionalLight: THREE.DirectionalLight | undefined;
  private eyeTargetRotationX = 0;
  private eyeTargetRotationY = 0;
  private eyeCurrentRotationX = 0;
  private eyeCurrentRotationY = 0;

  // --- Post-processing ---
  private screenComposer!: EffectComposer;
  private mainComposer!: EffectComposer;
  private selectiveBloom!: SelectiveBloomEffect;

  private monitorAspectRatio = 1.77; // Default 16:9 until model loads

  constructor(canvasId: string) {
    const canvas = document.getElementById(
      canvasId,
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`[HeroAnimation] Canvas element #${canvasId} not found`);
    }
    this.canvas = canvas;
    this.isMobile = mobileDetection();
    this.lastFrameTime = Date.now();
    this.targetFrameTime = 1000 / (this.isMobile ? 30 : 60);

    this.setupScenesAndCameras();
    this.setupRenderer();
    this.setupLights();
    this.setupPostProcessing();
    this.handleResize();
  }

  start() {
    this.loadEyeModel();
    this.loadMonitorModel();
    this.loadHDRBackground();
    this.setupEventHandlers();
  }

  // --- Setup ---

  private setupScenesAndCameras() {
    this.mainScene = new THREE.Scene();
    // this.mainScene.background = new THREE.Color(0, 0 ,0);
    this.mainScene.background = null;

    this.screenScene = new THREE.Scene();
    this.screenScene.background = new THREE.Color(COLORS.DARK_BLACK);

    this.mainCamera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    if (this.isMobile) {
      this.mainCamera.position.set(0, 0, 5);
    } else {
      this.mainCamera.position.set(2, 0, 5);
    }
    this.mainCamera.lookAt(0, 0, 0);

    this.screenCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.screenCamera.position.set(3, 2, 1);
  }

  private setupRenderer() {
    this.mainRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile,
      alpha: true,
      premultipliedAlpha: true,
    });

    this.mainRenderer.setClearColor(0x000000, 0);

    if (this.isMobile) {
      this.mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } else {
      this.mainRenderer.setPixelRatio(window.devicePixelRatio);
    }
    this.mainRenderer.shadowMap.enabled = true;
    this.mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private updateShadowCameraBounds(light: THREE.DirectionalLight) {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const horizontalBound = 5 * aspect;
    light.shadow.camera.left = -horizontalBound;
    light.shadow.camera.right = horizontalBound;
    light.shadow.camera.top = 5;
    light.shadow.camera.bottom = -5;
  }

  private setupLights() {
    const mainAmbientLight = new THREE.AmbientLight(COLORS.LIGHT_WHITE, 2);
    this.mainScene.add(mainAmbientLight);
    this.mainDirectionalLight = new THREE.DirectionalLight(
      COLORS.LIGHT_WHITE,
      2,
    );
    this.mainDirectionalLight.position.set(0, 10, 5);
    this.mainDirectionalLight.castShadow = true;

    const extraDirectionalLight = new THREE.DirectionalLight(
      COLORS.LIGHT_WHITE,
      2,
    );
    extraDirectionalLight.position.set(5, 10, 2);
    this.mainScene.add(extraDirectionalLight);

    const shadowMapSize = this.isMobile ? 512 : 1024;
    this.mainDirectionalLight.shadow.mapSize.width = shadowMapSize;
    this.mainDirectionalLight.shadow.mapSize.height = shadowMapSize;
    this.mainDirectionalLight.shadow.camera.near = 0.5;
    this.mainDirectionalLight.shadow.camera.far = 50;
    this.mainDirectionalLight.shadow.normalBias = 0.02;

    this.updateShadowCameraBounds(this.mainDirectionalLight);
    this.mainDirectionalLight.shadow.bias = -0.001;
    this.mainDirectionalLight.shadow.radius = this.isMobile ? 4 : 8;

    this.mainScene.add(this.mainDirectionalLight);

    const screenAmbientLight = new THREE.AmbientLight(COLORS.LIGHT_WHITE, 1);
    this.screenScene.add(screenAmbientLight);
    const screenDirectionalLight = new THREE.DirectionalLight(
      COLORS.LIGHT_WHITE,
      1,
    );
    screenDirectionalLight.position.set(5, 5, 5);
    this.screenScene.add(screenDirectionalLight);
  }

  private setupPostProcessing() {
    this.screenComposer = new EffectComposer(this.mainRenderer);
    this.screenComposer.autoRenderToScreen = false; // CRITICAL: prevents hijacking main canvas

    this.mainComposer = new EffectComposer(this.mainRenderer);

    const renderPassMain = new RenderPass(this.mainScene, this.mainCamera);
    this.selectiveBloom = new SelectiveBloomEffect(
      this.mainScene,
      this.mainCamera,
      {
        intensity: 0.4,
        luminanceThreshold: 0.1,
        radius: 0.3,
        blendFunction: BlendFunction.ADD,
      },
    );
    this.selectiveBloom.ignoreBackground = true;

    const effectPassMain = new EffectPass(this.mainCamera, this.selectiveBloom);
    this.mainComposer.addPass(renderPassMain);
    this.mainComposer.addPass(effectPassMain);

    const renderPassScreen = new RenderPass(
      this.screenScene,
      this.screenCamera,
    );
    const pixelationEffect = new PixelationEffect(PIXEL_SIZE);

    const scanlineEffect = new ScanlineEffect({
      blendFunction: BlendFunction.OVERLAY,
      density: 1.25,
    });
    scanlineEffect.blendMode.opacity.value = 0.4;
    scanlineEffect.scrollSpeed = 0.03;

    const glitchEffect = new GlitchEffect({
      duration: new THREE.Vector2(0.3, 0.2),
      delay: new THREE.Vector2(5, 10),
    });

    const effectPassScreen = new EffectPass(
      this.screenCamera,
      pixelationEffect,
      scanlineEffect,
      glitchEffect,
    );
    this.screenComposer.addPass(renderPassScreen);
    this.screenComposer.addPass(effectPassScreen);
  }

  // --- Models ---

  private loadEyeModel() {
    const eyeLoader = new GLTFLoader();
    eyeLoader.load("/models/eye.glb", (gltf) => {
      this.eyeModel = gltf.scene;
      const eyeBox = new THREE.Box3().setFromObject(this.eyeModel);
      const eyeCenter = eyeBox.getCenter(new THREE.Vector3());
      this.eyeModel.position.sub(eyeCenter);
      this.screenScene.add(this.eyeModel);

      const size = new THREE.Vector3();
      eyeBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      this.screenCamera.position.set(0, 0, maxDim * 1);
      this.screenCamera.lookAt(0, 0, 0);
    });
  }

  private setupScreenMeshTexture() {
    if (!this.screenMesh) return;
    this.screenMesh.geometry.computeBoundingBox();
    if (!this.screenMesh.geometry.boundingBox) return;
    const boundingBox = this.screenMesh.geometry.boundingBox;
    const positionAttribute = this.screenMesh.geometry.attributes.position;
    const uvAttribute = this.screenMesh.geometry.attributes.uv;

    // monitor.glb uv setup
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const u =
        (x - boundingBox.min.x) / (boundingBox.max.x - boundingBox.min.x);
      const v =
        1 - (y - boundingBox.min.y) / (boundingBox.max.y - boundingBox.min.y);
      uvAttribute.setXY(i, u, v);
    }

    uvAttribute.needsUpdate = true;
    this.screenMesh.material = new THREE.MeshBasicMaterial({
      map: this.screenComposer.outputBuffer.texture,
    });
    this.screenMesh.material.needsUpdate = true;
  }

  private loadMonitorModel() {
    const monitorLoader = new GLTFLoader();
    monitorLoader.load("/models/monitor.glb", (gltf) => {
      this.monitorGroup = new THREE.Group();
      const monitor = gltf.scene;
      monitor.scale.set(3, 3, 3);

      monitor.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.monitorGroup.add(monitor);

      this.screenMesh = monitor.getObjectByName("Cylinder003_Material004_0") as
        | THREE.Mesh
        | undefined;

      this.setupScreenMeshTexture();

      const monitorBox = new THREE.Box3().setFromObject(monitor);
      const size = new THREE.Vector3();
      monitorBox.getSize(size);
      this.monitorAspectRatio = size.x / size.y;

      const center = monitorBox.getCenter(new THREE.Vector3());
      monitor.position.sub(center);

      const centeredBox = new THREE.Box3().setFromObject(monitor);
      const bottomY = centeredBox.min.y;

      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.ShadowMaterial({
        opacity: 0.4,
        depthWrite: false,
      });
      const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = bottomY - 0.01; // Tiny offset to prevent z-fighting with model base
      shadowPlane.receiveShadow = true;
      this.mainScene.add(shadowPlane);

      this.mainScene.add(this.monitorGroup);
      this.monitorGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          this.selectiveBloom.selection.add(child);
        }
      });
      this.monitorGroup.rotation.set(0, 0, 0);
      this.handleResize();
      this.animate();
    });
  }

  // --- Background screenScene ---

  private loadHDRBackground() {
    const hdrLoader = new HDRLoader();
    hdrLoader.load("/models/bunker.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.screenScene.background = texture;
      this.screenScene.environment = texture;
    });
  }

  // --- Interaction ---

  private handleResize() {
    const vpw = window.innerWidth;
    const vph = window.innerHeight;

    let canvasWidth, canvasHeight;
    const isLandscape = vpw > vph;

    if (isLandscape) {
      canvasHeight = vph;
      const horizontalPaddingFactor = 1.0;
      canvasWidth = Math.min(
        vpw * 0.7,
        canvasHeight * this.monitorAspectRatio * horizontalPaddingFactor,
      );
    } else {
      canvasWidth = vpw;
      const verticalPaddingFactor = 1.4;
      canvasHeight = Math.min(
        vph,
        canvasWidth / (this.monitorAspectRatio / verticalPaddingFactor),
      );
    }

    const newAspect = canvasWidth / canvasHeight;

    this.mainRenderer.setSize(canvasWidth, canvasHeight);

    this.mainCamera.aspect = newAspect;
    this.mainCamera.updateProjectionMatrix();
    this.frameCameraOnMonitor(isLandscape);

    // Update shadow camera bounds for aspect ratio
    if (this.mainDirectionalLight) {
      this.updateShadowCameraBounds(this.mainDirectionalLight);
    }

    // Update composer with correct aspect ratio
    const newComposerHeight = Math.round(RENDER_TARGET_SIZE / newAspect);
    this.screenComposer.setSize(RENDER_TARGET_SIZE, newComposerHeight);
    this.mainComposer.setSize(canvasWidth, canvasHeight);
  }

  private frameCameraOnMonitor(isLandscape: boolean) {
    if (!this.monitorGroup) return;

    this.monitorGroup.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(this.monitorGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // If we have the screenMesh, use its X position as the "true" horizontal center
    let trueCenterX = center.x;
    if (this.screenMesh) {
      const screenBox = new THREE.Box3().setFromObject(this.screenMesh);
      const screenCenter = new THREE.Vector3();
      screenBox.getCenter(screenCenter);
      trueCenterX = screenCenter.x;
    }

    const fovRad = (this.mainCamera.fov * Math.PI) / 180;
    const halfFov = fovRad / 2;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;

    const distByHeight = size.y / (2 * Math.tan(halfFov));
    const distByWidth = size.x / (2 * Math.tan(halfFov) * aspect);

    const scaling = isLandscape ? 0.8 : 0.95;
    const zDist = Math.max(distByHeight, distByWidth) / scaling;

    const xOffset = isLandscape ? trueCenterX + 2 : trueCenterX;
    this.mainCamera.position.set(xOffset, 0, zDist);

    const lookTarget = new THREE.Vector3(trueCenterX, 0, 0);
    if (isLandscape) {
      // Aim slightly to the left of the monitor to shift the monitor to the right of the canvas
      lookTarget.x -= 0.4;
      lookTarget.y += size.y * 0.02;
    }
    this.mainCamera.lookAt(lookTarget);

    this.mainCamera.updateProjectionMatrix();
  }

  private setupEventHandlers() {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    document.addEventListener("mousedown", (event) => {
      // Monitor rotation controls removed
    });

    document.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();

      let refX = rect.left + rect.width / 2;
      let refY = rect.top + rect.height / 2;

      if (this.screenMesh) {
        const meshCenter = new THREE.Vector3();
        new THREE.Box3().setFromObject(this.screenMesh).getCenter(meshCenter);
        meshCenter.project(this.mainCamera);
        refX = ((meshCenter.x + 1) / 2) * rect.width + rect.left;
        refY = ((1 - meshCenter.y) / 2) * rect.height + rect.top;
      }

      const offsetX = event.clientX - refX;
      const offsetY = event.clientY - refY;

      this.eyeTargetRotationX = -offsetY * EYE_TRACKING_SENSITIVITY;
      this.eyeTargetRotationY = -offsetX * EYE_TRACKING_SENSITIVITY;
    });

    document.addEventListener("mouseup", () => {
      // Monitor rotation controls removed
    });

    window.addEventListener("resize", () => this.handleResize());

    // mobile tilt tracking
    const permissionOverlay = document.getElementById(
      "tilt-permission-overlay",
    );
    const enableTiltBtn = document.getElementById("enable-tilt-btn");

    // Check if the device uses iOS 13+ permission API
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      // permission for ios devices
      if (permissionOverlay && enableTiltBtn) {
        permissionOverlay.classList.remove("hidden"); // Show the overlay

        enableTiltBtn.addEventListener("click", () => {
          (DeviceOrientationEvent as any)
            .requestPermission()
            .then((permissionState: string) => {
              if (permissionState === "granted") {
                window.addEventListener("deviceorientation", (event) =>
                  this.handleOrientation(event),
                );
                permissionOverlay.classList.add("hidden");
              } else {
                console.warn("Device orientation permission denied");
                enableTiltBtn.innerText = "Permission Denied";
              }
            })
            .catch(console.error);
        });
      }
    } else {
      // non ios devices
      if (permissionOverlay) {
        permissionOverlay.classList.add("hidden");
      }
      window.addEventListener("deviceorientation", (event) =>
        this.handleOrientation(event),
      );
    }
  }

  private handleOrientation(event: DeviceOrientationEvent) {
    if (event.beta === null || event.gamma === null) return;

    // optimized for device held at 45 degrees
    let normalizedGamma = -(event.gamma / 45);
    let normalizedBeta = -((event.beta - 45) / 45);

    // // ortogonal orientation
    // let normalizedGamma = event.gamma / 45;
    // let normalizedBeta = event.beta / 45;

    // Clamp the values to keep it within the -1.0 to 1.0 range
    normalizedGamma = Math.max(-1, Math.min(1, normalizedGamma));
    normalizedBeta = Math.max(-1, Math.min(1, normalizedBeta));

    // INVERT the rotations by making them negative
    this.eyeTargetRotationY = -normalizedGamma * EYE_MAX_ROTATION_Y;
    this.eyeTargetRotationX = -normalizedBeta * EYE_MAX_ROTATION_X;
  }

  // --- Animation ---

  private updateMonitorRotation() {
    if (!this.monitorGroup) return;
  }

  private updateEyeRotation() {
    if (!this.eyeModel) return;

    this.eyeCurrentRotationX +=
      (this.eyeTargetRotationX - this.eyeCurrentRotationX) * EASING;
    this.eyeCurrentRotationY +=
      (this.eyeTargetRotationY - this.eyeCurrentRotationY) * EASING;

    const clampedRotationX = Math.max(
      -EYE_MAX_ROTATION_X,
      Math.min(EYE_MAX_ROTATION_X, this.eyeCurrentRotationX),
    );
    const clampedRotationY = Math.max(
      -EYE_MAX_ROTATION_Y,
      Math.min(EYE_MAX_ROTATION_Y, this.eyeCurrentRotationY),
    );

    this.eyeModel.rotation.x = clampedRotationX;
    this.eyeModel.rotation.y = clampedRotationY;
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    const now = Date.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= this.targetFrameTime) {
      this.lastFrameTime = now;

      this.updateMonitorRotation();
      this.updateEyeRotation();
      this.screenComposer.render();
      this.mainComposer.render();
      // mainRenderer.setRenderTarget(null);
      // mainRenderer.render(mainScene, mainCamera);
    }
  }
}

// entry point
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new HeroAnimation("hero-animation").start();
  });
} else {
  new HeroAnimation("hero-animation").start();
}
