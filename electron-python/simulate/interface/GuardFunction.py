"""
@Project : AutonomousDrivingSimulation
@File : GuardFunction.py
@Author : zheng_chenghang
@Date : 2022/5/2 12:47
@Maintainer : Jack Qiu
"""
import math
import os
import sys

import carla

try:
    curr_dir = os.getcwd()
    parent_dir = curr_dir[:curr_dir.rfind(os.path.sep)]
    sys.path.append(parent_dir)
except IndexError:
    print('append path error!')

from simulate.carla_simulator.CarInfo import CarInfo
from simulate.carla_simulator.ObjInfo import ObjInfo

guard_args = {}
GUARD_FUNCTIONS = ['hasObjWithinDisInLane', 'hasObjWithinDisInLeftLane', 'hasObjWithinDisInRightLane',
                   'withinDisToObjsInLane', 'withinDisToObjsInRoad', 'isInSameLane']


def isFrontOf(actor, car2):
    """
    检查 actor 是否在 car2 的前面。
    :param actor: 物体标识
    :param car2: 车辆 2 名称标识
    :return: bool
    """
    actor_tf = actor.waypoint.transform
    car_tf = car2.waypoint.transform
    car_orientation = car_tf.rotation.yaw  # degrees
    car_orientation = (car_orientation + 360) % 360
    relative_loc_y = actor_tf.location.y - car_tf.location.y
    relative_loc_x = actor_tf.location.x - car_tf.location.x
    relative_radians = math.atan2(relative_loc_y, relative_loc_x)
    relative_degrees = math.degrees(relative_radians)
    relative_degrees = (relative_degrees + 360) % 360
    return car_orientation - 90 <= relative_degrees <= car_orientation + 90


def hasObjWithinDisInLane(car: CarInfo, dis):
    """
    检查：
    1. 是否有物体与给定车辆在同一车道或在其后继车道；
    2. 物体是否在当前车辆前方；
    3. 检查物体是否在 distance 距离范围内。
    :param car: 车辆名称标识
    :param dis: 距离数值
    :return: bool
    """
    dis = float(dis)
    car_loc: carla.Location = car.waypoint.transform.location  # type: ignore
    for k, v in guard_args.items():
        if isinstance(v, CarInfo) and v.name != car.name:
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if v.laneId == car.laneId and v.roadId == car.roadId:
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
        elif isinstance(v, ObjInfo):
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if v.laneId == car.laneId and v.roadId == car.roadId:
                    print(f'dis {car_loc.distance(v_loc)}; car_loc:{car_loc}; v_loc:{v_loc}')
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
    return False


def hasObjWithinDisInLeftLane(car: CarInfo, dis):
    """
    检查：
    1. 是否有物体在给定车辆的左边车道或左边车道的后继
    车道；
    2. 物体是否在当前车辆前方；
    3. 物体是否在 distance 距离范围内。
    :param car: 车辆名称标识
    :param dis: 距离数值
    :return: bool
    """
    dis = float(dis)
    if not guard_args['hasLeftLane']:
        return False
    car_loc: carla.Location = car.waypoint.transform.location  # type: ignore
    for k, v in guard_args.items():
        if isinstance(v, CarInfo) and v.name != car.name:
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if abs(v.laneId) < abs(car.laneId) and v.roadId == car.roadId:
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.get_left_lane().next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
        elif isinstance(v, ObjInfo):
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if abs(v.laneId) < abs(car.laneId) and v.roadId == car.roadId:
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.get_left_lane().next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
    return False


def hasObjWithinDisInRightLane(car, dis):
    """
    检查：
    1. 是否有物体在给定车辆的右边车道或右边车道的后继
    车道；
    2. 物体是否在当前车辆前方；
    3. 物体是否在 distance 距离范围内。
    :param car: 车辆名称标识
    :param dis: 距离数值
    :return: bool
    """
    dis = float(dis)
    if not guard_args['hasRightLane']:
        return False
    car_loc: carla.Location = car.waypoint.transform.location  # type: ignore
    for k, v in guard_args.items():
        if isinstance(v, CarInfo) and v.name != car.name:
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if abs(v.laneId) > abs(car.laneId) and v.roadId == car.roadId:
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.get_right_lane().next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
        elif isinstance(v, ObjInfo):
            v_loc = v.waypoint.transform.location  # type: ignore
            if car_loc.distance(v_loc) <= dis and isFrontOf(v, car):
                if abs(v.laneId) > abs(car.laneId) and v.roadId == car.roadId:
                    return True
                else:
                    i = 1
                    wp: carla.Waypoint = car.waypoint.get_right_lane().next(1)[0]  # type: ignore
                    while i <= dis + 1:
                        if wp.road_id == v.roadId and wp.lane_id == v.laneId:
                            return True
                        wp: carla.Waypoint = wp.next(1)[0]  # type: ignore
                        i += 1
    return False


def withinDisToObjsInLane(curr_car: CarInfo, other_car: CarInfo, dis):
    """
    检查：
    1.car2 是否与 car1 在同一车道或在 car1 的后继车道上；
    2.car2 是否在 car1 的前方；
    3.car2 是否在 distance 距离范围内。
    :param curr_car: 车辆 1 名称标识
    :param other_car: 车辆 2 名称标识
    :param dis: 距离数值
    :return: bool
    """
    dis = float(dis)
    curr_loc: carla.Location = curr_car.waypoint.transform.location  # type: ignore
    other_loc: carla.Location = other_car.waypoint.transform.location  # type: ignore
    if curr_loc.distance(other_loc) <= dis and isFrontOf(other_car, curr_car):
        if curr_car.roadId == other_car.roadId and curr_car.laneId == other_car.laneId:
            return True
        else:
            i = 1
            wp = curr_car.waypoint.next(1)[0]  # type: ignore
            while i <= dis + 1:
                if wp.road_id == other_car.roadId and wp.lane_id == other_car.laneId:
                    return True
                i += 1
                wp = wp.next(1)[0]
    return False


def withinDisToObjsInRoad(curr_car, other_car, dis):
    """
    检查：
    1.car2 是否在 car1 的前方；
    2.car2 是否在 distance 距离范围内。
    :param curr_car: 车辆 1 名称标识
    :param other_car: 车辆 2 名称标识
    :param dis: 距离数值
    :return: bool
    """
    dis = float(dis)
    curr_loc: carla.Location = curr_car.waypoint.transform.location  # type: ignore
    other_loc: carla.Location = other_car.waypoint.transform.location  # type: ignore
    if curr_loc.distance(other_loc) <= dis and isFrontOf(other_car, curr_car):
        if curr_car.roadId == other_car.roadId:
            return True
        else:
            i = 1
            wp = curr_car.waypoint.next(1)[0]
            while i <= dis + 1:
                if wp.road_id == other_car.roadId:
                    return True
                i += 1
                wp = wp.next(1)[0]
    return False


def isInSameLane(car1, car2):
    """
    检查 car1 与 car2 是否在同一条车道上。
    :param car1: 车辆 1 名称标识
    :param car2: 车辆 2 名称标识
    :return: bool
    """
    if car1.roadId == car2.roadId and car1.laneId == car2.laneId:
        return True
    return False


def set_guard_args(args: dict):
    """

    :param args:
    """
    global guard_args
    guard_args = args
