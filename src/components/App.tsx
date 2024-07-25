import { GameControls } from "./GameControls";
import { GlobalProvider } from "./GlobalState";
import { WaveInput } from "./WaveInput";
import { WaveRenderer } from "./WaveRenderer";

export default function App() {
  return (
    <GlobalProvider>
      <GameControls />
      <WaveRenderer />
      <WaveInput />
    </GlobalProvider>
  );
}
