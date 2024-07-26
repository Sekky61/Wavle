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

  const changeFrequency = (e) => {
    const val = Number.parseFloat(e.target.value);
    const subWaveCopy = { ...subWave(), frequency: val };
    actions.updateCurrentSubWave(waveId, subWaveCopy);
  };

  const changePhase = (e) => {
    const val = Number.parseFloat(e.target.value);
    const subWaveCopy = { ...subWave(), phase: val };
    actions.updateCurrentSubWave(waveId, subWaveCopy);
  };

  const inputClasses =
    "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700";
  const labelClasses =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const numberInputClasses =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  return (
    <div class="wave-controls bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="space-y-6">
        <div>
          <label for="amplitude" class={labelClasses}>
            Amplitude
          </label>
          <input
            type="range"
            id="amplitude"
            min="0"
            max="1"
            step="0.01"
            onInput={changeAmplitude}
            value={subWave().amplitude}
            class={inputClasses}
          />
          <input
            type="number"
            id="amplitude-text"
            min="0"
            max="1"
            step="0.01"
            onInput={changeAmplitude}
            value={subWave().amplitude}
            class={numberInputClasses}
          />
        </div>
        <div>
          <label for="frequency" class={labelClasses}>
            Frequency
          </label>
          <input
            type="range"
            id="frequency"
            min="0"
            max="10"
            step="0.1"
            onInput={changeFrequency}
            value={subWave().frequency}
            class={inputClasses}
          />
          <input
            type="number"
            id="frequency-text"
            min="0"
            max="10"
            step="0.1"
            onInput={changeFrequency}
            value={subWave().frequency}
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
