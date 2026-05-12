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
} from "postprocessing";

const EASING = 0.1;
const EYE_MAX_ROTATION_X = Math.PI * 0.25;
const EYE_MAX_ROTATION_Y = Math.PI * 0.25;
const MONITOR_MAX_ROTATION_X = Math.PI * 0.25;
const MONITOR_MAX_ROTATION_Y = Math.PI * 0.25;
const MONITOR_ROTATION_SENSITIVITY = 0.005;
const EYE_TRACKING_SENSITIVITY = 0.003;
const RENDER_TARGET_SIZE = 1024;
const PIXEL_SIZE = 4;

// device detection
function mobileDetection(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipad|ipod|blackberry|webos/.test(userAgent);
}

function init() {
  const canvas = document.getElementById("hero-animation") as HTMLCanvasElement;
  if (!canvas) {
    console.error("[HeroAnimation] Canvas element not found");
    return;
  }

  const isMobile = mobileDetection();

  let lastFrameTime = Date.now();
  const targetFPS = isMobile ? 30 : 60;
  const targetFrameTime = 1000 / targetFPS;

  const mainScene = new THREE.Scene();
  mainScene.background = null;

  const screenScene = new THREE.Scene();
  screenScene.background = new THREE.Color(0x000000);

  const mainCamera = new THREE.PerspectiveCamera(
    30,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );
  mainCamera.position.set(2, 0, 5);
  mainCamera.lookAt(0, 0, 0);

  const screenCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  screenCamera.position.set(3, 2, 1);

  const mainRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
  });

  mainRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
  mainRenderer.setClearColor(0x000000, 0);

  if (isMobile) {
    mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } else {
    mainRenderer.setPixelRatio(window.devicePixelRatio);
  }
  mainRenderer.shadowMap.enabled = true;
  mainRenderer.shadowMap.type = isMobile
    ? THREE.PCFShadowMap
    : THREE.PCFSoftShadowMap;

  const mainAmbientLight = new THREE.AmbientLight(0xffffff, 2);
  mainScene.add(mainAmbientLight);
  const mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 2);
  mainDirectionalLight.position.set(5, 10, 2);
  mainDirectionalLight.castShadow = true;

  const shadowMapSize = isMobile ? 512 : 1024;
  mainDirectionalLight.shadow.mapSize.width = shadowMapSize;
  mainDirectionalLight.shadow.mapSize.height = shadowMapSize;
  mainDirectionalLight.shadow.camera.near = 0.5;
  mainDirectionalLight.shadow.camera.far = 50;

  mainDirectionalLight.shadow.camera.left = -10;
  mainDirectionalLight.shadow.camera.right = 10;
  mainDirectionalLight.shadow.camera.top = 10;
  mainDirectionalLight.shadow.camera.bottom = -10;
  mainDirectionalLight.shadow.bias = -0.001;
  mainDirectionalLight.shadow.radius = isMobile ? 2 : 10;

  mainScene.add(mainDirectionalLight);

  const screenAmbientLight = new THREE.AmbientLight(0xffffff, 1);
  screenScene.add(screenAmbientLight);
  const screenDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
  screenDirectionalLight.position.set(5, 5, 5);
  screenScene.add(screenDirectionalLight);

  let screenMesh: THREE.Mesh | undefined;
  let eyeModel: THREE.Group | undefined;
  let monitorGroup: THREE.Group | undefined;

  let eyeTargetRotationX = 0;
  let eyeTargetRotationY = 0;
  let eyeCurrentRotationX = 0;
  let eyeCurrentRotationY = 0;

  let monitorTargetRotationX = 0;
  let monitorTargetRotationY = 0;
  let monitorCurrentRotationX = 0;
  let monitorCurrentRotationY = 0;
  let isRotatingMonitor = false;
  let previousMouseX = 0;
  let previousMouseY = 0;

  function loadEyeModel() {
    const eyeLoader = new GLTFLoader();
    eyeLoader.load("/models/eye.glb", (gltf) => {
      eyeModel = gltf.scene;
      const eyeBox = new THREE.Box3().setFromObject(eyeModel);
      const eyeCenter = eyeBox.getCenter(new THREE.Vector3());
      eyeModel.position.sub(eyeCenter);
      screenScene.add(eyeModel);

      const size = new THREE.Vector3();
      eyeBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      screenCamera.position.set(0, 0, maxDim * 1);
      screenCamera.lookAt(0, 0, 0);
    });
  }

  function setupScreenMeshTexture() {
    if (!screenMesh) return;
    screenMesh.geometry.computeBoundingBox();
    if (!screenMesh.geometry.boundingBox) return;
    const boundingBox = screenMesh.geometry.boundingBox;
    const positionAttribute = screenMesh.geometry.attributes.position;
    const uvAttribute = screenMesh.geometry.attributes.uv;

    // monitor.glp uv setup
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
    screenMesh.material = new THREE.MeshBasicMaterial({
      map: screenComposer.outputBuffer.texture,
    });
    screenMesh.material.needsUpdate = true;
  }

  function loadMonitorModel() {
    const monitorLoader = new GLTFLoader();
    monitorLoader.load("/models/monitor.glb", (gltf) => {
      monitorGroup = new THREE.Group();
      const monitor = gltf.scene;
      monitor.scale.set(3, 3, 3);

      monitor.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      monitorGroup.add(monitor);

      screenMesh = monitor.getObjectByName("Cylinder003_Material004_0") as
        | THREE.Mesh
        | undefined;

      setupScreenMeshTexture();

      const monitorBox = new THREE.Box3().setFromObject(monitor);
      const center = monitorBox.getCenter(new THREE.Vector3());
      monitor.position.sub(center);

      const centeredBox = new THREE.Box3().setFromObject(monitor);
      const bottomY = centeredBox.min.y;

      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
      const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = bottomY;
      shadowPlane.receiveShadow = true;
      mainScene.add(shadowPlane);

      mainScene.add(monitorGroup);
      animate();
    });
  }

  function loadHDRBackground() {
    const hdrLoader = new HDRLoader();
    hdrLoader.load("/models/bunker.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      screenScene.background = texture;
      screenScene.environment = texture;
    });
  }

  function setupEventListeners() {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    document.addEventListener("mousedown", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, mainCamera);

      if (monitorGroup) {
        const intersects = raycaster.intersectObject(monitorGroup, true);
        if (intersects.length > 0) {
          isRotatingMonitor = true;
          previousMouseX = event.clientX;
          previousMouseY = event.clientY;
          event.preventDefault();
        }
      }
    });

    document.addEventListener("mousemove", (event) => {
      if (isRotatingMonitor && monitorGroup) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        monitorTargetRotationY += deltaX * MONITOR_ROTATION_SENSITIVITY;
        monitorTargetRotationX += deltaY * MONITOR_ROTATION_SENSITIVITY;
        monitorTargetRotationX = Math.max(
          -MONITOR_MAX_ROTATION_X,
          Math.min(MONITOR_MAX_ROTATION_X, monitorTargetRotationX),
        );
        monitorTargetRotationY = Math.max(
          -MONITOR_MAX_ROTATION_Y,
          Math.min(MONITOR_MAX_ROTATION_Y, monitorTargetRotationY),
        );

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }

      const rect = canvas.getBoundingClientRect();
      const canvasCenterX = rect.left + rect.width / 2;
      const canvasCenterY = rect.top + rect.height / 2;
      const offsetX = event.clientX - canvasCenterX;
      const offsetY = event.clientY - canvasCenterY;

      // invert if using monitor2.glb
      eyeTargetRotationX = -offsetY * EYE_TRACKING_SENSITIVITY;
      eyeTargetRotationY = -offsetX * EYE_TRACKING_SENSITIVITY;
    });

    document.addEventListener("mouseup", () => {
      isRotatingMonitor = false;
    });

    window.addEventListener("resize", () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const newAspect = width / height;

      mainCamera.aspect = newAspect;
      mainCamera.updateProjectionMatrix();
      mainRenderer.setSize(width, height);

      // Update composer with correct aspect ratio
      const newComposerHeight = Math.round(RENDER_TARGET_SIZE / newAspect);
      screenComposer.setSize(RENDER_TARGET_SIZE, newComposerHeight);
    });

    // mobile tilt tracking
    const permissionOverlay = document.getElementById(
      "tilt-permission-overlay",
    );
    const enableTiltBtn = document.getElementById("enable-tilt-btn");

    function handleOrientation(event: DeviceOrientationEvent) {
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
      eyeTargetRotationY = -normalizedGamma * EYE_MAX_ROTATION_Y;
      eyeTargetRotationX = -normalizedBeta * EYE_MAX_ROTATION_X;
    }

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
                window.addEventListener("deviceorientation", handleOrientation);
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
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  const canvasAspect = canvas.clientWidth / canvas.clientHeight;

  const screenComposer = new EffectComposer(mainRenderer);
  screenComposer.autoRenderToScreen = false; // CRITICAL: prevents hijacking main canvas

  // Calculate composer size with proper aspect ratio
  const composerHeight = Math.round(RENDER_TARGET_SIZE / canvasAspect);
  screenComposer.setSize(RENDER_TARGET_SIZE, composerHeight);

  const renderPass = new RenderPass(screenScene, screenCamera);
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

  const effectPass = new EffectPass(
    screenCamera,
    pixelationEffect,
    scanlineEffect,
    glitchEffect,
  );
  screenComposer.addPass(renderPass);
  screenComposer.addPass(effectPass);

  function updateMonitorRotation() {
    if (!monitorGroup) return;
  }

  function updateEyeRotation() {
    if (!eyeModel) return;

    eyeCurrentRotationX += (eyeTargetRotationX - eyeCurrentRotationX) * EASING;
    eyeCurrentRotationY += (eyeTargetRotationY - eyeCurrentRotationY) * EASING;

    const clampedRotationX = Math.max(
      -EYE_MAX_ROTATION_X,
      Math.min(EYE_MAX_ROTATION_X, eyeCurrentRotationX),
    );
    const clampedRotationY = Math.max(
      -EYE_MAX_ROTATION_Y,
      Math.min(EYE_MAX_ROTATION_Y, eyeCurrentRotationY),
    );

    if (monitorGroup) {
      const eyeQuat = new THREE.Quaternion();
      eyeQuat.setFromEuler(
        new THREE.Euler(clampedRotationX, clampedRotationY, 0, "YXZ"),
      );

      const monitorQuat = new THREE.Quaternion();
      monitorQuat.setFromEuler(
        new THREE.Euler(
          monitorCurrentRotationX,
          monitorCurrentRotationY,
          0,
          "YXZ",
        ),
      );

      const finalQuat = monitorQuat.clone().multiply(eyeQuat);
      const finalEuler = new THREE.Euler().setFromQuaternion(finalQuat, "YXZ");

      eyeModel.rotation.x = finalEuler.x;
      eyeModel.rotation.y = finalEuler.y;
    } else {
      eyeModel.rotation.x = clampedRotationX;
      eyeModel.rotation.y = clampedRotationY;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    const now = Date.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= targetFrameTime) {
      lastFrameTime = now;

      updateMonitorRotation();
      updateEyeRotation();
      screenComposer.render();
      mainRenderer.setRenderTarget(null);
      mainRenderer.render(mainScene, mainCamera);
    }
  }

  loadEyeModel();
  loadMonitorModel();
  loadHDRBackground();
  setupEventListeners();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
