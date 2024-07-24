import { For, Index } from 'solid-js';
import { useGlobalContext } from './GlobalState';
import { SubWaveInput } from './SubWaveInput';

export function WaveInput() {
  const [state, actions] = useGlobalContext();
  const waveCount = () => state.maxWaves;

  return (
    <div class="flex gap-4">
      <Index each={Array(waveCount())}>
        {(_, i) => <SubWaveInput waveId={i} />}
      </Index>
    </div>
  );
}
