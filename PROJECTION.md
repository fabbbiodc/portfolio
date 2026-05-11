# PROJECTION.md - HeroArt Component Architecture

## Overview

The HeroArt component demonstrates a complex Three.js scene featuring a 3D
monitor displaying a pixelated projection of an eye model. The system combines
multiple rendering techniques, camera systems, and interactive controls to
create an engaging visual experience.

**Key Features:**

- Dual-scene rendering with post-processing effects
- Interactive monitor rotation with mouse controls
- Eye-tracking that adapts to monitor orientation
- Pixelated projection effect applied selectively to the "screen" content
- Real-time texture mapping and camera coordination

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HeroArt Scene Graph                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  mainScene (what user sees on canvas)                            │
│  ├── mainCamera (PerspectiveCamera: 75°, aspect ratio)          │
│  ├── mainRenderer (WebGLRenderer → canvas)                      │
│  ├── Lights (ambient + directional)                             │
│  └── monitorGroup                                               │
│      └── monitor (3D model, rotatable)                          │
│          └── screenMesh (displays renderTarget.texture)         │
│                                                                   │
│  screenScene (rendered offscreen to renderTarget)               │
│  ├── screenCamera (PerspectiveCamera: 75°, 1:1 aspect)        │
│  ├── screenRenderer (same mainRenderer, different target)       │
│  ├── Lights (ambient + directional)                             │
│  ├── eyeModel (3D eye, rotatable based on mouse)               │
│  └── testBox (debug geometry)                                   │
│                                                                   │
│  Rendering Pipeline:                                            │
│  ┌────────────────────────────────────────────────┐            │
│  │ screenComposer.render()                        │            │
│  │ (renders screenScene + pixelation to RT)       │            │
│  │         ↓                                       │            │
│  │ renderTarget.texture updated                   │            │
│  │         ↓                                       │            │
│  │ mainRenderer.render(mainScene, mainCamera)     │            │
│  │ (displays monitor with projected texture)      │            │
│  └────────────────────────────────────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Dual-Scene System

### Why Two Scenes?

This architecture allows us to:

1. **Render content in isolation** - The eye model only appears in the
   screenScene
2. **Apply selective effects** - Pixelation applies only to the screen
   content, not the monitor itself
3. **Use different cameras** - Each scene can have independent camera angles
   and aspect ratios
4. **Optimize rendering** - One scene renders to a small texture (512x512),
   the other to full canvas

### Scene Configuration

**mainScene:**

```js
const mainScene = new THREE.Scene();
mainScene.background = null; // Transparent, shows 3D effect
```

- Contains the 3D monitor model and its rotations
- Rendered to the full canvas at full resolution
- No post-processing effects applied

**screenScene:**

```js
const screenScene = new THREE.Scene();
screenScene.background = new THREE.Color(0x000000); // Black background
```

- Contains the eye model and any projected content
- Rendered offscreen to a 512x512 texture (renderTarget)
- Post-processing pixelation effect applied before texture creation

---

## 2. Dual-Composer Rendering Pipeline

### The Render Loop

Each frame executes in this precise order:

```js
function animate() {
  // 1. Update transformations (monitor rotation, eye tracking)
  // ... rotation updates ...

  // 2. Render pixelated screen content to texture
  screenComposer.render();

  // 3. Render main scene with textured monitor to canvas
  mainRenderer.setRenderTarget(null);
  mainRenderer.render(mainScene, mainCamera);
}
```

### screenComposer (Offscreen Pipeline)

**Setup:**

```js
const renderTarget = new THREE.WebGLRenderTarget(512, 512);

const screenComposer = new EffectComposer(mainRenderer, renderTarget);
screenComposer.renderToScreen = false; // Critical: output only to renderTarget

const screenPixelPass = new RenderPixelatedPass(
  4, // pixel size (block size)
  screenScene, // scene to pixelate
  screenCamera, // camera for rendering
);
screenComposer.addPass(screenPixelPass);
```

**Key Point:** `renderToScreen = false` prevents the composer from outputting
to the canvas. Instead, it writes to the provided `renderTarget`.

