/**
 * @file game.js
 * @description Core game logic for SineWave Composer using a functional approach
 */

/**
 * @typedef {Object} SineWave
 * @property {number} amplitude - The amplitude of the sine wave
 * @property {number} frequency - The frequency of the sine wave
 * @property {number} phase - The phase shift of the sine wave
 */

/**
 * @typedef {Object} GameState
 * @property {SineWave[]} targetWaves - The combination of sine waves to match
 * @property {SineWave[]} playerWaves - The player's current combination of sine waves
 * @property {number} maxWaves - The maximum number of waves the player can use
 * @property {number} attempts - The number of attempts made by the player
 * @property {number} maxAttempts - The maximum number of attempts allowed
 * @property {boolean} gameWon - Whether the player has won the game
 */

/**
 * Creates an initial game state
 * @param {number} maxWaves - The maximum number of waves allowed
 * @param {number} maxAttempts - The maximum number of attempts allowed
 * @returns {GameState}
 */
const createInitialState = (maxWaves = 3, maxAttempts = 6) => ({
  targetWaves: [],
  playerWaves: [],
  maxWaves,
  attempts: 0,
  maxAttempts,
  gameWon: false
});

/**
 * Initializes a new game
 * @param {GameState} state - The current game state
 * @param {number} difficulty - The difficulty level (1-5)
 * @returns {GameState} The new game state
 */
const initializeGame = (state, difficulty) => ({
  ...state,
  targetWaves: generateTargetWaves(difficulty),
  playerWaves: [],
  attempts: 0,
  gameWon: false
});

/**
 * Generates target waves based on the difficulty
 * @param {number} difficulty - The difficulty level (1-5)
 * @returns {SineWave[]}
 */
const generateTargetWaves = (difficulty) => {
  const waves = [];
  const numWaves = Math.min(difficulty, 5); // Cap at 5 waves

  for (let i = 0; i < numWaves; i++) {
    waves.push({
      amplitude: Math.random() * 0.5 + 0.5, // Random amplitude between 0.5 and 1
      frequency: (Math.random() * difficulty) + 1, // Frequency increases with difficulty
      phase: Math.random() * Math.PI * 2 // Random phase between 0 and 2π
    });
  }

  // Normalize amplitudes so they sum to 1
  const totalAmplitude = waves.reduce((sum, wave) => sum + wave.amplitude, 0);
  waves.forEach(wave => wave.amplitude /= totalAmplitude);

  return waves;
};
/**
 * Adds a new sine wave to the player's combination
 * @param {GameState} state - The current game state
 * @param {SineWave} wave - The sine wave to add
 * @returns {GameState} The updated game state
 */
const addPlayerWave = (state, wave) => {
  if (state.playerWaves.length < state.maxWaves) {
    return {
      ...state,
      playerWaves: [...state.playerWaves, wave]
    };
  }
  return state;
};

/**
 * Removes a sine wave from the player's combination
 * @param {GameState} state - The current game state
 * @param {number} index - The index of the wave to remove
 * @returns {GameState} The updated game state
 */
const removePlayerWave = (state, index) => ({
  ...state,
  playerWaves: state.playerWaves.filter((_, i) => i !== index)
});

/**
 * Calculates the combined signal from an array of sine waves
 * @param {SineWave[]} waves - The array of sine waves
 * @param {number} x - The x-coordinate to calculate the signal for
 * @returns {number} The y-coordinate of the combined signal
 */
const calculateCombinedSignal = (waves, x) =>
  waves.reduce((sum, wave) => 
    sum + wave.amplitude * Math.sin(wave.frequency * x + wave.phase), 0);

/**
 * Compares the player's signal to the target signal and calculates a similarity score.
 * @param {SineWave[]} playerWaves - Array of player's sine waves
 * @param {SineWave[]} targetWaves - Array of target sine waves
 * @returns {number} Similarity score between 0 and 100
 */
const compareSignals = (playerWaves, targetWaves) => {
  const numSamples = 1000;
  let totalDifference = 0;
  let maxDifference = 0;

  for (let i = 0; i < numSamples; i++) {
    const x = (i / numSamples) * 2 * Math.PI;
    const playerY = calculateCombinedSignal(playerWaves, x);
    const targetY = calculateCombinedSignal(targetWaves, x);
    
    const difference = Math.abs(playerY - targetY);
    totalDifference += difference;
    maxDifference = Math.max(maxDifference, difference);
  }

  const averageDifference = totalDifference / numSamples;
  
  // Calculate similarity score (0 to 100)
  // Using a combination of average and maximum difference
  const averageScore = Math.max(0, 100 - (averageDifference * 50));
  const maxScore = Math.max(0, 100 - (maxDifference * 25));
  
  const similarityScore = (averageScore * 0.7 + maxScore * 0.3);

  return Math.round(similarityScore);
};

/**
 * Submits the player's current wave combination for evaluation
 * @param {GameState} state - The current game state
 * @returns {GameState} The updated game state
 */
const submitAttempt = (state) => {
  if (state.attempts >= state.maxAttempts) {
    return state;
  }

  const similarity = compareSignals(state.playerWaves, state.targetWaves);
  
  return {
    ...state,
    attempts: state.attempts + 1,
    gameWon: similarity > 95
  };
};

/**
 * Checks if the game is over
 * @param {GameState} state - The current game state
 * @returns {boolean} Whether the game is over
 */
const isGameOver = (state) =>
  state.gameWon || state.attempts >= state.maxAttempts;

export {
  createInitialState,
  initializeGame,
  addPlayerWave,
  removePlayerWave,
  calculateCombinedSignal,
  submitAttempt,
  isGameOver,
  generateTargetWaves,
  compareSignals
};
