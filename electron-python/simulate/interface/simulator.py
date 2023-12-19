"""
@Project : AutonomousDrivingSimulation
@Time : 2022/2/2-12:23
@Author : zch
@Description : 模拟器接口，不同模拟器需要根据模拟器API实现
"""
import json
import os
import random
import sys
from typing import Optional

import numpy as np

try:
    curr_dir = os.getcwd()
    parent_dir = curr_dir[:curr_dir.rfind(os.path.sep)]
    sys.path.append(parent_dir)
except IndexError:
    print('append path error!')

from datetime import datetime

from simulate.interface.BehaviorTree import BehaviorTree
from simulate.utils.MyTimer import MyTimer


class SimulationResult:
    """
        仿真结果类
    """

    def __init__(self, start_time=None, end_time=None):
        self.start_time = start_time
        self.end_time = end_time
        self.duration = 0.0
        self.info = {}

    def __repr__(self):
        return f'SimulationResult[startTime:{self.start_time}, endTime:{self.end_time}, duration:{self.duration}]'

    def get_duration(self):
        """
        获取本次仿真的持续时间
        :return: float
        """
        if self.start_time is not None and self.end_time is not None:
            return self.end_time.timestamp() - self.start_time.timestamp()


class TestResult:
    """
        测试结果
    """

    def __init__(self):
        self.pic_path = ''
        self.pic_count = 1


class Car:
    """
    对应ADSML所给的JSON场景描述中的Car
    """

    def __init__(self):
        self.heading = True
        self.init_speed = 0.0
        self.init_lane_id = 0
        self.behavior_tree: Optional[BehaviorTree] = None
        self.max_speed = 10.0
        self.min_speed = 0.0
        self.model = 'vehicle.tesla.model3'
        self.name = 'car0'
        self.actor_ref = ''
        self.road_min_offset = 0.0
        self.road_max_offset = 0.0
        self.min_lateral_offset = 0.0
        self.max_lateral_offset = 0.0
        self.road_deviation = 0.0
        self.init_road_id = 0
        self.behavior_tree_path = ''
        self.location_type = ''
        self.x = 0.0
        self.y = 0.0

    def __repr__(self):
        return f'Car[name:{self.name}, initSpeed:{self.init_speed}, maxSpeed{self.max_speed}, ' \
               f'initRoadId:{self.init_road_id}, initLaneId:{self.init_lane_id}, min offset:{self.road_min_offset}, ' \
               f'max offset:{self.road_max_offset} , deviation:{self.road_deviation}]'


class Pedestrian:
    def __init__(self):
        self.name = 'pedestrian0'
        self.model = 'walker.pedestrian.0001'
        self.location = []

    def __repr__(self):
        return f'Pedestrian[name:{self.name}, model:{self.model}, location:{self.location}]'


class Scenario:
    """
    ADSML语言描述的场景对象
    """

    def __init__(self):
        self.cars = []
        self.objs = []
        self.mapType = ''
        self.map = ''
        self.time_step = 0
        self.weather = 'clear'
        self.guardLibrary = ''
        self.simulationTime = 0
        self.endTrigger = ''

    def __repr__(self):
        return f'Scenario[mapType:{self.mapType}, weather:{self.weather}, timeStep:{self.time_step}, ' \
               f'length of cars:{len(self.cars)}, length of objs:{len(self.objs)}]'


