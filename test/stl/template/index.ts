describe("TEMPLATE2STL", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const {
    _template2Stl,
    _template2PStl,
  } = require("../../../electron-dist/electron-node/stl/template/index");

  it("simple example", () => {
    const templates = [
      "GLOBALLY ( x IS EQUAL TO y AND x IS GREATER THAN y )",
      "FINALLY ( x IS EQUAL TO y OR x IS GREATER THAN y )",
      "GLOBALLY ( IF x IS EQUAL TO y AND x IS GREATER THAN y THEN x IS NOT GREATER THAN y AND x IS LESS THAN y )",
      "GLOBALLY ( IF ( NOT FINALLY x IS EQUAL TO y ) THEN ( x IS EQUAL TO y NOT UNTIL x IS EQUAL TO y ) )",
      "( GLOBALLY ( IF ( ( NOT FINALLY x IS EQUAL TO y ) ) THEN ( FINALLY ( GLOBALLY x IS EQUAL TO y  ) ) ) )",
      `
      GLOBALLY
        IF 
          NOT FINALLY 
            x IS EQUAL TO y 
        THEN 
          FINALLY
            GLOBALLY 
              x IS EQUAL TO y
      `,
    ];
    const res = _template2Stl(templates);
    res.should.deep.include.members([
      "always ((x==y) and (x>y))",
      "eventually ((x==y) or (x>y))",
      "always (((x==y) and (x>y)) implies ((not(x>y)) and (x<y)))",
      "always ((not(eventually (x==y))) implies (not((x==y) until (x==y))))",
      "always ((not(eventually (x==y))) implies (eventually (always (x==y))))",
      "always ((not(eventually (x==y))) implies (eventually (always (x==y))))",
    ]);
  });

  it("indent", () => {
    const templates = [
      `
      GLOBALLY
          IF 
            NOT FINALLY 
              x IS EQUAL TO y 
          THEN 
            FINALLY
              GLOBALLY 
                x IS EQUAL TO y
      `,
      `
      GLOBALLY
          IF 
            NOT FINALLY 
                  x IS EQUAL TO y 
          THEN 
            FINALLY
              GLOBALLY 
                x IS EQUAL TO y
      `,
    ];
    const res = _template2Stl(templates);
    res.should.deep.include.members([
      "always ((not(eventually (x==y))) implies (eventually (always (x==y))))",
      "always ((not(eventually (x==y))) implies (eventually (always (x==y))))",
    ]);
  });

  it("multi atom", () => {
    const templates = [
      `
      GLOBALLY
          IF 
            NOT FINALLY 
              speed of car IS EQUAL TO 40
          THEN 
            FINALLY
              GLOBALLY 
                distance of Ego IS EQUAL TO 30
      `,
    ];
    const res = _template2Stl(templates);
    res.should.deep.include.members([
      "always ((not(eventually (speed_car==40))) implies (eventually (always (distance_Ego==30))))",
    ]);
  });

  it("interval", () => {
    const templates = [
      `
      GLOBALLY FROM 0 TO 10
          IF 
            NOT FINALLY 
              speed of car IS EQUAL TO 40
          THEN 
            FINALLY FROM 0 TO 10
              GLOBALLY FROM start TO end
                distance of Ego IS EQUAL TO 30
      `,
    ];
    const res = _template2Stl(templates);
    res.should.deep.include.members([
      "always[0:10] ((not(eventually (speed_car==40))) implies (eventually[0:10] (always[start:end] (distance_Ego==30))))",
    ]);
  });

  it("pstl", () => {
    const templates = [
      `
      GLOBALLY FROM 0 TO 10
          IF 
            NOT FINALLY 
              speed of car IS EQUAL TO 40
          THEN 
            FINALLY FROM 0 TO 10
              GLOBALLY FROM start TO end
                distance of Ego IS EQUAL TO 30
      `,
    ];
    const res = _template2PStl(templates);
    res.should.deep.include.members([
      "always[a:b] ((not(eventually (speed_car==c))) implies (eventually[d:e] (always[start:end] (distance_Ego==f))))",
    ]);
  });
});
