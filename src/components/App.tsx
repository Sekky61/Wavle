import { GlobalProvider } from "./GlobalState";
import { WaveInput } from "./WaveInput";

export default function App() {
  return (
    <GlobalProvider>
      <WaveInput />
    </GlobalProvider>
  );
}