**Rendering Process:**

```
screenScene (eye + lights)
    ↓
screenCamera (orthogonal to screen, FOV=75°, 1:1 aspect)
    ↓
RenderPixelatedPass (blocks pixels into 4x4 units)
    ↓
EffectComposer (manages post-processing chain)
    ↓
renderTarget.texture (512x512 pixelated output)
```

### Main Renderer (Onscreen Pipeline)

**Setup:**

```js
const mainRenderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

mainRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
mainRenderer.setClearColor(0x000000, 0); // Transparent black
mainRenderer.setPixelRatio(window.devicePixelRatio);
```

**Rendering:**

```js
mainRenderer.setRenderTarget(null); // Output to canvas
mainRenderer.render(mainScene, mainCamera);
```

This renders the monitor model, which has a material that displays
`renderTarget.texture` on its screen mesh.

---

## 3. Effect Implementation: Pixelation

### What is RenderPixelatedPass?

A post-processing pass from Three.js that blocks pixels into larger squares,
creating a retro/pixelated effect.

**Parameters:**

- `pixelSize: 4` - Each pixel becomes a 4x4 block
- `scene: screenScene` - The scene to apply effect to
- `camera: screenCamera` - Camera for rendering the scene

### How It Works (Conceptually)

```glsl
// Pseudo-code for pixelation shader
float pixelSize = 4.0;
vec2 pixelatedCoord = floor(fragCoord / pixelSize) * pixelSize;
vec3 color = texture(sampler, pixelatedCoord / resolution).rgb;
```

Instead of sampling each pixel individually, it:

1. Divides coordinates by pixel size (4)
2. Floors the result (creates blocks)
3. Multiplies by pixel size (snaps to grid)
4. Samples only once per block, spreading that sample across the entire block

### In Our System

The pixelation effect **only affects the renderTarget texture** because:

1. `screenComposer` applies the effect to `screenScene`
2. The effect output goes to `renderTarget` (not canvas)
3. The monitor model then displays this pixelated texture
4. The rest of the scene (monitor body, lights, background) remains sharp

---

## 4. Object Rotation System

### Monitor Rotation (Mouse Dragging)

**Goal:** Allow users to rotate the monitor by dragging with the mouse.

**Implementation:**

```js
// State variables
let monitorTargetRotationX = 0;
let monitorTargetRotationY = 0;
let monitorCurrentRotationX = 0;
let monitorCurrentRotationY = 0;
let isRotatingMonitor = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Mouse down: start rotation if clicking monitor
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
    }
  }
});

// Mouse move: update rotation target
document.addEventListener("mousemove", (event) => {
  if (isRotatingMonitor && monitorGroup) {
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;
    const rotationSensitivity = 0.005;

    monitorTargetRotationY += deltaX * rotationSensitivity;
    monitorTargetRotationX += deltaY * rotationSensitivity;

    // Clamp rotations to prevent over-rotation
    const maxRotationX = Math.PI * 0.25; // ±45°
    const maxRotationY = Math.PI * 0.25;
    monitorTargetRotationX = Math.max(
      -maxRotationX,
      Math.min(maxRotationX, monitorTargetRotationX),
    );
    monitorTargetRotationY = Math.max(
      -maxRotationY,
      Math.min(maxRotationY, monitorTargetRotationY),
    );

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  }
});

// Mouse up: stop rotation
document.addEventListener("mouseup", () => {
  isRotatingMonitor = false;
});

// Animation: smooth easing to target rotation
if (monitorGroup) {
  const easing = 0.1;
  monitorCurrentRotationX +=
    (monitorTargetRotationX - monitorCurrentRotationX) * easing;
  monitorCurrentRotationY +=
    (monitorTargetRotationY - monitorCurrentRotationY) * easing;
  monitorGroup.rotation.x = monitorCurrentRotationX;
  monitorGroup.rotation.y = monitorCurrentRotationY;
}
```

**Key Concepts:**

