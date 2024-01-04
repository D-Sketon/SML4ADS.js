describe("Environment", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const RangeValue =
    require("../../../electron-dist/electron-node/stl/odd/value/RangeValue").default;
  const Wind =
    require("../../../electron-dist/electron-node/stl/odd/environment/Wind").default;
  const EnumValue =
    require("../../../electron-dist/electron-node/stl/odd/value/enumValue").default;

  it("example - 1", () => {
    const value = new EnumValue(["no_wind"]);
    const postValue = Wind.instantiate(value);
    postValue.length.should.equal(1);
    postValue[0].min.should.equal(0);
    postValue[0].max.should.equal(0);
  });

  it("example - 2", () => {
    const value = new EnumValue(["no_wind", "calm"]);
    const postValue = Wind.instantiate(value);
    postValue.length.should.equal(1);
    postValue[0].min.should.equal(0);
    postValue[0].max.should.equal(0.2);
  });

  it("example - 3", () => {
    const value = new EnumValue(["no_wind", "calm", "light_breeze"]);
    const postValue = Wind.instantiate(value);
    postValue.length.should.equal(2);
    postValue[0].min.should.equal(0);
    postValue[0].max.should.equal(0.2);
    postValue[1].min.should.equal(1.6);
    postValue[1].max.should.equal(3.3);
  });

  it("example - 4", () => {
    const value = new RangeValue(1.2, 5.6);
    const postValue = Wind.instantiate(value);
    postValue.length.should.equal(1);
    postValue[0].min.should.equal(1.2);
    postValue[0].max.should.equal(5.6);
  });
});
