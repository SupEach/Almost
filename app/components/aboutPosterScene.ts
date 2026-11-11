import * as THREE from "three";

export type PaperPose = { x: number; y: number; roll: number; pitch: number; yaw: number; curl: number; axisX: number; axisY: number };

function createPaperGrain() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    const grain = 40 + Math.random() * 176;
    pixels.set([grain, grain, grain, 255], i);
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export async function createPaperScene(canvas: HTMLCanvasElement, src: string) {
  const texture = await new THREE.TextureLoader().loadAsync(src);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (error) {
    texture.dispose();
    throw error;
  }
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2500);
  camera.position.z = 1200;
  const light = new THREE.DirectionalLight(0xffffff, 0.64);
  light.position.set(-260, 340, 800);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.far = 2400;
  light.shadow.normalBias = 2;
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.43));

  const geometry = new THREE.PlaneGeometry(1, 1, 24, 30);
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const original = new Float32Array(positions.array);
  const grain = createPaperGrain();
  const paperSurface = { bumpMap: grain, bumpScale: 0.32, specular: 0x010101 };
  const front = new THREE.MeshPhongMaterial({ ...paperSurface, map: texture });
  const back = new THREE.MeshPhongMaterial({ ...paperSurface, color: 0xf0eddf, side: THREE.BackSide });
  const frontSheet = new THREE.Mesh(geometry, front);
  frontSheet.castShadow = true;
  frontSheet.frustumCulled = false;
  const backSheet = new THREE.Mesh(geometry, back);
  backSheet.frustumCulled = false;
  const paper = new THREE.Group();
  paper.add(frontSheet, backSheet);
  scene.add(paper);

  const groundGeometry = new THREE.PlaneGeometry(1, 1);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.29 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.z = -16;
  ground.receiveShadow = true;
  scene.add(ground);

  let width = 1;
  let height = 1;
  let lastCurl = -1;
  let lastAxisX = 0;
  let lastAxisY = 0;

  return {
    resize(stageWidth: number, stageHeight: number, sheetWidth: number, sheetHeight: number) {
      width = sheetWidth;
      height = sheetHeight;
      lastCurl = -1;
      grain.repeat.set(width / 128, height / 128);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(stageWidth, stageHeight, false);
      camera.left = -stageWidth / 2;
      camera.right = stageWidth / 2;
      camera.top = stageHeight / 2;
      camera.bottom = -stageHeight / 2;
      camera.updateProjectionMatrix();
      ground.scale.set(stageWidth, stageHeight, 1);

      const shadowSpan = Math.max(stageWidth, stageHeight) / 2 + 100;
      light.shadow.camera.left = light.shadow.camera.bottom = -shadowSpan;
      light.shadow.camera.right = light.shadow.camera.top = shadowSpan;
      light.shadow.camera.updateProjectionMatrix();
    },
    render({ x, y, roll, pitch, yaw, curl, axisX, axisY }: PaperPose) {
      if (curl !== lastCurl || axisX !== lastAxisX || axisY !== lastAxisY) {
        const extent = (Math.abs(axisX) * width + Math.abs(axisY) * height) / 2;
        const crease = extent * (1 - 1.25 * curl);
        const radius = extent * (0.32 - 0.17 * curl);

        for (let i = 0; i < positions.count; i++) {
          const px = original[i * 3] * width;
          const py = original[i * 3 + 1] * height;
          const distance = px * axisX + py * axisY - crease;
          if (curl === 0 || distance <= 0) {
            positions.setXYZ(i, px, py, 0);
            continue;
          }

          // Roll the lifted side around a cylinder without stretching the print.
          const angle = Math.min(distance / radius, 2.85);
          const tail = distance - angle * radius;
          const shift = radius * Math.sin(angle) + tail * Math.cos(angle) - distance;
          const lift = radius * (1 - Math.cos(angle)) + tail * Math.sin(angle);
          positions.setXYZ(i, px + axisX * shift, py + axisY * shift, lift);
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        lastCurl = curl;
        lastAxisX = axisX;
        lastAxisY = axisY;
      }

      const lift = Math.abs(Math.sin(pitch)) * height / 2 + Math.abs(Math.sin(yaw)) * width / 2;
      paper.position.set(x, -y, lift + 8 * curl);
      paper.rotation.set(pitch, yaw, -roll, "ZYX");
      renderer.render(scene, camera);
    },
    dispose() {
      texture.dispose();
      grain.dispose();
      geometry.dispose();
      front.dispose();
      back.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      (light.shadow.map as THREE.WebGLRenderTarget | null)?.dispose();
      renderer.dispose();
    },
  };
}