1. **Raycasting for Hit Detection**

   ```js
   const raycaster = new THREE.Raycaster();
   raycaster.setFromCamera(mouse, mainCamera);
   const intersects = raycaster.intersectObject(monitorGroup, true);
   ```

   - Converts 2D mouse position to 3D ray from camera
   - Tests if ray intersects with monitor geometry
   - Only start rotation if intersection detected

2. **Delta-Based Rotation**

   ```js
   const deltaX = event.clientX - previousMouseX;
   const deltaY = event.clientY - previousMouseY;
   monitorTargetRotationY += deltaX * rotationSensitivity;
   monitorTargetRotationX += deltaY * rotationSensitivity;
   ```

   - Horizontal mouse movement → Y-axis rotation (pan)
   - Vertical mouse movement → X-axis rotation (tilt)
   - Multiplied by sensitivity factor (0.005)

3. **Rotation Clamping**

   ```js
   const maxRotationX = Math.PI * 0.25; // 45 degrees
   monitorTargetRotationX = Math.max(
     -maxRotationX,
     Math.min(maxRotationX, monitorTargetRotationX),
   );
   ```

   - Prevents monitor from rotating too far
   - ±45° maximum on each axis

4. **Smooth Easing**

   ```js
   monitorCurrentRotationX +=
     (monitorTargetRotationX - monitorCurrentRotationX) * easing;
   ```

   - Creates smooth animation toward target rotation
   - `easing = 0.1` means 10% of distance per frame
   - Prevents jittery, instant rotation

---

## 5. Eye Tracking System

### Overview

The eye model rotates to "look at" the user's mouse position, **accounting for
the monitor's current rotation in world space** to maintain accurate tracking
regardless of monitor orientation.

### Mathematical Approach

**The Challenge:**
The eye is rendered in `screenSpace` (the small 512x512 offscreen render), but
when the monitor rotates, the screen's orientation in world space changes. We
need to ensure the eye always looks at the cursor on the screen by:

1. Calculating the eye's desired rotation based on cursor position
   (viewport space)
2. Applying the monitor's rotation transform to this target rotation
3. Combining these rotations correctly using quaternion mathematics

### Implementation: Quaternion-Based Rotation Composition

**Step 1: Calculate Eye Target Rotation from Mouse Position**

```js
// Get canvas position relative to viewport
const rect = canvas.getBoundingClientRect();
const canvasCenterX = rect.left + rect.width / 2;
const canvasCenterY = rect.top + rect.height / 2;

// Calculate offset from canvas center
const offsetX = event.clientX - canvasCenterX;
const offsetY = event.clientY - canvasCenterY;

// Scale by sensitivity to get target rotation
const sensitivity = 0.003;
eyeTargetRotationX = offsetY * sensitivity;
eyeTargetRotationY = -offsetX * sensitivity;
```

**What This Does:**

- Finds the center of the canvas on the screen
- Measures how far the mouse is from that center
- Converts distance to rotation angles in viewport space
- X offset → Y rotation (horizontal look)
- Y offset → X rotation (vertical look)

### Animation Loop: Eye Rotation with Monitor Compensation

```js
if (eyeModel) {
  const easing = 0.1;
  eyeCurrentRotationX += (eyeTargetRotationX - eyeCurrentRotationX) * easing;
  eyeCurrentRotationY += (eyeTargetRotationY - eyeCurrentRotationY) * easing;

  // Clamp to prevent looking behind
  const clampedRotationX = Math.max(
    -maxEyeRotationX,
    Math.min(maxEyeRotationX, eyeCurrentRotationX),
  );
  const clampedRotationY = Math.max(
    -maxEyeRotationY,
    Math.min(maxEyeRotationY, eyeCurrentRotationY),
  );

  // Apply the eye rotation directly in world space,
  // accounting for the monitor's rotation
  if (monitorGroup) {
    // The eye should track the cursor in world space
    // We need to rotate it by the monitor's rotation to maintain the illusion

    // 1. Create quaternion from eye's viewport-space rotation
    const eyeQuat = new THREE.Quaternion();
    eyeQuat.setFromEuler(
      new THREE.Euler(clampedRotationX, clampedRotationY, 0, "YXZ"),
    );

    // 2. Create quaternion from monitor's current world-space rotation
    const monitorQuat = new THREE.Quaternion();
    monitorQuat.setFromEuler(
      new THREE.Euler(
        monitorCurrentRotationX,
        monitorCurrentRotationY,
        0,
        "YXZ",
      ),
    );

    // 3. Apply monitor rotation to eye rotation
    // This transforms the eye's local rotation into world space
    const finalQuat = monitorQuat.clone().multiply(eyeQuat);

    // 4. Convert back to Euler angles and apply
    const finalEuler = new THREE.Euler().setFromQuaternion(finalQuat, "YXZ");

    eyeModel.rotation.x = finalEuler.x;
    eyeModel.rotation.y = finalEuler.y;
  } else {
    // Fallback if monitor not loaded
    eyeModel.rotation.x = clampedRotationX;
    eyeModel.rotation.y = clampedRotationY;
  }
}
```