class Simulator:
    """
    仿真器类，对多种仿真器的抽象
    """

    def __init__(self, img_path, mp4_path, data_path=''):
        self.img_path = img_path
        self.mp4_path = mp4_path
        self.data_path = data_path

    def simulate(self, json_str=None, path=''):
        """
        进行模拟，返回模拟仿真结果
        :param json_str: JSON字符串，描述场景信息、车辆
        :param path: 场景信息文件路径，当scene为空时必须提供path
        :return:
        """
        if json_str is not None and isinstance(json_str, str):
            json_data = json.loads(json_str)
        elif path != '':
            # 读取 adsml 文件
            json_file = open(path, 'r', encoding='utf-8')
            json_data = json.load(json_file)
            json_file.close()
        else:
            raise RuntimeError('无法找到场景描述文件')
        scene = self.build_scene(json_data, path)
        simulation = self.createSimulation(scene)
        print('begin simulation')
        result = simulation.run()
        return result

    def createSimulation(self, scene):
        """
        根据场景创建模拟对象
        :param scene: 场景信息
        :return: Simulation
        """
        return Simulation(scene)

    def reset(self):
        """
        重置场景，清除所有Actor
        :return: None
        """
        pass

    def destroy(self):
        """
        销毁模拟器对象
        :return: None
        """
        pass

    def static_scene(self, json_str=None, path='', img_path='', count=1):
        """
        进行场景测试
        :param count:
        :param img_path:
        :param json_str: JSON字符串，描述场景信息、车辆
        :param path: 场景信息文件路径，当scene为空时必须提供path
        :return:
        """
        if img_path == '':
            raise RuntimeError('缺少参数img_path，规定静态场景图片存储路径')
        if json_str is not None and isinstance(json_str, str):
            json_data = json.loads(json_str)
        elif path != '':
            json_file = open(path, 'r', encoding='utf-8')
            json_data = json.load(json_file)
            json_file.close()
        else:
            raise RuntimeError('无法找到场景描述文件')
        scene = self.build_scene(json_data, path)
        test_result = self.test_scene(scene, img_path, count)
        return test_result

    def test_scene(self, scene, img_path, count=1):
        """
        :param scene:
        :param img_path:
        :return:
        """
        simulation = self.createSimulation(scene)
        test_result = TestResult()
        for i in range(count):
            simulation.test_scene(f'{img_path}/{i}.png')
            test_result.pic_count += 1
        return test_result

    def build_scene(self, json_data, path):
        """
        构建场景
        :param path:
        :param json_data: dict. 描述场景信息的字典
        :return: Scene. 场景对象
        """
        scene = Scenario()
        scene.mapType = json_data['mapType']
        if scene.mapType == 'custom':
            print(f'map type: custom; file path:{path}')
            scene.map = os.path.normpath(os.path.join(path, json_data['map'].replace('\\', '/')))
        else:
            scene.map = json_data['map']
        scene.time_step = json_data['timeStep']
        scene.weather = random.choice(json_data['weather'])
        scene.simulationTime = int(json_data['simulationTime'])
        if 'scenarioEndTrigger' in json_data.keys() and json_data['scenarioEndTrigger'] != "":
            scene.endTrigger = json_data['scenarioEndTrigger']
        else:
            scene.endTrigger = 'False'
        if 'guardLibrary' in json_data.keys():
            scene.guardLibrary = json_data['guardLibrary']
        json_cars = json_data['cars']
        cars = []
        for json_car in json_cars:
            car = Car()
            location_params = json_car['locationParams']
            car.name = json_car['name']
            car.heading = bool(json_car['heading'])
            if json_car['speedType'] == 'Manual':
                car.init_speed = float(json_car['speedParams']['initValue'])
            elif json_car['speedType'] == 'Uniform Distribution':
                car.init_speed = np.random.uniform(float(json_car['speedParams']['a']),
                                                   float(json_car['speedParams']['b']))
            elif json_car['speedType'] == 'Normal Distribution':
                car.init_speed = np.random.normal(float(json_car['speedParams']['mean']),
                                                  float(json_car['speedParams']['std']))
            elif json_car['speedType'] == 'Bernoulli Distribution':
                car.init_speed = np.random.binomial(1,
                                                    float(json_car['speedParams']['p']))
            elif json_car['speedType'] == 'Binomial Distribution':
                car.init_speed = np.random.binomial(int(json_car['speedParams']['n']),
                                                    float(json_car['speedParams']['p']))
            elif json_car['speedType'] == 'Poisson Distribution':
                car.init_speed = np.random.poisson(float(json_car['speedParams']['lambda']))
            elif json_car['speedType'] == 'Chi-Squared Distribution':
                car.init_speed = np.random.chisquare(float(json_car['speedParams']['k']))
            elif json_car['speedType'] == 'Customized Distribution':
                raise RuntimeError('current version does not support customized distribution')
            car.max_speed = float(json_car['maxSpeed'])
            if 'minSpeed' in json_car.keys():
                car.min_speed = float(json_car['minSpeed'])
            car.model = json_car['model']
            car.road_deviation = np.random.uniform(float(json_car['roadDeviation'][0]),
                                                   float(json_car['roadDeviation'][1]))
            car.behavior_tree_path = json_car['treePath']
            car.behavior_tree = BehaviorTree()
            car.behavior_tree.build_tree_from_json(json_dict=json_car['mTree'])
            car.location_type = json_car['locationType']
            if car.location_type == 'Lane Position':
                car.init_road_id = int(location_params['roadId'])
                car.init_lane_id = int(location_params['laneId'])
            elif car.location_type == 'Road Position':
                car.init_road_id = int(location_params['roadId'])
            elif car.location_type == 'Related Position':
                car.actor_ref = location_params['actorRef']
            else:
                car.x = np.random.uniform(float(location_params['x'][0]), float(location_params['x'][1]))
                car.y = np.random.uniform(float(location_params['y'][0]), float(location_params['y'][1]))
            if json_car['locationType'] != 'Global Position':
                car.min_lateral_offset = float(location_params['lateralOffset'][0])
                car.max_lateral_offset = float(location_params['lateralOffset'][1])
                car.road_min_offset = float(location_params['longitudinalOffset'][0])
                car.road_max_offset = float(location_params['longitudinalOffset'][1])
            cars.append(car)
            print(car)
        scene.cars = cars
        json_pedestrians = json_data['pedestrians']
        pedestrians = []
        if json_pedestrians is not None:
            for json_pedestrian in json_pedestrians:
                pedestrian = Pedestrian()
                pedestrian.name = json_pedestrian['name']
                pedestrian.model = json_pedestrian['model']
                pedestrian.location = []
                locations = json_pedestrian['location']
                for json_location in locations:
                    location = {}
                    location['location_type'] = json_location['locationType']
                    if location['location_type'] == 'Lane Position':
                        location['init_road_id'] = int(json_location['locationParams']['roadId'])
                        location['init_lane_id'] = int(json_location['locationParams']['laneId'])
                    elif location['location_type'] == 'Road Position':
                        location['init_road_id'] = int(json_location['locationParams']['roadId'])
                    elif location['location_type'] == 'Related Position':
                        location['actor_ref'] = json_location['locationParams']['actorRef']
                    else:
                        location['x'] = np.random.uniform(float(json_location['locationParams']['x'][0]), float(json_location['locationParams']['x'][1]))
                        location['y'] = np.random.uniform(float(json_location['locationParams']['y'][0]), float(json_location['locationParams']['y'][1]))
                    if json_location['locationType'] != 'Global Position':
                        location['min_lateral_offset'] = float(json_location['locationParams']['lateralOffset'][0])
                        location['max_lateral_offset'] = float(json_location['locationParams']['lateralOffset'][1])
                        location['road_min_offset'] = float(json_location['locationParams']['longitudinalOffset'][0])
                        location['road_max_offset'] = float(json_location['locationParams']['longitudinalOffset'][1])
                    location['speed_type'] = json_location['speedType']
                    if location['speed_type'] == 'Manual':
                        location['speed'] = float(json_location['speedParams']['speed'])
                    pedestrian.location.append(location)
                pedestrians.append(pedestrian)
        scene.objs.extend(pedestrians)
        print(scene)
        return scene


