describe("ODD2STL", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const {
    _odd2Stl,
    odd2Stl,
  } = require("../../../electron-dist/electron-node/stl/odd/index");

  it("example - 1", () => {
    const compositionLines = [
      "INCLUDE lane mark IS 2, 5",
      "EXCLUDE lane mark IS 2, 5",
      "Cond_1 CONDITIONAL drivable area type ARE minor roads, parking, shared space",
      "Cond_2 CONDITIONAL horizontal plane IS curved roads",
    ];
    const conditionalLines: string[] = [
      "Cond_1 INCLUDE speed OF subject vehicle FOR minor roads IS 0, 15 km/h",
      "Cond_1 INCLUDE speed OF subject vehicle FOR parking, shared space IS 0, 10 km/h",
      "Cond_2 EXCLUDE radius OF curved road IS 0, 5 m",
    ];
    const res = _odd2Stl(compositionLines, conditionalLines);
    res[0].should.deep.include.members([
      "always[0:inf] (lane_mark>=2 and lane_mark<=5)",
      "always[0:inf] (not(lane_mark>=2 and lane_mark<=5))",
    ]);
    res[1].should.deep.include.members([
      "always[0:inf] ((drivable_area_type==minor_roads or drivable_area_type==parking or drivable_area_type==shared_space) and ((location_subject_vehicle==minor_roads) implies (speed_subject_vehicle>=0 and speed_subject_vehicle<=4.166666666666667)) and ((location_subject_vehicle==parking or location_subject_vehicle==shared_space) implies (speed_subject_vehicle>=0 and speed_subject_vehicle<=2.7777777777777777)))",
      "always[0:inf] ((horizontal_plane==curved_roads) and (not(curved_road_radius>=0 and curved_road_radius<=5)))",
    ]);
  });

  it("example - 2", () => {
    const lines = `
    INCLUDE lane mark IS 2, 5

    EXCLUDE lane mark IS 2, 5

    CONDITIONAL drivable area type ARE minor roads, parking, shared space
      INCLUDE speed OF subject vehicle FOR minor roads IS 0, 15 km/h  
      INCLUDE speed OF subject vehicle FOR parking, shared space IS 0, 10 km/h

    # This is a comment

    # This is another comment
    CONDITIONAL horizontal plane IS curved roads # This is a comment
      EXCLUDE radius OF curved road IS 0, 5 m
    `
    const res = odd2Stl(lines);
    res[0].should.deep.include.members([
      "always[0:inf] (lane_mark>=2 and lane_mark<=5)",
      "always[0:inf] (not(lane_mark>=2 and lane_mark<=5))",
    ]);
    res[1].should.deep.include.members([
      "always[0:inf] ((drivable_area_type==minor_roads or drivable_area_type==parking or drivable_area_type==shared_space) and ((location_subject_vehicle==minor_roads) implies (speed_subject_vehicle>=0 and speed_subject_vehicle<=4.166666666666667)) and ((location_subject_vehicle==parking or location_subject_vehicle==shared_space) implies (speed_subject_vehicle>=0 and speed_subject_vehicle<=2.7777777777777777)))",
      "always[0:inf] ((horizontal_plane==curved_roads) and (not(curved_road_radius>=0 and curved_road_radius<=5)))",
    ]);
  });
});
