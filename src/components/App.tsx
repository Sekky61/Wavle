import { GameMenuContainer } from "./GameMenu";
import { GlobalProvider } from "./GlobalState";
import { WaveInput } from "./WaveInput";
import { WaveRenderer } from "./WaveRenderer";

export default function App() {
  return (
    <GlobalProvider>
      <GameMenuContainer />
      <WaveRenderer />
      <div class="flex justify-center">
        <WaveInput />
      </div>
    </GlobalProvider>
  );
}
