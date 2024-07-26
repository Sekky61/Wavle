import { For, Index } from "solid-js";
import { useGlobalContext } from "./GlobalState";
import { SubWaveInput } from "./SubWaveInput";

export function WaveInput() {
  const {state, actions} = useGlobalContext();
  const waveCount = () => state.maxWaves;

  const submitWave = () => {
    actions.submitPlayerWave();
  };

  return (
    <div>
      <div class="flex gap-4">
        <Index each={Array(waveCount())}>
          {(_, i) => <SubWaveInput waveId={i} />}
        </Index>
      </div>
      <button
        onClick={submitWave}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
      Submit
      </button>
    </div>
  );
}
