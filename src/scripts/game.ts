/**
 * @file game.ts
 * @description Core game logic for Wavle using a TypeScript class-based approach.
 */

class SineWave {
  constructor(
    public amplitude = 0,
    public frequency = 1,
    public phase = 0,
  ) {}
}

class GameState {
  targetWave: SineWave[] = [];
  /**
   * This is called wave. The elements are called subwaves.
   */
  currentWave: SineWave[] = [];
  playerWaves: SineWave[][] = [];
  maxWaves: number;
  maxAttempts: number;

  constructor(maxWaves = 3, maxAttempts = 6) {
    this.maxWaves = maxWaves;
    this.maxAttempts = maxAttempts;
    this.currentWave = this.defaultWave();
  }

  defaultWave(): SineWave[] {
    return Array(this.maxWaves)
      .fill()
      .map(() => new SineWave(0, 0, 0));
  }

  initializeGame(difficulty: number): void {
    this.targetWave = this.generateTargetWave(difficulty);
  }

  private generateTargetWave(difficulty: number): SineWave[] {
    const waves: SineWave[] = [];
    const numWaves = Math.min(difficulty, 5);

    for (let i = 0; i < numWaves; i++) {
      waves.push(
        new SineWave(
          Math.random() * 0.5 + 0.5,
          Math.random() * difficulty + 1,
          Math.random() * Math.PI * 2,
        ),
      );
    }

    const totalAmplitude = waves.reduce((sum, wave) => sum + wave.amplitude, 0);
    waves.forEach((wave) => (wave.amplitude /= totalAmplitude));

    return waves;
  }

  submitPlayerWave(): void {
    if (this.playerWaves.length < this.maxWaves) {
      this.playerWaves.push(this.currentWave);
      this.currentWave = [];
    }
  }

  getLastPlayerWave(): SineWave[] {
    return this.playerWaves[this.playerWaves.length - 1] || [];
  }

  updateCurrentWave(newWave: SineWave[]): void {
    this.currentWave = newWave;
  }

  updateCurrentSubWave(index: number, newSubWave: SineWave): void {
    this.currentWave[index] = newSubWave;
    console.log("after", this.currentWave);
  }

  removePlayerWave(index: number): void {
    this.playerWaves.splice(index, 1);
  }

  private calculateCombinedSignal(waves: SineWave[], x: number): number {
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
    if (lastWave.length === 0) return false;
    const similarity = this.compareSignals(lastWave, this.targetWave);
    return similarity > 95;
  }

  isGameOver(): boolean {
    return (
      this.hasWinningAttempt() || this.playerWaves.length >= this.maxAttempts
    );
  }

  getState(): GameState {
    return this;
  }
}

export default GameState;
