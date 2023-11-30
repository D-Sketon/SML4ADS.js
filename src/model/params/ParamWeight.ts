export enum WEIGHT_TYPES {
  MANUAL = "Manual",
  PROBABILISTIC = "Probabilistic",
  UNIFORM_DISTRIBUTION = "Uniform Distribution",
  NORMAL_DISTRIBUTION = "Normal Distribution",
  BERNOULLI_DISTRIBUTION = "Bernoulli Distribution",
  BINOMIAL_DISTRIBUTION = "Binomial Distribution",
  POISSON_DISTRIBUTION = "Poisson Distribution",
  CHI_SQUARED_DISTRIBUTION = "Chi-Squared Distribution",
}

export type MANUAL_WEIGHT_PARAMS = {
  weight: number;
};

export const defaultManualWeightParams: () => MANUAL_WEIGHT_PARAMS = () => ({
  weight: 0,
});

export type UNIFORM_DISTRIBUTION_WEIGHT_PARAMS = {
  a: number;
  b: number;
};

export const defaultUniformDistributionWeightParams: () => UNIFORM_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    a: 0,
    b: 0,
  });

export type NORMAL_DISTRIBUTION_WEIGHT_PARAMS = {
  mean: number;
  std: number;
};

export const defaultNormalDistributionWeightParams: () => NORMAL_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    mean: 0,
    std: 0,
  });

export type BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS = {
  p: number;
};

export const defaultBernoulliDistributionWeightParams: () => BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    p: 0,
  });

export type BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS = {
  n: number;
  p: number;
};

export const defaultBinomialDistributionWeightParams: () => BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    n: 0,
    p: 0,
  });

export type POISSON_DISTRIBUTION_WEIGHT_PARAMS = {
  lambda: number;
};

export const defaultPoissonDistributionWeightParams: () => POISSON_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    lambda: 0,
  });

export type CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS = {
  k: number;
};

export const defaultChiSquaredDistributionWeightParams: () => CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS =
  () => ({
    k: 0,
  });

export type WEIGHT_PARAMS =
  | MANUAL_WEIGHT_PARAMS
  | UNIFORM_DISTRIBUTION_WEIGHT_PARAMS
  | NORMAL_DISTRIBUTION_WEIGHT_PARAMS
  | BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS
  | BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS
  | POISSON_DISTRIBUTION_WEIGHT_PARAMS
  | CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS;


export const defaultWeightParams: (type: WEIGHT_TYPES) => WEIGHT_PARAMS = (type) => {
  switch (type) {
    case WEIGHT_TYPES.MANUAL:
      return defaultManualWeightParams();
    case WEIGHT_TYPES.UNIFORM_DISTRIBUTION:
      return defaultUniformDistributionWeightParams();
    case WEIGHT_TYPES.NORMAL_DISTRIBUTION:
      return defaultNormalDistributionWeightParams();
    case WEIGHT_TYPES.BERNOULLI_DISTRIBUTION:
      return defaultBernoulliDistributionWeightParams();
    case WEIGHT_TYPES.BINOMIAL_DISTRIBUTION:
      return defaultBinomialDistributionWeightParams();
    case WEIGHT_TYPES.POISSON_DISTRIBUTION:
      return defaultPoissonDistributionWeightParams();
    case WEIGHT_TYPES.CHI_SQUARED_DISTRIBUTION:
      return defaultChiSquaredDistributionWeightParams();
    default:
      return defaultManualWeightParams();
  }
};