**Key Points:**

1. **Easing (Smooth Animation)**
   - Same 0.1 easing factor as monitor rotation
   - Creates fluid eye movement, not jittery

2. **Clamping**
   - `maxEyeRotationX = Math.PI * 0.25` (±45°)
   - `maxEyeRotationY = Math.PI * 0.25` (±45°)
   - Prevents eye from rotating unnaturally far

3. **Quaternion Math (The Fix)**
   - Quaternions represent rotations as 4D vectors: `(x, y, z, w)`
   - Multiplying quaternions combines rotations correctly without gimbal lock
   - `monitorQuat.multiply(eyeQuat)` means: "First rotate eye by eyeQuat,
     then by monitorQuat"
   - Result: eye tracks cursor accurately regardless of monitor rotation

### Why Quaternions?

**Euler Angles Problem:**

```js
// WRONG - doesn't handle compound rotations correctly
eyeModel.rotation.x = clampedRotationX + monitorCurrentRotationX;
eyeModel.rotation.y = clampedRotationY + monitorCurrentRotationY;
```

Rotations don't add like vectors in 3D space. Simple addition causes gimbal lock
and incorrect results.

**Quaternion Solution:**

```js
// CORRECT - handles compound rotations smoothly
const eyeQuat = new THREE.Quaternion().setFromEuler(eyeEuler);
const monitorQuat = new THREE.Quaternion().setFromEuler(monitorEuler);
const finalQuat = monitorQuat.clone().multiply(eyeQuat);
```

Quaternion multiplication correctly combines rotations in all three axes without
gimbal lock.

### How It Works: The Tracking Effect

When the monitor is straight (rotation = 0):

- Monitor quaternion is identity (no rotation)
- Eye quaternion is applied directly
- Result: Normal viewport-relative eye tracking

When the monitor rotates (e.g., tilted 30°):

- Eye still looks at cursor based on viewport position
- Monitor's rotation is applied to this eye rotation
- Eye appears to track the cursor on the rotated screen
- User sees the eye following their mouse regardless of monitor orientation

---

## 6. Camera Systems

### Main Camera

**Purpose:** Renders the full 3D scene with the monitor model

**Setup:**

```js
const mainCamera = new THREE.PerspectiveCamera(
  75, // FOV (degrees)
  canvas.clientWidth / canvas.clientHeight, // aspect ratio
  0.1, // near clipping plane
  1000, // far clipping plane
);

mainCamera.position.set(0, 0, 2); // Positioned in front of monitor
```

**Properties:**

- **FOV = 75°**: Wide enough to see entire monitor and surroundings
- **Aspect Ratio**: Matches canvas dimensions (keeps proportions)
- **Position (0, 0, 2)**: Centered in front of the monitor at distance 2

### Screen Camera

**Purpose:** Renders the eye model in the offscreen render target

**Setup:**

```js
const screenCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
screenCamera.position.set(3, 2, 1); // Initial position
```

**Dynamic Update (when eye loads):**

