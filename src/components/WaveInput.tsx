import { For, Index } from "solid-js";
import { allowedFrequencies } from "../scripts/game";
import { useGlobalContext } from "./GlobalState";
import { SubWaveInput } from "./SubWaveInput";

const waveCount = allowedFrequencies.length;

export function WaveInput() {
  const { state, actions } = useGlobalContext();

  const submitWave = () => {
    actions.submitPlayerWave();
  };

  return (
    <div>
      <div class="flex gap-4">
        <Index each={Array(waveCount)}>
          {(_, i) => <SubWaveInput waveId={i} />}
        </Index>
      </div>
      <div class="flex justify-center mt-6">
        <button
          onClick={submitWave}
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Submit {state.playerWaves.length + 1}/{state.maxAttempts}
        </button>
      </div>
    </div>
  );
}
