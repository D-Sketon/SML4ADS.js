class ObjInfo:
    def __init__(self):
        self.name = ''
        self.roadId = -1
        self.laneSectionId = -1
        self.laneId = -1
        self.junctionId = -1
        self.intersection = False
        self.road_s = 0.0
        self.lane_s = 0.0
        self.offset = 0.0
        self.width = 0.0
        self.length = 0.0
        self.speed = 0.0
        self.acceleration = 0.0
        self.model = ''
        self.t = 0.0
        self.waypoint = None

    def __repr__(self):
        return f'ObjInfo[acceleration:{self.acceleration};speed:{self.speed}]'
