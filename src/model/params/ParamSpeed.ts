export enum SPEED_TYPES {
  MANUAL = "Manual",
  PROBABILISTIC = "Probabilistic",
  UNIFORM_DISTRIBUTION = "Uniform Distribution",
  NORMAL_DISTRIBUTION = "Normal Distribution",
  BERNOULLI_DISTRIBUTION = "Bernoulli Distribution",
  BINOMIAL_DISTRIBUTION = "Binomial Distribution",
  POISSON_DISTRIBUTION = "Poisson Distribution",
  CHI_SQUARED_DISTRIBUTION = "Chi-Squared Distribution",
  CUSTOMIZED_DISTRIBUTION = "Customized Distribution",
}

export type MANUAL_SPEED_PARAMS = {
  initSpeed: number;
};

export const defaultManualSpeedParams: () => MANUAL_SPEED_PARAMS = () => ({
  initSpeed: 0,
});

export type UNIFORM_DISTRIBUTION_SPEED_PARAMS = {
  a: number;
  b: number;
};

export const defaultUniformDistributionSpeedParams: () => UNIFORM_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    a: 0,
    b: 0,
  });

export type NORMAL_DISTRIBUTION_SPEED_PARAMS = {
  mean: number;
  std: number;
};

export const defaultNormalDistributionSpeedParams: () => NORMAL_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    mean: 0,
    std: 0,
  });

export type BERNOULLI_DISTRIBUTION_SPEED_PARAMS = {
  p: number;
};

export const defaultBernoulliDistributionSpeedParams: () => BERNOULLI_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    p: 0,
  });

export type BINOMIAL_DISTRIBUTION_SPEED_PARAMS = {
  n: number;
  p: number;
};

export const defaultBinomialDistributionSpeedParams: () => BINOMIAL_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    n: 0,
    p: 0,
  });

export type POISSON_DISTRIBUTION_SPEED_PARAMS = {
  lambda: number;
};

export const defaultPoissonDistributionSpeedParams: () => POISSON_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    lambda: 0,
  });

export type CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS = {
  k: number;
};

export const defaultChiSquaredDistributionSpeedParams: () => CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    k: 0,
  });

export type CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS = {
  formula: string;
};

export const defaultCustomizedDistributionSpeedParams: () => CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    formula: "",
  });

export type SPEED_PARAMS =
  | MANUAL_SPEED_PARAMS
  | UNIFORM_DISTRIBUTION_SPEED_PARAMS
  | NORMAL_DISTRIBUTION_SPEED_PARAMS
  | BERNOULLI_DISTRIBUTION_SPEED_PARAMS
  | BINOMIAL_DISTRIBUTION_SPEED_PARAMS
  | POISSON_DISTRIBUTION_SPEED_PARAMS
  | CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS
  | CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS;

export const defaultSpeedParams: (type: SPEED_TYPES) => SPEED_PARAMS = (type) => {
  switch (type) {
    case SPEED_TYPES.MANUAL:
      return defaultManualSpeedParams();
    case SPEED_TYPES.UNIFORM_DISTRIBUTION:
      return defaultUniformDistributionSpeedParams();
    case SPEED_TYPES.NORMAL_DISTRIBUTION:
      return defaultNormalDistributionSpeedParams();
    case SPEED_TYPES.BERNOULLI_DISTRIBUTION:
      return defaultBernoulliDistributionSpeedParams();
    case SPEED_TYPES.BINOMIAL_DISTRIBUTION:
      return defaultBinomialDistributionSpeedParams();
    case SPEED_TYPES.POISSON_DISTRIBUTION:
      return defaultPoissonDistributionSpeedParams();
    case SPEED_TYPES.CHI_SQUARED_DISTRIBUTION:
      return defaultChiSquaredDistributionSpeedParams();
    case SPEED_TYPES.CUSTOMIZED_DISTRIBUTION:
      return defaultCustomizedDistributionSpeedParams();
    default:
      return defaultManualSpeedParams();
  }
}