```js
const eyeBox = new THREE.Box3().setFromObject(eyeModel);
const eyeCenter = eyeBox.getCenter(new THREE.Vector3());
eyeModel.position.sub(eyeCenter); // Center eye at origin

const size = new THREE.Vector3();
eyeBox.getSize(size);
const maxDim = Math.max(size.x, size.y, size.z);

// Position camera at distance = maxDim * 1
screenCamera.position.set(0, 0, maxDim * 1);
screenCamera.lookAt(0, 0, 0);
```

**Properties:**

- **FOV = 75°**: Same as main camera for consistency
- **Aspect Ratio = 1**: Square (matches 512x512 renderTarget)
- **Position**: Dynamically set based on eye model size
- **LookAt**: Focused on eye center (0, 0, 0)

**Why Dynamic?**
The eye model might be different sizes. By measuring its bounding box, we
automatically position the camera at the perfect distance to frame the entire
eye.

---

## 7. Texture Mapping: renderTarget → screenMesh

### The Challenge

Three.js rendered content needs to appear on the monitor's screen. The solution:
map a WebGLRenderTarget's texture as a material.

### Implementation

**Geometry Analysis:**

```js
screenMesh.geometry.computeBoundingBox();
const boundingBox = screenMesh.geometry.boundingBox;
const positionAttribute = screenMesh.geometry.attributes.position;
const uvAttribute = screenMesh.geometry.attributes.uv;
```

**UV Mapping (Critical):**

```js
for (let i = 0; i < positionAttribute.count; i++) {
  const x = positionAttribute.getX(i);
  const y = positionAttribute.getY(i);

  // Map world space position to 0-1 UV range
  const u = (x - boundingBox.min.x) / (boundingBox.max.x - boundingBox.min.x);
  const v = (y - boundingBox.min.y) / (boundingBox.max.y - boundingBox.min.y);

  uvAttribute.setXY(i, u, v);
}
uvAttribute.needsUpdate = true;
```

**What This Does:**

1. Gets bounding box of screen mesh (min/max coordinates)
2. For each vertex, normalizes its position to 0-1 range
3. Sets UV coordinates based on normalized position
4. Marks UV attribute as modified so Three.js updates the GPU data

**Result:** The screen mesh is perfectly UV-mapped to the 512x512 renderTarget
texture

### Material Assignment

```js
screenMesh.material = new THREE.MeshBasicMaterial({
  map: renderTarget.texture, // Use rendered content as texture
});
screenMesh.material.needsUpdate = true;
```

**Why MeshBasicMaterial?**

- No lighting calculations needed (rendered content already has lighting)
- Displays texture directly without shading
- Lightweight and fast

---

## 8. The Complete Render Flow (Math + Implementation)

### Frame-by-Frame Execution

**Step 1: Update Transformations**

```js
// Monitor rotation (with easing)
monitorCurrentRotationX +=
  (monitorTargetRotationX - monitorCurrentRotationX) * 0.1;
monitorCurrentRotationY +=
  (monitorTargetRotationY - monitorCurrentRotationY) * 0.1;
monitorGroup.rotation.x = monitorCurrentRotationX;
monitorGroup.rotation.y = monitorCurrentRotationY;

// Eye rotation (with easing and clamping)
eyeCurrentRotationX += (eyeTargetRotationX - eyeCurrentRotationX) * 0.1;
eyeCurrentRotationY += (eyeTargetRotationY - eyeCurrentRotationY) * 0.1;
eyeModel.rotation.x = clamp(eyeCurrentRotationX, -maxRotX, maxRotX);
eyeModel.rotation.y = clamp(eyeCurrentRotationY, -maxRotY, maxRotY);
```

**Step 2: Render Pixelated Screen Content**

```js
// Tell screenComposer to render screenScene with pixelation effect
screenComposer.render();

// Internally:
// 1. Three.js renders screenScene using screenCamera
// 2. RenderPixelatedPass applies pixelation shader
// 3. Result written to renderTarget
// 4. renderTarget.texture now contains pixelated eye
```

**Step 3: Render Main Scene to Canvas**

