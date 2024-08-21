import { createSignal, onCleanup, onMount } from "solid-js";
import Two from "two.js";
import type { SineWave } from "../scripts/game";
import { useGlobalContext } from "./GlobalState";

export function WaveRenderer() {
  const { state } = useGlobalContext();
  let container: HTMLDivElement | undefined;
  let two: Two | undefined;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  let resizeObserver: ResizeObserver;

  let targetWaveGroup: Two.Group;
  let lastAttemptWaveGroup: Two.Group;

  // Calculate the greatest common divisor
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  // Calculate the least common multiple
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  /**
   * Calculate the period of the combined signal of the given waves.
   * @param waves - The waves to combine
   * @returns The period of the combined signal, in units
   */
  const getChunkPeriodLength = (waves: SineWave[]): number => {
    // Get the frequencies and remove duplicates
    const frequencies = [...new Set(waves.map((wave) => wave.frequency))];

    // Calculate LCM of frequencies
    const frequencyLCM = frequencies.reduce((acc, freq) => lcm(acc, freq), 1);

    // Limit the number of points to maxPoints
    console.log("freq", frequencies, "frequencyLCM", frequencyLCM);
    // we got frequency. Lets get the period.
    const period = 1 / frequencyLCM;
    return period;
  };

  // Create a wave path with optimized number of points
  const createWaveGroup = (waves: SineWave[], color: string) => {
    const path = two!.makePath();
    path.noFill();
    path.stroke = color;
    path.linewidth = 2;
    path.closed = false;

    // Calculate chunk (period) width relative to canvas width
    const chunkPeriod = getChunkPeriodLength(waves) * 20 * Math.PI;
    const canvasXAxisWidth = 4 * Math.PI;
    const chunksPerCanvas = canvasXAxisWidth / chunkPeriod;
    const chunkWidthPx = width() / chunksPerCanvas;

    const verticesPerPixel = 0.5;
    const chunkResolution = Math.ceil(chunkWidthPx * verticesPerPixel);

    console.dir(waves);

    console.log(
      "period",
      chunkPeriod,
      "axisWidth",
      canvasXAxisWidth,
      "chunksPerCanvas",
      chunksPerCanvas,
      "chunkWidthPx",
      chunkWidthPx,
      "chunkResolution",
      chunkResolution,
    );

    const vertices = [];
    for (let i = 0; i <= chunkResolution; i++) {
      const x = (i / chunkResolution) * chunkWidthPx;
      const normalizedX = (i / chunkResolution) * 2 * Math.PI;
      const y = state.calculateCombinedSignal(waves, normalizedX);
      const canvasY = height() / 2 - y * (height() / 4);
      vertices.push(new Two.Anchor(x, canvasY));
    }

    path.vertices = vertices;

    // we need enough clones of the path to fill the screen
    const pathWidth = path.getBoundingClientRect().width;
    const numClones = Math.ceil((width() + pathWidth) / pathWidth);
    console.log("numClones", numClones);
    const group = two.makeGroup();
    for (let i = 0; i < numClones; i++) {
      const clone = path.clone(group);
      clone.position.x = i * pathWidth;
      if (i === 0) {
        clone.stroke = "green";
      } else if (i === numClones - 1) {
        clone.stroke = "pink";
      }
      group.add(clone);
    }

    path.remove();

    return group;
  };

  // Update wave path positions for animation
  const moveWave = (group: Two.Group, offset: number) => {
    const componentWidth = group.children[0].getBoundingClientRect().width;
    const groupWidth = group.children.length * componentWidth;
    for (const child of group.children) {
      const x = child.position.x + componentWidth;
      const newPos = ((x + offset) % groupWidth) - componentWidth;
      child.position.x = newPos;
    }
  };

  // Handle resize events
  const handleResize = () => {
    if (container && two) {
      const rect = container.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
      two.width = rect.width;
      two.height = rect.height;
      two.update();
    }
  };

  onMount(() => {
    if (!container) return;

    // Initialize Two.js with WebGL renderer
    two = new Two({
      type: Two.Types.webgl,
      autostart: true,
      fitted: true,
    }).appendTo(container);

    setWidth(two.width);
    setHeight(two.height);

    // Create initial wave paths
    targetWaveGroup = createWaveGroup(state.targetWave, "rgb(0, 200, 255)");
    const lastWave = state.getLastPlayerWave();
    if (lastWave) {
      lastAttemptWaveGroup = createWaveGroup(lastWave, "rgb(255, 0, 0)");
    }

    // Animate waves
    two.bind("update", () => {
      const deltaMs = two.timeDelta;
      const pixelsPerSecond = 100;
      const offsetFrame = (pixelsPerSecond * deltaMs) / 1000;

      moveWave(targetWaveGroup, offsetFrame);
      if (lastAttemptWaveGroup) moveWave(lastAttemptWaveGroup, offsetFrame);
    });

    // Set up resize observer
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
    if (two) {
      two.pause();
      two.clear();
      two.release();
    }
  });

  return <div ref={container} style={{ width: "100%", height: "300px" }} />;
}
