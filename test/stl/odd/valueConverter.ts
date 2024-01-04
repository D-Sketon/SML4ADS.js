describe("ValueConverter", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const EnumValue =
    require("../../../electron-dist/electron-node/stl/odd/value/enumValue").default;
  const RangeValue =
    require("../../../electron-dist/electron-node/stl/odd/value/RangeValue").default;
  const valueConverter =
    require("../../../electron-dist/electron-node/stl/odd/value/valueConverter").default;

  it("illegal input", () => {
    try {
      valueConverter("");
    } catch (e: any) {
      e.message.should.equal("value is empty");
    }
  });

  it("constant value - 1", () => {
    const res = valueConverter("1");
    res.should.be.instanceOf(EnumValue);
    res.value.should.deep.include.members(["1"]);
  });

  it("constant value - 2", () => {
    const res = valueConverter("   a  a   a   ");
    res.should.be.instanceOf(EnumValue);
    res.value.should.deep.include.members(["a_a_a"]);
  });

  it("enum value - 1", () => {
    const res = valueConverter("1, 2,   3,    4");
    res.should.be.instanceOf(EnumValue);
    res.value.should.deep.include.members(["1", "2", "3", "4"]);
  });

  it("enum value - 2", () => {
    const res = valueConverter("   a a a   , b,   c, d    d");
    res.should.be.instanceOf(EnumValue);
    res.value.should.deep.include.members(["a_a_a", "b", "c", "d_d"]);
  });

  it("range value - 1", () => {
    const res = valueConverter("  -1,   2");
    res.should.be.instanceOf(RangeValue);
    res.min.should.equal(-1);
    res.max.should.equal(2);
  });

  it("range value - 2", () => {
    const res = valueConverter("  -1.5,   ∞");
    res.should.be.instanceOf(RangeValue);
    res.min.should.equal(-1.5);
    res.max.should.equal(Infinity);
  });

  it("range value - 3", () => {
    const res = valueConverter("  -∞,   ∞");
    res.should.be.instanceOf(RangeValue);
    res.min.should.equal(-Infinity);
    res.max.should.equal(Infinity);
  });

  it("range value with unit - 1", () => {
    const res = valueConverter(" 1,  2  m");
    res.should.be.instanceOf(RangeValue);
    res.min.should.equal(1);
    res.max.should.equal(2);
  });

  it("range value with unit - 2", () => {
    const res = valueConverter(" 1,  2  km");
    res.should.be.instanceOf(RangeValue);
    res.min.should.equal(1000);
    res.max.should.equal(2000);
    res.minRef.should.equal(1);
    res.maxRef.should.equal(2);
    res.unit.should.equal("km");
  });
});
