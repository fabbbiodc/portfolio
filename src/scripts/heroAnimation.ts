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
  BloomEffect,
} from "postprocessing";
import { COLORS } from "./colors";

// constants
const EASING = 0.1;
const EYE_MAX_ROTATION_X = Math.PI * 0.25;
const EYE_MAX_ROTATION_Y = Math.PI * 0.25;
const MONITOR_MAX_ROTATION_X = Math.PI * 0.25;
const MONITOR_MAX_ROTATION_Y = Math.PI * 0.25;
const MONITOR_ROTATION_SENSITIVITY = 0.005;
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
  private eyeTargetRotationX = 0;
  private eyeTargetRotationY = 0;
  private eyeCurrentRotationX = 0;
  private eyeCurrentRotationY = 0;
  private monitorTargetRotationX = 0;
  private monitorTargetRotationY = 0;
  private monitorCurrentRotationX = 0;
  private monitorCurrentRotationY = 0;
  private isRotatingMonitor = false;
  private previousMouseX = 0;
  private previousMouseY = 0;

  // --- Post-processing ---
  private screenComposer!: EffectComposer;
  private mainComposer!: EffectComposer;

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
    this.mainScene.background = null;

    this.screenScene = new THREE.Scene();
    this.screenScene.background = new THREE.Color(COLORS.DARK_BLACK);

    this.mainCamera = new THREE.PerspectiveCamera(
      30,
      this.canvas.clientWidth / this.canvas.clientHeight,
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
      premultipliedAlpha: false,
    });

    this.mainRenderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
    );
    this.mainRenderer.setClearColor(COLORS.DARK_BLACK, 0);

    if (this.isMobile) {
      this.mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } else {
      this.mainRenderer.setPixelRatio(window.devicePixelRatio);
    }
    this.mainRenderer.shadowMap.enabled = true;
    this.mainRenderer.shadowMap.type = this.isMobile
      ? THREE.PCFShadowMap
      : THREE.PCFSoftShadowMap;
  }

  private setupLights() {
    const mainAmbientLight = new THREE.AmbientLight(COLORS.LIGHT_WHITE, 2);
    this.mainScene.add(mainAmbientLight);
    const mainDirectionalLight = new THREE.DirectionalLight(COLORS.LIGHT_WHITE, 2);
    mainDirectionalLight.position.set(0, 10, 0);
    // mainDirectionalLight.position.set(5, 10, 2);
    mainDirectionalLight.castShadow = true;

    const extraDirectionalLight = new THREE.DirectionalLight(COLORS.LIGHT_WHITE, 2);
    extraDirectionalLight.position.set(5, 10, 2);
    this.mainScene.add(extraDirectionalLight);

    const shadowMapSize = this.isMobile ? 512 : 1024;
    mainDirectionalLight.shadow.mapSize.width = shadowMapSize;
    mainDirectionalLight.shadow.mapSize.height = shadowMapSize;
    mainDirectionalLight.shadow.camera.near = 0.5;
    mainDirectionalLight.shadow.camera.far = 50;

    mainDirectionalLight.shadow.camera.left = -10;
    mainDirectionalLight.shadow.camera.right = 10;
    mainDirectionalLight.shadow.camera.top = 10;
    mainDirectionalLight.shadow.camera.bottom = -10;
    mainDirectionalLight.shadow.bias = -0.001;
    mainDirectionalLight.shadow.radius = this.isMobile ? 2 : 10;

    this.mainScene.add(mainDirectionalLight);

    const screenAmbientLight = new THREE.AmbientLight(COLORS.LIGHT_WHITE, 1);
    this.screenScene.add(screenAmbientLight);
    const screenDirectionalLight = new THREE.DirectionalLight(COLORS.LIGHT_WHITE, 1);
    screenDirectionalLight.position.set(5, 5, 5);
    this.screenScene.add(screenDirectionalLight);
  }

  private setupPostProcessing() {
    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    this.screenComposer = new EffectComposer(this.mainRenderer);
    this.screenComposer.autoRenderToScreen = false; // CRITICAL: prevents hijacking main canvas

    this.mainComposer = new EffectComposer(this.mainRenderer);

    // Calculate composer size with proper aspect ratio
    const composerHeight = Math.round(RENDER_TARGET_SIZE / canvasAspect);
    this.screenComposer.setSize(RENDER_TARGET_SIZE, composerHeight);
    this.mainRenderer.setSize(canvasWidth, canvasHeight);

    const renderPassMain = new RenderPass(this.mainScene, this.mainCamera);
    const bloomEffect = new BloomEffect({
      intensity: 0.4,
      luminanceThreshold: 0.1,
      blendFunction: BlendFunction.ADD,
    });

    const effectPassMain = new EffectPass(this.mainCamera, bloomEffect);
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
      const center = monitorBox.getCenter(new THREE.Vector3());
      monitor.position.sub(center);

      const centeredBox = new THREE.Box3().setFromObject(monitor);
      const bottomY = centeredBox.min.y;

      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
      const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = bottomY;
      shadowPlane.receiveShadow = true;
      this.mainScene.add(shadowPlane);

      this.mainScene.add(this.monitorGroup);
      this.frameCameraOnMonitor();
      this.animate();
    });
  }

  private frameCameraOnMonitor() {
    if (!this.monitorGroup) return;

    this.monitorGroup.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(this.monitorGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    if (this.isMobile && this.screenMesh) {
      new THREE.Box3().setFromObject(this.screenMesh).getCenter(center);
      center.y -= size.y * 0.25;
    }

    const fovRad = (this.mainCamera.fov * Math.PI) / 180;
    const halfFov = fovRad / 2;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;

    const distByHeight = size.y / (2 * Math.tan(halfFov));
    const distByWidth = size.x / (2 * Math.tan(halfFov) * aspect);

    const scaling = this.isMobile ? 1.1 : 0.8;
    const zDist = Math.max(distByHeight, distByWidth) / scaling;

    if (this.isMobile) {
      this.mainCamera.position.set(0, 0, zDist);
      this.mainCamera.lookAt(center);
    } else {
      this.mainCamera.position.set(2, 0, zDist);

      const corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z),
      ];

      let ndcMinX = Infinity,
        ndcMaxX = -Infinity;
      let ndcMinY = Infinity,
        ndcMaxY = -Infinity;
      for (const p of corners) {
        p.project(this.mainCamera);
        ndcMinX = Math.min(ndcMinX, p.x);
        ndcMaxX = Math.max(ndcMaxX, p.x);
        ndcMinY = Math.min(ndcMinY, p.y);
        ndcMaxY = Math.max(ndcMaxY, p.y);
      }

      const ndcCenterX = (ndcMinX + ndcMaxX) / 2;
      const ndcCenterY = (ndcMinY + ndcMaxY) / 2;

      const ndcPoint = new THREE.Vector3(ndcCenterX, ndcCenterY, 1);
      ndcPoint.unproject(this.mainCamera);
      const dir = new THREE.Vector3()
        .copy(ndcPoint)
        .sub(this.mainCamera.position)
        .normalize();
      const distToCenter = this.mainCamera.position.distanceTo(center);
      const lookTarget = this.mainCamera.position
        .clone()
        .add(dir.multiplyScalar(distToCenter));
      lookTarget.y += size.y * 0.05;
      this.mainCamera.lookAt(lookTarget);
    }

    this.mainCamera.updateProjectionMatrix();
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

  private setupEventHandlers() {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    document.addEventListener("mousedown", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.mainCamera);

      if (this.monitorGroup) {
        const intersects = raycaster.intersectObject(this.monitorGroup, true);
        if (intersects.length > 0) {
          this.isRotatingMonitor = true;
          this.previousMouseX = event.clientX;
          this.previousMouseY = event.clientY;
          event.preventDefault();
        }
      }
    });

    document.addEventListener("mousemove", (event) => {
      if (this.isRotatingMonitor && this.monitorGroup) {
        const deltaX = event.clientX - this.previousMouseX;
        const deltaY = event.clientY - this.previousMouseY;

        this.monitorTargetRotationY += deltaX * MONITOR_ROTATION_SENSITIVITY;
        this.monitorTargetRotationX += deltaY * MONITOR_ROTATION_SENSITIVITY;
        this.monitorTargetRotationX = Math.max(
          -MONITOR_MAX_ROTATION_X,
          Math.min(MONITOR_MAX_ROTATION_X, this.monitorTargetRotationX),
        );
        this.monitorTargetRotationY = Math.max(
          -MONITOR_MAX_ROTATION_Y,
          Math.min(MONITOR_MAX_ROTATION_Y, this.monitorTargetRotationY),
        );

        this.previousMouseX = event.clientX;
        this.previousMouseY = event.clientY;
      }

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
      this.isRotatingMonitor = false;
    });

    window.addEventListener("resize", () => {
      const parent = this.canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const newAspect = width / height;

      this.mainCamera.aspect = newAspect;
      this.mainCamera.updateProjectionMatrix();
      this.frameCameraOnMonitor();
      this.mainRenderer.setSize(width, height);

      // Update composer with correct aspect ratio
      const newComposerHeight = Math.round(RENDER_TARGET_SIZE / newAspect);
      this.screenComposer.setSize(RENDER_TARGET_SIZE, newComposerHeight);
      this.mainComposer.setSize(width, height);
    });

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
    // This counteracts the phone's tilt so the eye stays locked in the same real-world direction
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

    if (this.monitorGroup) {
      const eyeQuat = new THREE.Quaternion();
      eyeQuat.setFromEuler(
        new THREE.Euler(clampedRotationX, clampedRotationY, 0, "YXZ"),
      );

      const monitorQuat = new THREE.Quaternion();
      monitorQuat.setFromEuler(
        new THREE.Euler(
          this.monitorCurrentRotationX,
          this.monitorCurrentRotationY,
          0,
          "YXZ",
        ),
      );

      const finalQuat = monitorQuat.clone().multiply(eyeQuat);
      const finalEuler = new THREE.Euler().setFromQuaternion(finalQuat, "YXZ");

      this.eyeModel.rotation.x = finalEuler.x;
      this.eyeModel.rotation.y = finalEuler.y;
    } else {
      this.eyeModel.rotation.x = clampedRotationX;
      this.eyeModel.rotation.y = clampedRotationY;
    }
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
