import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import GameState from "../scripts/game.ts";

// Create the context
const GlobalContext = createContext();

// Create the provider component
export function GlobalProvider(props) {
  const [state, setState] = createStore(new GameState(3, 6));

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

  return (
    <GlobalContext.Provider value={[state, actions]}>
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
