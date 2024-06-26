describe("Composition", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const composition =
    require("../../../electron-dist/electron-node/stl/odd/statements/composition").default;

  it("include - instantiate wind - 1", () => {
    const res = composition(['INCLUDE', 'wind', '0, 1']);
    res.should.equal("always (wind>=0 and wind<=1)")
  });

  it("include - instantiate wind - 2", () => {
    const res = composition(['INCLUDE', 'wind', 'no wind']);
    res.should.equal("always (wind==0)")
  });

  it("include - instantiate wind - 3", () => {
    const res = composition(['INCLUDE', 'wind', 'storm, violent storm']);
    res.should.equal("always (wind>=24.5 and wind<=32.6)")
  });

  it("include - instantiate wind - 4", () => {
    const res = composition(['INCLUDE', 'wind', 'no wind, calm, light breeze']);
    res.should.equal("always ((wind>=0 and wind<=0.2) or (wind>=1.6 and wind<=3.3))")
  });

  it("include - instantiate rain - 1", () => {
    const res = composition(['INCLUDE', 'rainfall', 'no rain, light rain, cloudburst']);
    res.should.equal("always ((rainfall>=0 and rainfall<=2.5) or rainfall>=100)")
  });

  it("include - instantiate rain - 2", () => {
    const res = composition(['INCLUDE', 'rainfall', 'no rain, cloudburst']);
    res.should.equal("always (rainfall==0 or rainfall>=100)")
  });

  it("include - instantiate temperature - 1", () => {
    const res = composition(['INCLUDE', 'temperature', '-30, 40 C']);
    res.should.equal("always (temperature>=-30 and temperature<=40)")
  });

  it("include - instantiate temperature - 2", () => {
    const res = composition(['INCLUDE', 'temperature', '32, 212 F']);
    res.should.equal("always (temperature>=0 and temperature<=100)")
  });
});
