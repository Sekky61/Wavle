import { GlobalProvider } from './GlobalState';
import { WaveControls } from './WaveControls';

export default function App() {
  return (
    <GlobalProvider>
      <WaveControls waveId={0} />
    </GlobalProvider>
  );
}
