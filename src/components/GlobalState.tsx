import { createContext, createEffect, on, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import GameState from "../scripts/game.ts";

type GlobalContextType = {
  state: GameState;
  actions: Record<string, Function>;
  gameStatus: () => string;
};

// Create the context
const GlobalContext = createContext<GlobalContextType>();

const maxAttempts = 6;

// Create the provider component
export function GlobalProvider(props) {
  const [state, setState] = createStore(new GameState(maxAttempts));

  // Your actions go here
  const actions = {};

  // add all actions on the state object
  const stateKeys = Object.getOwnPropertyNames(GameState.prototype);
  for (const key of stateKeys) {
    if (typeof state[key] === "function") {
      actions[key] = (...args) => {
        setState(
          produce((draft) => {
            draft[key](...args);
          }),
        );
      };
    }
  }

  const gameStatus = () => {
    return state.getGameStatus();
  };

  // React to new submission
  createEffect(() => {
    const gameState = gameStatus();
    switch (gameState) {
      case "win":
        console.log("You win!");
        break;
      case "lose":
        console.log("You lose!");
        break;
      case "playing":
        console.log("Keep playing!");
        break;
    }
  });

  return (
    <GlobalContext.Provider value={{ state, actions, gameStatus }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

// Custom hook to use the context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
