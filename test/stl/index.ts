describe("ODD2STL", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const Odd2Stl =
    require("../../electron-dist/electron-node/stl/index").default;

  it("example - 1", () => {
    const compositionLines = [
      "Include lane mark is [2, 5]",
      "Exclude lane mark is [2, 5]",
      "Cond_1 Conditional drivable area type are [minor roads, parking, shared space]",
      "Cond_2 Conditional horizontal plane is [curved roads]",
    ];
    const conditionalLines: string[] = [
      "Cond_1 Include speed of subject vehicle for [minor roads] is [0, 15 km/h]",
      "Cond_1 Include speed of subject vehicle for [parking, shared space] is [0, 10 km/h]",
      "Cond_2 Exclude radius of curved road is [0, 5 m]",
    ];
    const res = Odd2Stl(compositionLines, conditionalLines);
    res[0].should.deep.include.members([
      "always[t_i:t_e] (lane_mark>=2 and lane_mark<=5)",
      "always[t_i:t_e] (not(lane_mark>=2 and lane_mark<=5))",
    ]);
    res[1].should.deep.include.members([
      "always[t_i:t_e] ((drivable_area_type==minor_roads or drivable_area_type==parking or drivable_area_type==shared_space) and ((subject_vehicle_location==minor_roads) implies (subject_vehicle_speed>=0 and subject_vehicle_speed<=4.166666666666667)) and ((subject_vehicle_location==parking or subject_vehicle_location==shared_space) implies (subject_vehicle_speed>=0 and subject_vehicle_speed<=2.7777777777777777)))",
      "always[t_i:t_e] ((horizontal_plane==curved_roads) and (not(curved_road_radius>=0 and curved_road_radius<=5)))",
    ]);
  });
});
