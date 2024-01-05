describe("Preprocess", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const preprocess = require("../../../electron-dist/electron-node/stl/odd/preprocess");

  it("composition - basic - 1", () => {
    const input = "INCLUDE lane mark IS [2, 5]";
    const output = preprocess.preprocessForComposition(input);
    output[0].should.equal("INCLUDE");
    output[1].should.equal("lane mark");
    output[2].should.equal("2, 5");
    output[3].should.equal("");
  });

  it("composition - basic - 2", () => {
    const input = "EXCLUDE    lane    mark     IS      [2,    5]";
    const output = preprocess.preprocessForComposition(input);
    output[0].should.equal("EXCLUDE");
    output[1].should.equal("lane mark");
    output[2].should.equal("2, 5");
    output[3].should.equal("");
  });

  it("composition - basic - 3", () => {
    const input = "EXCLUDE    lane    marks     ARE      [2,    5 m/s]";
    const output = preprocess.preprocessForComposition(input);
    output[0].should.equal("EXCLUDE");
    output[1].should.equal("lane marks");
    output[2].should.equal("2, 5 m/s");
    output[3].should.equal("");
  });

  it("composition - condition - 1", () => {
    const input =
      "Cond_1  CONDITIONAL    lane    marks     ARE      [2,    5 m/s]";
    const output = preprocess.preprocessForComposition(input);
    output[0].should.equal("CONDITIONAL");
    output[1].should.equal("lane marks");
    output[2].should.equal("2, 5 m/s");
    output[3].should.equal("Cond_1");
  });

  it("conditional - basic - 1", () => {
    const input =
      "Cond_1 INCLUDE speed OF subject vehicle FOR [minor roads] IS [0, 15 km/h]";
    const output = preprocess.preprocessForConditional(input);
    output[0].should.equal("INCLUDE");
    output[1].should.equal("speed");
    output[2].should.equal("subject vehicle");
    output[3].should.equal("minor roads");
    output[4].should.equal("0, 15 km/h");
    output[5].should.equal("Cond_1");
  });

  it("conditional - basic - 2", () => {
    const input =
      "Cond_1     INCLUDE    speed OF    subject    vehicle FOR [minor    roads]    IS [0,     15     km/h]";
    const output = preprocess.preprocessForConditional(input);
    output[0].should.equal("INCLUDE");
    output[1].should.equal("speed");
    output[2].should.equal("subject vehicle");
    output[3].should.equal("minor roads");
    output[4].should.equal("0, 15 km/h");
    output[5].should.equal("Cond_1");
  });

  it("conditional - basic - 2", () => {
    const input =
      "Cond_1     INCLUDE    speed OF    subject    vehicle    IS [0,     15     km/h]";
    const output = preprocess.preprocessForConditional(input);
    output[0].should.equal("INCLUDE");
    output[1].should.equal("speed");
    output[2].should.equal("subject vehicle");
    output[3].should.equal("");
    output[4].should.equal("0, 15 km/h");
    output[5].should.equal("Cond_1");
  });

  it("conditional - basic - 3", () => {
    const input =
      "Cond_1     INCLUDE    speed OF    [subject    vehicle]    IS [0,     15     km/h]";
    const output = preprocess.preprocessForConditional(input);
    output[0].should.equal("INCLUDE");
    output[1].should.equal("speed");
    output[2].should.equal("subject vehicle");
    output[3].should.equal("");
    output[4].should.equal("0, 15 km/h");
    output[5].should.equal("Cond_1");
  });
});