```js
mainRenderer.setRenderTarget(null); // Output to canvas
mainRenderer.render(mainScene, mainCamera);

// Internally:
// 1. Three.js renders mainScene using mainCamera
// 2. Monitor model is drawn
// 3. screenMesh renders with material using renderTarget.texture
// 4. Result displayed on canvas
```

### Mathematical Transformations

**Monitor Rotation Matrix:**

```
Rx (rotation around X-axis):
[1    0         0      0]
[0  cos(x)  -sin(x)    0]
[0  sin(x)   cos(x)    0]
[0    0         0      1]

Ry (rotation around Y-axis):
[cos(y)   0   sin(y)   0]
[  0      1     0      0]
[-sin(y)  0   cos(y)   0]
[  0      0     0      1]

Combined: Ry * Rx * vertex_position
```

**Eye Rotation (applied in screenSpace):**

```
Same Rx and Ry matrices, but applied to eyeModel in screenScene
Eye is always in screenSpace, so rotation is relative to screen camera
```

**Projection (screenCamera):**

```
ndc = projection_matrix * view_matrix * eye_position
screen_pixel = (ndc + 1) * 0.5 * renderTarget.width
```

**Texture Mapping:**

```
pixel_color = renderTarget.texture[uv * renderTarget.size]
```

---

## 9. Performance Considerations

### Optimization Techniques

1. **Dual Render Targets**
   - screenScene renders to small 512x512 texture (pixelated)
   - mainScene renders to full canvas
   - Reduces pixelation overhead

2. **Selective Post-Processing**
   - Pixelation applied only to screen content, not entire scene
   - Monitor body, lights, background rendered at full quality

3. **Easing/Smoothing**
   - Prevents jittery updates
   - Allows frame skipping without visible artifacts

4. **Raycasting**
   - Only raycasts on mouse down (not every frame)
   - Efficient hit detection

### Potential Bottlenecks

1. **EffectComposer Overhead**
   - Post-processing passes add GPU cost
   - Mitigated by small renderTarget size (512x512)

2. **Two Render Calls Per Frame**
   - screenComposer.render() + mainRenderer.render()
   - Necessary for the dual-scene architecture

3. **Geometry UV Recalculation**
   - Computed once at model load (not per-frame)
   - Negligible cost

---

## 10. File Structure

```
src/components/
├── HeroArt.astro          # Main component
├── PROJECTION.md          # This documentation
└── models/
    ├── monitor.glb        # 3D monitor model
    └── eye.glb            # 3D eye model
```

---

## 11. Key Takeaways

| Concept          | Implementation                            | Why                                             |
| ---------------- | ----------------------------------------- | ----------------------------------------------- |
| Dual Scenes      | mainScene (monitor) + screenScene (eye)   | Separate rendering pipelines, selective effects |
| Dual Composers   | screenComposer (pixelated) + mainRenderer | Pixelation only on screen content               |
| Offset Rendering | 512x512 renderTarget for screen           | Performance + pixelation effect clarity         |
| Easing           | 0.1 factor for smooth animations          | Prevents jittery, instant movement              |
| Raycasting       | Hit detection on mouse down               | Efficient interaction detection                 |
| Dynamic Camera   | Position based on model size              | Automatic framing of content                    |
| UV Mapping       | Normalized coordinates to 0-1             | Proper texture display on mesh                  |

---

## 12. Future Enhancements

1. **Additional Effects**
   - Chromatic aberration on pixelated screen
   - Screen glow/bloom effect
   - CRT scan lines overlay

2. **Interaction**
   - Click areas on screen for navigation
   - Multiple content types projected (video, particles, etc.)

3. **Performance**
   - Lower renderTarget size for lower-end devices
   - Selective rendering based on visibility

4. **Advanced Features**
   - Eye pupil dilation/constriction based on brightness
   - Blinking animation
   - Parallax effect for screen depth

---

## References

- [Three.js Documentation](https://threejs.org/docs/)
- [EffectComposer API](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer)
- [WebGLRenderTarget](https://threejs.org/docs/#api/en/render/WebGLRenderTarget)
- [Raycasting](https://threejs.org/docs/#api/en/core/Raycaster)
