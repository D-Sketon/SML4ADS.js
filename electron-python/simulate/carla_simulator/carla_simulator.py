"""
@Project : AutonomousDrivingSimulation
@File : carla_simulator.py
@Author : zheng_chenghang
@Date : 2022/2/22 14:29
"""
import csv
import json
import math
import os
import queue
import random
import sys
import traceback
from datetime import datetime

import carla
import cv2

try:
    curr_dir = os.getcwd()
    parent_dir = curr_dir[:curr_dir.rfind(os.path.sep)]
    sys.path.append(parent_dir)
except IndexError:
    print('append path error!')

from simulate.carla_simulator.CarInfo import CarInfo
from simulate.carla_simulator.controller.action import Action
from simulate.carla_simulator.controller.agent import Agent
from simulate.carla_simulator.controller.walker_agent import WalkerAgent
from simulate.carla_simulator.ObjInfo import ObjInfo
from simulate.interface.GuardFunction import set_guard_args
from simulate.interface.simulator import (Pedestrian, Simulation,
                                          SimulationResult, Simulator,
                                          TestResult)
from simulate.parsers.map_filter import MapFilter
from simulate.parsers.map_parser import MapParser

dt = 0.1
max_throt = 0.75
max_brake = 0.3
max_steer = 0.8
args_lateral_dict = {'k_p': 0.8, 'k_i': 0.05, 'k_d': 0.1, 'dt': dt}
args_longitudinal_dict = {'k_p': 1.0, 'k_i': 0.15, 'k_d': 0.3, 'dt': dt}


class CarlaSimulator(Simulator):
    """
    针对Carla仿真器对Simulator的实现
    """

    def __init__(self, img_path, mp4_path, address='127.0.0.1', port=2000, render=True, record='', data_path=''):
        super().__init__(img_path, mp4_path, data_path)
        self.client = carla.Client(address, port)  # type: ignore
        self.client.set_timeout(5)
        self.render = render  # 是否渲染仿真
        self.record = record  # 是否运行recorder
        self.scenario_number = 0  # 正在进行仿真的场景数量

    def destroy(self):
        """
        仿真完成后的销毁
        """
        super().destroy()

    def createSimulation(self, scene):
        """
        创建Simulation对象
        :param scene: 场景对象
        :return: Simulation
        """
        return CarlaSimulation(scene, self.client, self.render, self.scenario_number, self.img_path, self.mp4_path,
                               recorder=self.record, data_path=self.data_path)