class Simulation:
    """
    仿真类，对应一次完整的仿真过程
    """

    def __init__(self, scene: Scenario):
        """
        构造器
        :param scene: 场景信息
        """
        self.scene = scene
        self.time_step = scene.time_step
        self.objects = []
        self.vehicles = []
        if self.time_step > 0:
            self.timestamp = 0
        else:
            self.timestamp = datetime.now()
        self.curr_states = None

    def do_settings(self):
        """

        :return:
        """
        pass

    def record_data(self):
        """
        记录仿真数据
        :return:
        """
        pass

    def tick_timestamp(self):
        """
        全局时钟计时
        :return:
        """
        self.timestamp += 1  # type: ignore

    def create_all_objs(self, is_test):
        """
        创建场景中的对象
        :param is_test:
        :return:
        """
        objs = self.scene.objs
        cars = self.scene.cars
        assert isinstance(cars, list)
        assert isinstance(objs, list)

        self.create_cars_in_simulation(cars, is_test)
        for obj in objs:
            if obj is None:
                continue
            self.create_obj_in_simulation(obj, is_test)

    def run(self):
        """
        开始模拟
        :return: 模拟结果
        """
        self.do_settings()
        timestamp_timer = MyTimer(datetime.now(), 1, self.tick_timestamp)
        try:
            self.create_all_objs(False)
            timestamp_timer.start()
            while True:
                self.current_state()
                args = self.build_guard_args()
                self.step(args)
                self.record_data()
                if self.check_end():
                    timestamp_timer.cancel()
                    break
        finally:
            timestamp_timer.cancel()
            self.destroy()

    def build_guard_args(self) -> dict:
        """
        构建进行车辆行为树迁移的条件所需变量
        :return: dict.
        """
        # args = {'guardLibrary': self.scene.guardLibrary}
        return {}

    def step(self, args):
        """
        计算并完成一次更新
        :param args: dict. 车辆进行行为状态变迁判断需要的变量
        :return:
        """
        pass

    def create_obj_in_simulation(self, obj, is_test):
        """
        由不同仿真器实现的子类实现本方法，用于创建仿真其中的除车辆之外的对象
        :param is_test:
        :param obj: 对象信息
        :return:
        """
        assert not isinstance(obj, Car)
        pass

    def create_cars_in_simulation(self, cars, is_test: bool = False):
        """
        由不同仿真器实现的子类实现本方法，用于创建仿真其中的车辆对象
        :param cars:
        :param is_test:
        :return: list[].
        """
        assert isinstance(cars, list)
        pass

    def destroy(self):
        """
        仿真结束后销毁对象
        :return:
        """
        pass

    def current_state(self):
        """
        返回当前仿真其中所有Actor的状态信息
        :return:
        """
        self.curr_states = None
        pass

    def schedule_for_vehicles(self):
        """
        返回对所有车辆的调用顺序
        :return: list.
        """
        ordered = []
        for k, v in self.vehicles.items():  # type: ignore
            ordered.append(v)
        return ordered

    def check_end(self):
        """
        检测是否仿真结束
        :return:
        """
        pass

    def test_scene(self, img_path) -> TestResult:
        """
        开始仿真之前展示场景
        :param img_path:
        :return:
        """
        return TestResult()
