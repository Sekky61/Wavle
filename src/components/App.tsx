import { GameControls } from "./GameControls";
import { GlobalProvider } from "./GlobalState";
import { WaveInput } from "./WaveInput";
import { WaveRenderer } from "./WaveRenderer";

export default function App() {
  return (
    <GlobalProvider>
      <div class="flex justify-center">
        <GameControls />
      </div>
      <WaveRenderer />
      <div class="flex justify-center">
      <WaveInput />
      </div>
    </GlobalProvider>
  );
}
