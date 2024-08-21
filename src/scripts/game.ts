/**
 * @file game.ts
 * @description Core game logic for Wavle using a TypeScript class-based approach.
 */

export class SineWave {
  /**
   * Amplitude of the wave in units
   */
  amplitude: number;

  /**
   * Frequency of the wave in Hz
   */
  frequency: number;

  /**
   * Phase of the wave in radians
   */
  phase: number;

  constructor(amplitude = 0, frequency = 1, phase = 0) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
  }
}

/**
 * The frequencies that are allowed to be generated and guessed
 */
export const allowedFrequencies = [1, 2, 3, 4, 5];

export class GameState {
  /**
   * This is the target wave that the player must match.
   */
  targetWave: SineWave[] = [];

  /**
   * This is called wave. The elements are called subwaves.
   */
  currentWave: SineWave[] = null;

  /**
   * Submitted attempts
   */
  playerWaves: SineWave[][] = [];

  /**
   * Maximum number of attempts (game ends)
   */
  maxAttempts = 6;

  /**
   * Whether to use phase in the game
   */
  usePhase = false;

  constructor() {
    this.currentWave = this.defaultWave();
  }

  /**
   * Initial wave
   */
  defaultWave(): SineWave[] {
    return allowedFrequencies.map((freq) => new SineWave(1, freq, 0));
  }

  /**
   * Reset the playing state. Generates a new target wave.
   * If changes to difficulty are desired, mutate the state before calling this
   * function.
   */
  initializeGame(): void {
    this.targetWave = this.generateTargetWave();
  }

  /**
   * Helper function to generate amplitude
   */
  generateAmplitude(): number {
    const rand = Math.random();
    if (rand < 0.1) {
      return generateNumber(1.0, 2.0, 0);
    } else if (rand < 0.9) {
      return generateNumber(1.0, 5.0, 0);
    } else {
      return generateNumber(5.0, 20.0, 0);
    }
  }

  // Helper function to generate phase
  generatePhase(): number {
    return this.usePhase ? generateNumber(0, Math.PI * 2, 2) : 0;
  }

  generateAmplitudes(numWaves: number): number[] {
    // generate amplitudes for n waves by generating n-1 random numbers
    // between 0 and 1 and then computing the intervals between them
    const intervals = Array(numWaves - 1)
      .fill(0)
      .map(() => generateNumber(0.1, 0.9)); // actually limit to 0.1-0.9, so we are less likely to get 0 amplitude
    intervals.unshift(0);
    intervals.push(1);

    intervals.sort((a, b) => a - b);

    const amplitudes: number[] = [];
    for (let i = 1; i <= numWaves; i++) {
      const amplitude = intervals[i] - intervals[i - 1];
      amplitudes.push(amplitude);
    }

    return amplitudes;
  }

  generateTargetWave(): SineWave[] {
    const waves: SineWave[] = [];
    const numWaves = allowedFrequencies.length;
    const amplitudes = this.generateAmplitudes(numWaves);

    for (let i = 0; i < allowedFrequencies.length; i++) {
      const freq = allowedFrequencies[i];
      waves.push(new SineWave(amplitudes[i], freq, this.generatePhase()));
    }

    // Ensure at least one wave has a significant amplitude
    if (numWaves > 0 && waves.every((wave) => wave.amplitude < 0.5)) {
      const index = Math.floor(Math.random() * numWaves);
      waves[index].amplitude = generateNumber(0.5, 1.0);
    }

    return waves;
  }

  submitPlayerWave(): void {
    if (this.playerWaves.length < this.maxAttempts) {
      this.playerWaves.push(this.currentWave);
      this.currentWave = this.defaultWave();
    }
  }

  getLastPlayerWave(): SineWave[] | null {
    return this.playerWaves[this.playerWaves.length - 1] || null;
  }

  updateCurrentWave(newWave: SineWave[]): void {
    this.currentWave = newWave;
  }

  updateCurrentSubWave(index: number, newSubWave: SineWave): void {
    this.currentWave[index] = newSubWave;
  }

  removePlayerWave(index: number): void {
    this.playerWaves.splice(index, 1);
  }

  public calculateCombinedSignal(waves: SineWave[], x: number): number {
    return waves.reduce(
      (sum, wave) =>
        sum + wave.amplitude * Math.sin(wave.frequency * x + wave.phase),
      0,
    );
  }

  compareSignals(playerWaves: SineWave[], targetWaves: SineWave[]): number {
    const numSamples = 1000;
    let totalDifference = 0;
    let maxDifference = 0;

    for (let i = 0; i < numSamples; i++) {
      const x = (i / numSamples) * 2 * Math.PI;
      const playerY = this.calculateCombinedSignal(playerWaves, x);
      const targetY = this.calculateCombinedSignal(targetWaves, x);

      const difference = Math.abs(playerY - targetY);
      totalDifference += difference;
      maxDifference = Math.max(maxDifference, difference);
    }

    const averageDifference = totalDifference / numSamples;

    const averageScore = Math.max(0, 100 - averageDifference * 50);
    const maxScore = Math.max(0, 100 - maxDifference * 25);

    const similarityScore = averageScore * 0.7 + maxScore * 0.3;

    return Math.round(similarityScore);
  }

  hasWinningAttempt(): boolean {
    const lastWave = this.getLastPlayerWave();
    if (!lastWave || lastWave.length === 0) return false;
    const similarity = this.compareSignals(lastWave, this.targetWave);
    return similarity > 95;
  }

  /**
   * Returns the current game status
   * @returns "win" | "lose" | "playing"
   */
  getGameStatus(): "win" | "lose" | "playing" {
    if (this.hasWinningAttempt()) {
      return "win";
    } else if (this.playerWaves.length >= this.maxAttempts) {
      return "lose";
    } else {
      return "playing";
    }
  }

  getState(): GameState {
    return this;
  }
}

// Helper function to generate a number within a range and round it
function generateNumber(min: number, max: number, decimals = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

export default GameState;
