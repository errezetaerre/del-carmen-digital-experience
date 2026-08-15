export type ParticleTarget = {
  x: number;
  y: number;
  active: boolean;
};

export type ParticleFieldProps = {
  target?: ParticleTarget | null;
  className?: string;
  particleCount?: number;
};