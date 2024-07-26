import { createEffect, createSignal } from "solid-js";
import { useGlobalContext } from "./GlobalState";

export function GameControls() {
  const {state, actions} = useGlobalContext();
  const [difficulty, setDifficulty] = createSignal(1);
  const [waves, setWaves] = createSignal(1);

  const startGame = () => {
    // Start game logic here
    actions.initializeGame(difficulty(), waves());
  };

  const resetGame = () => {
    // Reset game logic here
    actions.initializeGame(difficulty(), waves());
  };

 const inputClasses = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const labelClasses = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const buttonClasses = "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mb-4";

  return (
    <div class="game-menu bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Game Menu</h2>

      <div class="space-y-4">
        <button onClick={startGame} class={buttonClasses}>
          Start Game
        </button>
        <button onClick={resetGame} class={buttonClasses}>
          Reset Game
        </button>

        <div>
          <label for="difficulty" class={labelClasses}>
            Difficulty (1-5) (complexity):
          </label>
          <input
            type="number"
            id="difficulty"
            min="1"
            max="5"
            value={difficulty()}
            onInput={(e) => setDifficulty(Number.parseInt(e.target.value))}
            class={inputClasses}
          />
        </div>

        <div>
          <label for="waves" class={labelClasses}>
            Number of Waves to be able to guess (1-5):
          </label>
          <input
            type="number"
            id="waves"
            min="1"
            max="5"
            value={waves()}
            onInput={(e) => setWaves(Number.parseInt(e.target.value))}
            class={inputClasses}
          />
        </div>
      </div>
    </div>
  );
}
