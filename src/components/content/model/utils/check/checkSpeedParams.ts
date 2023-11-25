import {
  SPEED_TYPES,
  SPEED_PARAMS,
  MANUAL_SPEED_PARAMS,
  UNIFORM_DISTRIBUTION_SPEED_PARAMS,
  NORMAL_DISTRIBUTION_SPEED_PARAMS,
  BERNOULLI_DISTRIBUTION_SPEED_PARAMS,
  BINOMIAL_DISTRIBUTION_SPEED_PARAMS,
  POISSON_DISTRIBUTION_SPEED_PARAMS,
  CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS,
  CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS,
} from "../../../../../model/params/ParamSpeed";
import {
  _assertRequired,
  _assertNumberGE,
  _assertNumber,
  _assertNumberLE,
} from "../../../../../utils/assert";

export const checkSpeedParams = (
  speedType: SPEED_TYPES,
  speedParams: SPEED_PARAMS
) => {
  switch (speedType) {
    case SPEED_TYPES.MANUAL:
      checkManualSpeedParams(speedParams as MANUAL_SPEED_PARAMS);
      break;
    case SPEED_TYPES.UNIFORM_DISTRIBUTION:
      checkUniformDistributionSpeedParams(
        speedParams as UNIFORM_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.NORMAL_DISTRIBUTION:
      checkNormalDistributionSpeedParams(
        speedParams as NORMAL_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.BERNOULLI_DISTRIBUTION:
      checkBernoulliDistributionSpeedParams(
        speedParams as BERNOULLI_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.BINOMIAL_DISTRIBUTION:
      checkBinomialDistributionSpeedParams(
        speedParams as BINOMIAL_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.POISSON_DISTRIBUTION:
      checkPoissonDistributionSpeedParams(
        speedParams as POISSON_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.CHI_SQUARED_DISTRIBUTION:
      checkChiSquaredDistributionSpeedParams(
        speedParams as CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    case SPEED_TYPES.CUSTOMIZED_DISTRIBUTION:
      checkCustomizedDistributionSpeedParams(
        speedParams as CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS
      );
      break;
    default:
      throw new Error("Invalid speed type");
  }
};

const checkManualSpeedParams = (speedParams: MANUAL_SPEED_PARAMS) => {
  const { maxSpeed, initSpeed } = speedParams;

  _assertRequired(maxSpeed, "maxSpeed is required");
  _assertNumberGE(maxSpeed, 0, "maxSpeed should >= 0");

  _assertRequired(initSpeed, "initSpeed is required");
  _assertNumberGE(initSpeed, 0, "initSpeed should >= 0");
  // initSpeed should <= maxSpeed
  if (Number(initSpeed) > Number(maxSpeed)) {
    throw new Error("initSpeed should <= maxSpeed");
  }
};

const checkUniformDistributionSpeedParams = (
  speedParams: UNIFORM_DISTRIBUTION_SPEED_PARAMS
) => {
  const { a, b } = speedParams;

  _assertRequired(a, "a is required");
  _assertNumberGE(a, 0, "a should >= 0");

  _assertRequired(b, "b is required");
  _assertNumberGE(b, 0, "b should >= 0");
  // a should <= b
  if (Number(a) > Number(b)) {
    throw new Error("a should <= b");
  }
};

const checkNormalDistributionSpeedParams = (
  speedParams: NORMAL_DISTRIBUTION_SPEED_PARAMS
) => {
  const { mean, std } = speedParams;

  _assertRequired(mean, "mean is required");
  _assertNumberGE(mean, 0, "mean should >= 0");

  _assertRequired(std, "std is required");
  _assertNumber(std, "std should be number");
};

const checkBernoulliDistributionSpeedParams = (
  speedParams: BERNOULLI_DISTRIBUTION_SPEED_PARAMS
) => {
  const { p } = speedParams;

  _assertRequired(p, "p is required");
  _assertNumber(p, "p should be number");
  _assertNumberGE(p, 0, "p should >= 0");
  _assertNumberLE(p, 1, "p should <= 1");
};

const checkBinomialDistributionSpeedParams = (
  speedParams: BINOMIAL_DISTRIBUTION_SPEED_PARAMS
) => {
  const { n, p } = speedParams;

  _assertRequired(n, "n is required");
  _assertNumber(n, "n should be number");
  _assertNumberGE(n, 0, "n should >= 0");

  _assertRequired(p, "p is required");
  _assertNumber(p, "p should be number");
  _assertNumberGE(p, 0, "p should >= 0");
  _assertNumberLE(p, 1, "p should <= 1");
};

const checkPoissonDistributionSpeedParams = (
  speedParams: POISSON_DISTRIBUTION_SPEED_PARAMS
) => {
  const { lambda } = speedParams;

  _assertRequired(lambda, "lambda is required");
  _assertNumber(lambda, "lambda should be number");
  _assertNumberGE(lambda, 0, "lambda should >= 0");
};

const checkChiSquaredDistributionSpeedParams = (
  speedParams: CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS
) => {
  const { k } = speedParams;

  _assertRequired(k, "k is required");
  _assertNumber(k, "k should be number");
  _assertNumberGE(k, 0, "k should >= 0");
};

const checkCustomizedDistributionSpeedParams = (
  speedParams: CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS
) => {
  const { formula } = speedParams;

  _assertRequired(formula, "formula is required");
};
