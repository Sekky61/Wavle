import { useGlobalContext } from './GlobalState';

type WaveControlsProps = {
  waveId: number;
}

export function SubWaveInput(props: WaveControlsProps) {
  const waveId = props.waveId;

  const [state, actions] = useGlobalContext();
  const subWave = () => state.currentWave[waveId];

  console.log('subwave', subWave);

  const changeAmplitude = (e) => {
    const val = parseFloat(e.target.value);
    const subWaveCopy = {...subWave(), amplitude: val};
    actions.updateCurrentSubWave(waveId, subWaveCopy);
  }

  return (
    <div class="wave-controls">
      <div class="sliders">
        <div class="slider-group">
          <label for="amplitude">Amplitude</label>
          <input type="range" id="amplitude" min="0" max="1" step="0.01" onInput={changeAmplitude} value={subWave().amplitude} />
          <input type="number" id="amplitude-text" min="0" max="1" step="0.01" onInput={changeAmplitude} value={subWave().amplitude} />
        </div>
        <div class="slider-group">
          <label for="frequency">Frequency</label>
          <input type="range" id="frequency" min="0" max="10" step="0.1" value="1" />
          <input type="number" id="frequency-text" min="0" max="10" step="0.1" value="1" />
        </div>
        <div class="slider-group">
          <label for="phase">Phase</label>
          <input type="range" id="phase" min="0" max="6.28" step="0.01" value="0" />
          <input type="number" id="phase-text" min="0" max="6.28" step="0.01" value="0" />
        </div>
      </div>
      <button id="submit-wave" onClick={() => {actions.debug();
        console.log(state);}}>Submit</button>
    </div>
  );
}

