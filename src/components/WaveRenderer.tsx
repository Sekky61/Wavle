import { createSignal, onCleanup, onMount } from "solid-js";
import Two from "two.js";
import type { SineWave } from "../scripts/game";
import { useGlobalContext } from "./GlobalState";

export function WaveRenderer() {
  const {state, actions} = useGlobalContext();
  let container: HTMLDivElement | undefined;
  let two: Two | undefined;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [time, setTime] = createSignal(0);
  let resizeObserver: ResizeObserver;

  const drawWave = (path: Two.Path, waves: SineWave[]) => {
    const vertices = [];
    for (let x = 0; x < width(); x++) {
      const normalizedX = (x / width()) * 2 * Math.PI;
      if (!waves) {
        console.warn("No waves", waves);
      }
      const y = state.calculateCombinedSignal(waves, normalizedX + time());
      const canvasY = height() / 2 - y * (height() / 4);
      vertices.push(new Two.Anchor(x, canvasY));
    }
    path.vertices = vertices;
  };

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

    // Initialize Two.js
    two = new Two({
      type: Two.Types.canvas,
      autostart: true,
      fitted: true,
    }).appendTo(container);

    setWidth(two.width);
    setHeight(two.height);

    // Create the wave path
    const targetPath = two.makePath();
    targetPath.noFill();
    targetPath.stroke = "rgb(0, 200, 255)";
    targetPath.linewidth = 2;
    targetPath.closed = false;

    // Last attempt wave path
    const lastAttemptPath = two.makePath();
    lastAttemptPath.noFill();
    lastAttemptPath.stroke = "rgb(255, 0, 0)";
    lastAttemptPath.linewidth = 2;
    lastAttemptPath.closed = false;

    // Animation
    two.bind("update", (frameCount: number) => {
      setTime(frameCount * 0.005); // Adjust this value to change animation speed
      drawWave(targetPath, state.targetWave);
      const lastWave = state.getLastPlayerWave();
      if (lastWave) drawWave(lastAttemptPath, lastWave);
    });

    // Set up ResizeObserver
    resizeObserver = new ResizeObserver(handleResize);
    console.log(container);
    resizeObserver.observe(container);
  });

  onCleanup(() => {
    resizeObserver.disconnect();
    if (two) {
      two.pause();
      two.clear();
      two.release();
    }
  });

  return <div ref={container} style={{ width: "100%", height: "300px" }} />;
}
