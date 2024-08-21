import { Show } from "solid-js";
import { useGlobalContext } from "./GlobalState";

type WaveControlsProps = {
  waveId: number;
};

export function SubWaveInput(props: WaveControlsProps) {
  const waveId = props.waveId;
  const { state, actions } = useGlobalContext();
  const subWave = () => state.currentWave[waveId];

  const changeAmplitude = (e) => {
    const val = Number.parseFloat(e.target.value);
    const subWaveCopy = { ...subWave(), amplitude: val };
    actions.updateCurrentSubWave(waveId, subWaveCopy);
  };

  const changePhase = (e) => {
    const val = Number.parseFloat(e.target.value);
    const subWaveCopy = { ...subWave(), phase: val };
    actions.updateCurrentSubWave(waveId, subWaveCopy);
  };

  // Simplify the styling. Do not use any colors yet
  const inputClasses = "w-full h-2 rounded-lg cursor-pointer";
  const labelClasses = "block mb-2 text-sm font-medium";
  const numberInputClasses = "border text-sm rounded-lg block w-full p-2.5";

  return (
    <div class="wave-controls p-6 rounded-lg shadow-md">
      <div class="space-y-6">
        <div>
          <label for="frequency" class={labelClasses}>
            Frequency: {subWave().frequency}
          </label>
        </div>
        <div>
          <label for="amplitude" class={labelClasses}>
            Amplitude
          </label>
          <input
            type="range"
            id="amplitude"
            min="0"
            max="1"
            step="0.1"
            onInput={changeAmplitude}
            value={subWave().amplitude}
            class={inputClasses}
          />
          <input
            type="number"
            id="amplitude-text"
            min="0"
            max="1"
            step="0.1"
            onInput={changeAmplitude}
            value={subWave().amplitude}
            class={numberInputClasses}
          />
        </div>
        <Show when={state.usePhase}>
          <div>
            <label for="phase" class={labelClasses}>
              Phase
            </label>
            <input
              type="range"
              id="phase"
              min="0"
              max="6.28"
              step="0.01"
              onInput={changePhase}
              value={subWave().phase}
              class={inputClasses}
            />
            <input
              type="number"
              id="phase-text"
              min="0"
              max="6.28"
              step="0.01"
              onInput={changePhase}
              value={subWave().phase}
              class={numberInputClasses}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
