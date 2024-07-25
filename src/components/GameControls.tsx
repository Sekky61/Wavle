import { createEffect, createSignal } from "solid-js";
import { useGlobalContext } from "./GlobalState";

export function GameControls() {
  const [state, actions] = useGlobalContext();
  const [difficulty, setDifficulty] = createSignal(1);
  const [waves, setWaves] = createSignal(1);

  createEffect(() => {
    console.log(`Difficulty: ${difficulty()}, Waves: ${waves()}`);
  });

  const startGame = () => {
    // Start game logic here
    actions.initializeGame(difficulty(), waves());
  };

  const resetGame = () => {
    // Reset game logic here
    actions.initializeGame(difficulty(), waves());
  };

  return (
    <div class="game-menu">
      <h2>Game Menu</h2>

      <button onClick={startGame}>Start Game</button>
      <button onClick={resetGame}>Reset Game</button>

      <div>
        <label for="difficulty">Difficulty (1-5) (complexity): </label>
        <input
          type="number"
          id="difficulty"
          min="1"
          max="5"
          value={difficulty()}
          onInput={(e) => setDifficulty(Number.parseInt(e.target.value))}
        />
      </div>

      <div>
        <label for="waves">Number of Waves to be able to guess (1-5): </label>
        <input
          type="number"
          id="waves"
          min="1"
          max="5"
          value={waves()}
          onInput={(e) => setWaves(Number.parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
