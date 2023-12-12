export class EulerSpiral {
  gamma: number;
  constructor(gamma: number) {
    this.gamma = gamma;
  }

  static createFromLengthAndCurvature(
    length: number,
    curvStart: number,
    curvEnd: number
  ) {
    if (length === 0) {
      return new EulerSpiral(0);
    }
    const gamma = (curvEnd - curvStart) / length;
    return new EulerSpiral(gamma);
  }

  calc(
    s = 0,
    x0 = 0,
    y0 = 0,
    kappa0 = 0,
    theta0 = 0
  ): [number, number, number] {
    // Start
    const C0: ComplexNumber = new ComplexNumber(x0, y0);

    if (this.gamma === 0 && kappa0 === 0) {
      // Straight line
      const Cs: ComplexNumber = C0.add(ComplexNumber.fromPolar(1, theta0 * s));
      return [Cs.real, Cs.imag, theta0];
    } else if (this.gamma === 0 && kappa0 !== 0) {
      // Arc
      const expTerm: ComplexNumber = ComplexNumber.fromPolar(
        1 / kappa0,
        theta0
      );
      const Cs: ComplexNumber = C0.add(
        expTerm.multiply(
          new ComplexNumber(Math.sin(kappa0 * s), 1 - Math.cos(kappa0 * s))
        )
      );
      return [Cs.real, Cs.imag, theta0];
    } else {
      // Fresnel integrals
      const arg1: number =
        (kappa0 + this.gamma * s) / Math.sqrt(Math.PI * Math.abs(this.gamma));
      const arg2: number = kappa0 / Math.sqrt(Math.PI * Math.abs(this.gamma));
      const SaCa: [number, number] = this.fresnel(arg1);
      const SbCb: [number, number] = this.fresnel(arg2);

      // Euler Spiral
      const Cs1: ComplexNumber = ComplexNumber.fromPolar(
        Math.sqrt(Math.PI / Math.abs(this.gamma)),
        theta0 - kappa0 ** 2 / (2 * this.gamma)
      );
      const Cs2: ComplexNumber = new ComplexNumber(
        Math.sign(this.gamma) * (SaCa[1] - SbCb[1]),
        SaCa[0] - SbCb[0]
      );

      const Cs: ComplexNumber = C0.add(Cs1.multiply(Cs2));

      // Tangent at each point
      const theta: number = (this.gamma * s ** 2) / 2 + kappa0 * s + theta0;

      return [Cs.real, Cs.imag, theta];
    }
  }

  private fresnel(x: number): [number, number] {
    // Numerical integration (Simpson's rule) for Fresnel S(x) and C(x)
    const n = 100; // Number of intervals
    const h = x / n;

    let sumSin = 0;
    let sumCos = 0;

    for (let i = 0; i <= n; i++) {
      const t = i * h;
      const coefficient = i % 2 === 0 ? 2 : 4;

      sumSin += coefficient * Math.sin((Math.PI / 2) * t ** 2);
      sumCos += coefficient * Math.cos((Math.PI / 2) * t ** 2);
    }

    const S = (h / 3) * sumSin;
    const C = (h / 3) * sumCos;

    return [S, C];
  }
}

class ComplexNumber {
  constructor(public real: number, public imag: number) {}

  static fromPolar(r: number, theta: number): ComplexNumber {
    const real: number = r * Math.cos(theta);
    const imag: number = r * Math.sin(theta);
    return new ComplexNumber(real, imag);
  }

  add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.real + other.real, this.imag + other.imag);
  }

  multiply(other: ComplexNumber): ComplexNumber {
    const real: number = this.real * other.real - this.imag * other.imag;
    const imag: number = this.real * other.imag + this.imag * other.real;
    return new ComplexNumber(real, imag);
  }
}