class CarlaSimulation(Simulation):
    """
    针对Carla仿真器实现的Simulation
    """

    def __init__(self, scene, client, render, scenario_number, img_path, mp4_path,
                 recorder='C:/tmp/record.log', data_path="C:/tmp/data.csv"):
        super().__init__(scene)
        self.client = client
        self.render = render
        self.recorder = recorder
        self.scenario_number = scenario_number
        self.img_path = img_path
        self.mp4_path = mp4_path
        if scene.map != 'Town05' and scene.mapType == 'default':
            self.world = self.client.load_world(scene.map)
        elif scene.mapType == 'custom':
            if scene.map.endswith('.xodr'):
                print(f'parsing xodr file:{scene.map}')
                with open(scene.map) as odr_file:
                    self.world = self.client.generate_opendrive_world(odr_file.read())
                print('parsing finished')
            else:
                raise RuntimeError('CARLA only supports OpenDrive maps')
        self.world = self.client.get_world()
        # set weather
        self.world.set_weather(getattr(carla.WeatherParameters, scene.weather))  # type: ignore
        self.map = self.world.get_map()
        self.bpl = self.world.get_blueprint_library()
        self.agents: dict[str, Agent] = {}
        self.obj_agents: dict[str, WalkerAgent] = {}
        self.car_span_tfs = {}  # for pedestrian relative ref
        self.parser = None
        self.camera = None
        self.pic_count = 0
        self.parse_map()
        self.data_path = data_path
        self.action = Action(self.map, self.parser, 3)
        self.models: list[str] = []
        self.pedestrians: list[str] = []
        self.spec_tf = None
        self.read_config()

        if self.data_path != "":
            self.data_file = open(self.data_path, 'w', encoding='utf-8')
            self.data_writer = csv.writer(self.data_file)
            self.data_writer.writerow(
                ('name', 'x', 'y', 'velocity', 'acceleration', 'forward', 'bounding box', 'semantic tags'))
        else:
            self.data_file = None

        self.info = {'acc': [], 'vel': []}

    def step(self, args):
        """
        针对Carla仿真器实现的仿真方法，每一次计算整个仿真场景
        :return:
        """
        args = dict(self.curr_states, **args)
        print(f'args:{args}')
        for name, agent in self.agents.items():
            if not agent.is_end:
                print(f'agent {name}:')
                agent.run(args)
                agent.tick(self.time_step)
            else:
                self.client.apply_batch([carla.command.DestroyActor(agent.vehicle)])  # type: ignore
        for name, agent in self.obj_agents.items():
            if not agent.is_end:
                agent.run()
                agent.tick(self.time_step)
            else:
                self.client.apply_batch([carla.command.DestroyActor(agent.walker)])  # type: ignore

    def do_settings(self):
        """

        :return:
        """
        settings = self.world.get_settings()
        settings.no_rendering_mode = True if not self.render else False
        if self.time_step > 0:
            settings.synchronous_mode = True
            settings.fixed_delta_seconds = self.time_step
        else:
            pass
        self.world.apply_settings(settings)

    def wait(self):
        """
        等待车辆初始化完成
        :return:
        """
        for vehicle in self.vehicles:
            tf = vehicle.get_transform()
            if tf.x == 0.0 and tf.y == 0.0 and tf.z == 0.0:
                return True
            else:
                continue
        return False

    def run(self):
        """
        开始模拟
        :return: 模拟结果
        """
        self.do_settings()
        result = SimulationResult()
        result.start_time = datetime.now()
        try:
            print('create objs')
            self.create_all_objs(False)
            print('create objs finished')
            self.set_spectator()
            sensor_queue = queue.Queue()
            if self.time_step > 0:
                sensor_queue = self.generate_synchronous_camera(self.img_path)
            if self.recorder != '':
                self.client.start_recorder(self.recorder)
            spectator = self.world.get_spectator()
            spectator.set_transform(self.spec_tf)
            start_time = datetime.now()
            while True:
                if datetime.now().timestamp() - start_time.timestamp() < 3.0:
                    continue
                ego_tf = self.vehicles[0].get_transform()
                ego_loc = ego_tf.location
                if ego_loc.x == 0.0 and ego_loc.y == 0.0:
                    ego_tf = self.vehicles[0].get_transform()
                forward_vector = ego_tf.get_forward_vector()
                spec_loc = ego_tf.location + carla.Location(0, 0, 5)  # type: ignore
                spec_loc += forward_vector * (-8)
                spec_rot = ego_tf.rotation
                # spec_loc = ego_tf.location + carla.Location(0, 0, 20)
                # spec_rot = ego_tf.rotation
                # spec_rot.pitch = -90
                spectator.set_transform(carla.Transform(spec_loc, spec_rot))  # type: ignore

                self.current_state()
                if self.check_end():
                    result.end_time = datetime.now()
                    break
                if self.data_file is not None:
                    self.record_data()
                args = self.build_guard_args()
                self.step(args)
                if self.time_step > 0:
                    self.world.tick()
                    self.timestamp += self.time_step  # type: ignore
                    sensor_queue.get()
            result.duration = self.timestamp  # type: ignore
            result.info = self.info
            return result
        except Exception as err:
            print(err.args)
            print(traceback.format_exc())
        finally:
            settings = self.world.get_settings()
            settings.synchronous_mode = False
            settings.fixed_delta_seconds = None
            self.world.apply_settings(settings)
            self.client.stop_recorder()
            self.destroy()
            self.generate_mp4()

    def create_cars_in_simulation(self, cars, is_test=False):
        """
        针对Carla仿真器实现的创建车辆的函数
        :param cars: list. 车辆对象，包含初始化车辆的信息
        :param is_test:
        :return: list[].
        """
        self.agents = {}
        spawn_tfs: dict = self.get_cars_spawn_transforms(cars)
        self.car_span_tfs = spawn_tfs
        for index, car in enumerate(cars):
            print(f'car {index}:')
            if car.model != 'random':
                bp = self.bpl.find(car.model)
            else:
                bp = self.bpl.find(random.choice(self.models))
            print(f'blueprint: {bp.id}')
            bp.set_attribute('role_name', car.name)
            spawn_tf = spawn_tfs[car.name]
            if spawn_tf is None:
                raise RuntimeError(f'Cannot generate car {car.name}')
            print(f'road deviation:{car.road_deviation}')
            spawn_tf.rotation.yaw += car.road_deviation
            tf = spawn_tf
            vehicle = self.world.spawn_actor(bp, tf)
            if index == 0:
                self.spec_tf = tf
                self.spec_tf.location += self.spec_tf.get_forward_vector() * (-8)
                self.spec_tf.location.z += 5
            self.vehicles.append(vehicle)
            model = 'asy' if self.time_step == 0 else 'sy'
            agent = Agent(self.map, self.parser, vehicle, car.behavior_tree, self.action, max_speed=car.max_speed,
                          min_speed=car.min_speed, args_lateral=args_lateral_dict,
                          args_longitudinal=args_longitudinal_dict, model=model)
            if car.init_speed > 0 and not is_test:
                vec = vehicle.get_transform().get_forward_vector()
                vec.z = 0.0
                vel = car.init_speed * vec
                print(f'init speed: {car.init_speed}; vel vec: {vel}')
                vehicle.enable_constant_velocity(vel)
                agent.is_constant = True
            self.agents[car.name] = agent
            print(f'generate car {index} finished')
        return self.vehicles

    # def check_conflict(self, current_tf):
    #     """
    #     检测多辆车辆生成点是否冲突
    #     :return: bool
    #     """
    #     for tf in self.used_spawn_points:
    #         if tf.x == current_tf.x and tf.y == current_tf.y and tf.z == current_tf.z:
    #             return True
    #     return False

    def get_vehicle_spawn_point(self, allow_junction=False, length=1):
        """
        取得一个生成车辆的点
        :param allow_junction: 该生成点是否允许在junction
        :param length: 获取的生成点的个数
        :return: [carla.Waypoint]
        """
        spawn_tfs = list(self.map.get_spawn_points())
        wps = []
        if len(spawn_tfs) == 0:
            return wps
        if allow_junction:
            spawn_tfs = random.choices(spawn_tfs, k=length)
            for spawn_tf in spawn_tfs:
                wps.append(self.map.get_waypoint(spawn_tf.location))
        else:
            # return self.map.get_waypoint(spawn_tfs[138].location)
            spawn_wps = []
            for index, spawn_tf in enumerate(spawn_tfs):
                temp_wp = self.map.get_waypoint(spawn_tf.location)
                if not temp_wp.is_junction:
                    spawn_wps.append((index, temp_wp))
            choices = random.choices(spawn_wps, k=length)
            for choice in choices:
                wps.append(choice[1])
                print(choice[0])
        return wps

    def current_state(self):
        """
        获取当前所有车辆的状态，用于迁移条件、判断结束
        :return: dict{name: CarInfo}
        """
        states = {}
        for name, agent in self.agents.items():
            vehicle = agent.vehicle
            if not agent.is_end:
                info = CarInfo()
                pos = vehicle.get_transform().location
                wp = self.map.get_waypoint(pos)
                acc = vehicle.get_acceleration()
                vel = vehicle.get_velocity()
                info.laneId = wp.lane_id
                info.roadId = wp.road_id
                info.acceleration = math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
                info.intersection = wp.is_junction
                info.junctionId = wp.get_junction().id if wp.get_junction() is not None else -1
                info.laneSectionId = wp.section_id
                info.speed = math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2)
                info.t = agent.clock
                info.model = vehicle.type_id
                info.road_s = wp.s
                info.lane_s = wp.s
                info.waypoint = wp
                info.vehicle = vehicle
                info.name = name
                # TODO: info.offset
                states[name] = info
                print(f'{name} state:{info}')
                if name == 'Ego':
                    self.info['acc'].append(info.acceleration)
                    self.info['vel'].append(info.speed)
        for name, walk_agent in self.obj_agents.items():
            walker = walk_agent.walker
            if not walk_agent.is_end:
                info = ObjInfo()
                pos = walker.get_transform().location
                wp = self.map.get_waypoint(pos)
                acc = walker.get_acceleration()
                vel = walker.get_velocity()
                info.laneId = wp.lane_id
                info.roadId = wp.road_id
                info.acceleration = math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
                info.intersection = wp.is_junction
                info.junctionId = wp.get_junction().id if wp.get_junction() is not None else -1
                info.laneSectionId = wp.section_id
                info.speed = math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2)
                info.t = walk_agent.clock
                info.road_s = wp.s
                info.lane_s = wp.s
                info.waypoint = wp
                info.name = name
                # TODO: info.offset
                states[name] = info
                print(f'{name} state:{info}')
        self.curr_states = states

    def record_data(self):
        """
        :return:
        """
        for name, state in self.curr_states.items():
            loc = state.waypoint.transform.location
            forward_vec = state.vehicle.get_transform().get_forward_vector()
            bounding_box = state.vehicle.bounding_box
            semantic_tags = state.vehicle.semantic_tags
            self.data_writer.writerow((name, loc.x, loc.y, state.speed, state.acceleration, forward_vec,
                                       bounding_box, semantic_tags))

    def check_end(self):
        """
        检查本次仿真是否结束
        :return:
        """
        print(f'check end, simulation duration:{self.timestamp}, simulation time:{self.scene.simulationTime}')
        if self.timestamp >= self.scene.simulationTime or (self.time_step == 0 and datetime.now().timestamp() - self.timestamp.timestamp() >= self.scene.simulationTime):  # type: ignore
            return True
        args = dict(self.curr_states, **self.build_guard_args())
        set_guard_args(args)
        if args['guardLibrary'] != '':
            def_path = args['guardLibrary']
            index = def_path.rfind("/")
            print(index)
            path = def_path[:index]
            module = def_path[index + 1:def_path.find('.', index)]
            print(f'path = {path}')
            print(f'module = {module}')
            try:
                sys.path.append(path)
            except IndexError:
                print('can not add module path.')
            exec(f'import {module}')
        for k, v in self.curr_states.items():
            exec(f'{k} = v')
        end_flag = False
        exec(f'end_flag = {self.scene.endTrigger}')
        if end_flag:
            return True
        for name, agent in self.agents.items():
            if not agent.is_end:
                return False
        return True

    def destroy(self):
        """
        销毁
        :return:
        """
        # if os.path.exists():
        #     os.remove()
        if self.data_file is not None:
            self.data_file.close()
        self.client.apply_batch([carla.command.DestroyActor(x) for x in self.vehicles])  # type: ignore
        self.client.apply_batch([carla.command.DestroyActor(self.camera)])  # type: ignore
        self.vehicles.clear()
        self.pedestrians.clear()
        self.agents = {}
        self.obj_agents = {}
        self.car_span_tfs = {}

    def tick_timestamp(self):
        """
        全局时钟计时
        :return:
        """
        self.timestamp += self.time_step  # type: ignore

    def build_guard_args(self) -> dict:
        """

        :return:
        """
        args = {'guardLibrary': self.scene.guardLibrary, 'map': self.map, 'clock': self.timestamp}
        return args

    def test_scene(self, img_path):
        """
        :param img_path:
        :return:
        """
        try:
            print('begin generating objs.')
            self.create_all_objs(is_test=True)
            print('finish generating objs.')
            pos = self.vehicles[0].get_transform().location
            while pos.x == 0.0 and pos.y == 0.0:
                pos = self.vehicles[0].get_transform().location
            self.set_spectator()
            qu = self.generate_synchronous_camera(img_path)
            while True:
                if not qu.empty():
                    qu.get()
                if self.pic_count >= 2:
                    break
            self.pic_count = 0
            return TestResult()
        except Exception as err:
            print(err.args)
            print(traceback.format_exc())
        finally:
            self.destroy()

    def parse_map(self):
        """
        对正在使用的地图进行解析
        :return:
        """
        path = f'./{self.map.name}.xodr'
        if os.path.exists(path):
            os.remove(path)
        self.map.save_to_disk(path)
        self.parser = MapParser()
        self.parser.parse(path)

    def set_spectator(self, vehicle_tf=None):
        """
        设置观察者，方便观察仿真
        :param vehicle_tf:
        :return:
        """
        spectator = self.world.get_spectator()
        if vehicle_tf is not None:
            spectator.set_transform(vehicle_tf)
        else:
            spectator.set_transform(self.vehicles[0].get_transform())
        print(f'set spectator: {spectator.type_id}')

    def generate_synchronous_camera(self, store_path):
        """
        创建同步需要用到的传感器和队列
        """
        ls = os.listdir(store_path)
        for i in ls:
            c_path = os.path.join(store_path, i)
            os.remove(c_path)
        blueprint = self.bpl.find('sensor.camera.rgb')
        blueprint.set_attribute('image_size_x', '1000')
        blueprint.set_attribute('image_size_y', '1000')
        blueprint.set_attribute('fov', '60')
        ego_tf = self.vehicles[0].get_transform()
        spec_loc = carla.Location(-12, 0, 5)  # type: ignore
        spec_rot = ego_tf.rotation
        sensor = self.world.spawn_actor(blueprint, carla.Transform(spec_loc, spec_rot), self.vehicles[0],  # type: ignore
                                        carla.AttachmentType.Rigid)  # type: ignore
        sensor_queue = queue.Queue()

        def sensor_callback(data, q):
            """

            :param data:
            :param q:
            """
            #             if store_path.endswith('.png'):
            #                 data.save_to_disk(store_path)
            #             else:
            #                 data.save_to_disk(os.path.join(store_path, '%d.png' % self.pic_count))
            #             self.pic_count += 1
            q.put(data.frame)

        sensor.listen(lambda data: sensor_callback(data, sensor_queue))
        self.camera = sensor
        return sensor_queue

    def generate_mp4(self):
        """
        :return:
        """
        print(f'generating mp4, path:{self.mp4_path}, pic_count:{self.pic_count}, img_path:{self.img_path}')
        size = (1000, 1000)
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # type: ignore
        videowrite = cv2.VideoWriter(self.mp4_path, fourcc, 8, size)
        img_array = []
        for i in range(self.pic_count - 1):
            filename = self.img_path + f'/{i}.png'
            img = cv2.imread(filename)
            if img is None:
                print(filename + " is error!")
                continue
            img_array.append(img)
        print(f'pic file number:{len(img_array)}')
        for img in img_array:
            videowrite.write(img)
        print('generate mp4 succeed.')

    def read_config(self):
        """
        :return:
        """
        print('read config')
        with open(os.path.abspath('./simulate/carla_simulator/config.json'), 'r', encoding='utf-8') as file:
            json_file = json.load(file)
            self.models = json_file['models']
            self.pedestrians = json_file['pedestrians']
        print('read config finished')

    def get_cars_spawn_transforms(self, cars: list) -> dict:
        """
        :param cars:
        :return:
        """
        print('choosing spawn waypoints of cars.')
        spawn_wps = self.get_vehicle_spawn_point(length=len(cars))
        chosen_tfs = {}
        relate_qu = []
        for car in cars:
            print(f'car name: {car.name}, loc type: {car.location_type}')
            if car.location_type == 'Lane Position':
                if car.init_lane_id == 0 and len(spawn_wps) != 0:
                    random_wp = random.choice(spawn_wps)
                    chosen_tfs[car.name] = random_wp.transform
                    spawn_wps.remove(random_wp)
                else:
                    offset = MapFilter.choice_lane_random(car.road_min_offset, car.road_max_offset)
                    spawn_wp = self.map.get_waypoint_xodr(car.init_road_id, car.init_lane_id, offset)
                    if spawn_wp is None or spawn_wp.lane_type != carla.LaneType.Driving:  # type: ignore
                        raise RuntimeError('cannot get spawn point from given road and lane ids.')
                    else:
                        tf: carla.Transform = spawn_wp.transform  # type: ignore
                        lateral_offset = MapFilter.choice_lane_random(car.min_lateral_offset, car.max_lateral_offset)
                        right_vector = tf.get_right_vector()
                        tf.location += right_vector * lateral_offset
                        tf.location += carla.Location(0, 0, 2)  # type: ignore
                        chosen_tfs[car.name] = tf
                        print(f'long offset:{offset}, lateral offset:{lateral_offset}')
                print(f'chosen transform: {chosen_tfs[car.name]}')
            elif car.location_type == 'Global Position':
                spawn_wp = self.map.get_waypoint(carla.Location(car.x, car.y, 0))  # type: ignore
                if spawn_wp is None:
                    raise RuntimeError('cannot get spawn point from given x and y values.')
                else:
                    spawn_wp.transform.location += carla.Location(0, 0, 2)  # type: ignore
                    chosen_tfs[car.name] = spawn_wp.transform
                print(f'chosen transform: {chosen_tfs[car.name]}')
            elif car.location_type == 'Road Position':
                offset = MapFilter.choice_lane_random(car.road_min_offset, car.road_max_offset)
                lateral_offset = MapFilter.choice_lane_random(car.min_lateral_offset, car.max_lateral_offset)
                abs_offset = abs(lateral_offset)
                if lateral_offset >= 0:
                    lane_id = -1
                else:
                    lane_id = 1
                wp = self.map.get_waypoint_xodr(car.init_road_id, lane_id, offset)
                while abs_offset > wp.lane_width:
                    abs_offset -= wp.lane_width
                    if lateral_offset >= 0:
                        lane_id -= 1
                    else:
                        lane_id += 1
                    wp = self.map.get_waypoint_xodr(car.init_road_id, lane_id, offset)
                tf = wp.transform
                tf.location += tf.get_right_vector() * (abs_offset - (wp.lane_width / 2))
                tf.location += carla.Location(0, 0, 2)  # type: ignore
                chosen_tfs[car.name] = tf
                print(f'offset:{offset}; lat_offset:{lateral_offset}; lane_id:{wp.lane_id}')
                print(f'chosen transform: {chosen_tfs[car.name]}')
            else:
                relate_qu.append(car)
        for car in relate_qu:
            print(f'relate location of car {car.name}:')
            print(f'ref car:{car.actor_ref}')
            ref_tf: carla.Transform = chosen_tfs[car.actor_ref]  # type: ignore
            ref_loc = ref_tf.location
            longitudinal_offset = MapFilter.choice_lane_random(car.road_min_offset, car.road_max_offset)
            forward_vector = ref_tf.get_forward_vector()
            lateral_offset = MapFilter.choice_lane_random(car.min_lateral_offset, car.max_lateral_offset)
            right_vector = ref_tf.get_right_vector()
            longitudinal_vec = longitudinal_offset * forward_vector
            lateral_vec = lateral_offset * right_vector
            spawn_loc = ref_loc + longitudinal_vec + lateral_vec
            spawn_wp = self.map.get_waypoint(spawn_loc, project_to_road=False)
            spawn_tf = spawn_wp.transform
            spawn_tf.location += carla.Location(0, 0, 2)  # type: ignore
            chosen_tfs[car.name] = carla.Transform(spawn_loc, ref_tf.rotation)  # type: ignore
            print(f'long offset:{longitudinal_offset}, lateral offset:{lateral_offset}, lane:{spawn_wp.lane_id}')
            print(f'longitudinal vec:{longitudinal_vec}, lateral vec:{lateral_vec}, spawn_loc:{spawn_loc}')
            print(f'chosen transform: {chosen_tfs[car.name]}')
        return chosen_tfs

    def create_obj_in_simulation(self, obj, is_Test=False):
        if not isinstance(obj, Pedestrian):
            pass
        spawn_tfs: list = self.get_pedestrian_spawn_transforms(obj)
        if obj.model != 'random':
            bp = self.bpl.find(obj.model)
        else:
            bp = self.bpl.find(random.choice(self.pedestrians))
        print(f'blueprint: {bp.id}')
        bp.set_attribute('role_name', obj.name)
        if bp.has_attribute('is_invincible'):
            bp.set_attribute('is_invincible', 'false')
        for spawn_tf in spawn_tfs:
            if spawn_tf is None:
                raise RuntimeError(f'Cannot spawn obj {obj.name}')
        walker = self.world.spawn_actor(bp, spawn_tfs[0])
        assert walker is not None
        walker_agent = WalkerAgent(self.client, self.world, bp, walker, spawn_tfs, obj.location)
        self.obj_agents[obj.name] = walker_agent

    def get_pedestrian_spawn_transforms(self, obj) -> list:
        print('choosing spawn waypoints of obj.')
        spawn_wps = self.get_vehicle_spawn_point(length=len(obj.location))
        chosen_tfs = [None] * len(obj.location)
        relate_qu = []
        for index, loc in enumerate(obj.location):
            print(f'obj name: {obj.name}, loc type: {loc["location_type"]}')
            if loc['location_type'] == 'Lane Position':
                if loc['init_lane_id'] == 0 and len(spawn_wps) != 0:
                    random_wp = random.choice(spawn_wps)
                    chosen_tfs[index] = random_wp.transform
                    spawn_wps.remove(random_wp)
                else:
                    offset = MapFilter.choice_lane_random(loc['road_min_offset'], loc['road_max_offset'])
                    spawn_wp = self.map.get_waypoint_xodr(loc['init_road_id'], loc['init_lane_id'], offset)
                    if spawn_wp is None:  # type: ignore
                        raise RuntimeError('cannot get spawn point from given road and lane ids.')
                    else:
                        tf: carla.Transform = spawn_wp.transform  # type: ignore
                        lateral_offset = MapFilter.choice_lane_random(loc['min_lateral_offset'], loc['max_lateral_offset'])
                        right_vector = tf.get_right_vector()
                        tf.location += right_vector * lateral_offset
                        tf.location += carla.Location(0, 0, 2)  # type: ignore
                        chosen_tfs[index] = tf
                        print(f'long offset:{offset}, lateral offset:{lateral_offset}')
                print(f'chosen transform: {chosen_tfs[index]}')
            elif loc['location_type'] == 'Global Position':
                spawn_wp = self.map.get_waypoint(carla.Location(loc['x'], loc['y'], 0))  # type: ignore
                if spawn_wp is None:
                    raise RuntimeError('cannot get spawn point from given x and y values.')
                else:
                    spawn_wp.transform.location += carla.Location(0, 0, 2)  # type: ignore
                    chosen_tfs[index] = spawn_wp.transform
                print(f'chosen transform: {chosen_tfs[index]}')
            elif loc['location_type'] == 'Road Position':
                offset = MapFilter.choice_lane_random(loc['road_min_offset'], loc['road_max_offset'])
                lateral_offset = MapFilter.choice_lane_random(loc['min_lateral_offset'], loc['max_lateral_offset'])
                abs_offset = abs(lateral_offset)
                if lateral_offset >= 0:
                    lane_id = -1
                else:
                    lane_id = 1
                wp = self.map.get_waypoint_xodr(loc['init_road_id'], lane_id, offset)
                while abs_offset > wp.lane_width:
                    abs_offset -= wp.lane_width
                    if lateral_offset >= 0:
                        lane_id -= 1
                    else:
                        lane_id += 1
                    wp = self.map.get_waypoint_xodr(loc['init_road_id'], lane_id, offset)
                tf = wp.transform
                tf.location += tf.get_right_vector() * (abs_offset - (wp.lane_width / 2))
                tf.location += carla.Location(0, 0, 2)  # type: ignore
                chosen_tfs[index] = tf
                print(f'offset:{offset}; lat_offset:{lateral_offset}; lane_id:{wp.lane_id}')
                print(f'chosen transform: {chosen_tfs[index]}')
            else:
                relate_qu.append(index)
        for index in relate_qu:
            print(f'relate location of obj {obj.name}:')
            print(f'ref car:{obj.location[index]["actor_ref"]}')
            ref_tf: carla.Transform = self.car_span_tfs[obj.location[index]['actor_ref']]  # type: ignore
            ref_loc = ref_tf.location
            longitudinal_offset = MapFilter.choice_lane_random(obj.location[index]['road_min_offset'], obj.location[index]['road_max_offset'])
            forward_vector = ref_tf.get_forward_vector()
            lateral_offset = MapFilter.choice_lane_random(obj.location[index]['min_lateral_offset'], obj.location[index]['max_lateral_offset'])
            right_vector = ref_tf.get_right_vector()
            longitudinal_vec = longitudinal_offset * forward_vector
            lateral_vec = lateral_offset * right_vector
            spawn_loc = ref_loc + longitudinal_vec + lateral_vec
            spawn_wp = self.map.get_waypoint(spawn_loc, project_to_road=False)
            spawn_tf = spawn_wp.transform
            spawn_tf.location += carla.Location(0, 0, 2)  # type: ignore
            chosen_tfs[index] = carla.Transform(spawn_loc, ref_tf.rotation)  # type: ignore
            print(f'long offset:{longitudinal_offset}, lateral offset:{lateral_offset}, lane:{spawn_wp.lane_id}')
            print(f'longitudinal vec:{longitudinal_vec}, lateral vec:{lateral_vec}, spawn_loc:{spawn_loc}')
            print(f'chosen transform: {chosen_tfs[index]}')
        return chosen_tfs
