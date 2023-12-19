import json
import random

import numpy as np
from lxml import etree
from visualization.network import Network
from visualization.parser.parser import parse_opendrive


def complex_object_encoder(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return json.JSONEncoder.default(obj)  # type: ignore


def generate_car(json_car, find_lanelet, longitudinal_offset, lateral_offset):
    car = {'width': 1.5, 'length': 3, 'type': '',
           'name': json_car['name'],
           'heading': json_car['heading'],
           'road_deviation': np.random.uniform(float(json_car['roadDeviation'][0]),
                                               float(json_car['roadDeviation'][1]))}
    if json_car['name'] == 'Ego':
        car['type'] = 'Ego'
    else:
        car['type'] = 'Other'
    accumulated_distance = 0
    for index, vertices in enumerate(find_lanelet.center_vertices[1:]):
        pre = find_lanelet.center_vertices[index]
        cur = vertices
        if accumulated_distance >= longitudinal_offset:
            # calculate normal
            delta_x = cur[0] - pre[0]
            delta_y = cur[1] - pre[1]
            radial_angle = np.arctan2(delta_y, delta_x)
            car['orientation'] = -radial_angle
            normal_angle = radial_angle - np.pi / 2
            car['center'] = pre + np.array([lateral_offset * np.cos(normal_angle), lateral_offset * np.sin(normal_angle)])
            break
        accumulated_distance += np.linalg.norm(cur - pre)
    return car


def generate_border(json_car, find_lanelet, start_min, end_max, offset, width):
    border = {'name': json_car['name'], 'start_min': start_min, 'end_max': end_max}
    border['lanelet_id'] = find_lanelet.lanelet_id
    if json_car['name'] == 'Ego':
        border['type'] = 'Ego'
    else:
        border['type'] = 'Other'
    accumulated_distance = 0
    start_vertices_idx = -1
    end_vertices_idx = -1
    for index, vertices in enumerate(find_lanelet.center_vertices[1:]):
        pre = find_lanelet.center_vertices[index]
        cur = vertices
        if accumulated_distance >= start_min and start_vertices_idx == -1:
            start_vertices_idx = index
        if accumulated_distance >= end_max and end_vertices_idx == -1:
            end_vertices_idx = index
            break
        accumulated_distance += np.linalg.norm(cur - pre)
    if not start_vertices_idx == -1 and end_vertices_idx == -1:
        # overflow
        end_vertices_idx = len(find_lanelet.center_vertices) - 1
    if not start_vertices_idx == -1 and not end_vertices_idx == -1:
        border['start_vertices_index'] = start_vertices_idx
        border['end_vertices_index'] = end_vertices_idx
        sliced_center_vertices = np.array(find_lanelet.center_vertices[start_vertices_idx: end_vertices_idx + 1])
        x = sliced_center_vertices[:, 0]
        y = sliced_center_vertices[:, 1]
        dx_dt = np.gradient(x)
        dy_dt = np.gradient(y)
        normals = np.column_stack((-dy_dt, dx_dt))
        average_normal = -np.mean(normals, axis=0)
        average_normal = average_normal / np.linalg.norm(average_normal)
        border['center_vertices'] = np.column_stack((x, y)) + offset * average_normal
        border['width'] = width
        border['offset'] = offset
    return border


def visualize(args):
    """
    Visualize the data from the given file.
    """
    if args[0] == 'custom':
        fh = open(args[1], "r")
        openDriveXml = parse_opendrive(etree.parse(fh).getroot())  # type: ignore
        fh.close()
    else:
        fh = open(f'./simulate/carla_simulator/Carla/Maps/{args[1]}.xodr', "r")
        openDriveXml = parse_opendrive(etree.parse(fh).getroot())  # type: ignore
        fh.close()
    loadedRoadNetwork = Network()
    loadedRoadNetwork.load_opendrive(openDriveXml)
    scenario = loadedRoadNetwork.export_commonroad_scenario()
    border_array = []
    obstacle_array = []
    relate_qu = []
    for car_index, json_car in enumerate(args[2]):
        if json_car['locationType'] == 'Lane Position':
            if json_car['locationParams']['laneId'] == 0:
                pass
            else:
                road_id = json_car['locationParams']['roadId']
                lane_id = json_car['locationParams']['laneId']
                lateral_offset = random.uniform(json_car['locationParams']['lateralOffset'][0], json_car['locationParams']['lateralOffset'][1])
                longitudinal_offset = random.uniform(json_car['locationParams']['longitudinalOffset'][0], json_car['locationParams']['longitudinalOffset'][1])
                find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
                if find_lanelet is not None:
                    car = generate_car(json_car, find_lanelet, longitudinal_offset, lateral_offset)
                    car['lane_id'] = lane_id
                    car['lateral_offset'] = lateral_offset
                    car['longitudinal_offset'] = longitudinal_offset
                    obstacle_array.append(car)
                    border = generate_border(json_car,
                                             find_lanelet,
                                             json_car['locationParams']['longitudinalOffset'][0] - 1.5,
                                             json_car['locationParams']['longitudinalOffset'][1] + 1.5,
                                             (json_car['locationParams']['lateralOffset'][0] + json_car['locationParams']['lateralOffset'][1]) / 2,
                                             json_car['locationParams']['lateralOffset'][1] - json_car['locationParams']['lateralOffset'][0])
                    border_array.append(border)
        elif json_car['locationType'] == 'Road Position':
            road_id = json_car['locationParams']['roadId']
            lateral_offset = random.uniform(json_car['locationParams']['lateralOffset'][0], json_car['locationParams']['lateralOffset'][1])
            longitudinal_offset = random.uniform(json_car['locationParams']['longitudinalOffset'][0], json_car['locationParams']['longitudinalOffset'][1])
            abs_offset = lateral_offset
            if lateral_offset >= 0:
                lane_id = -1
            else:
                lane_id = 1
            find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
            if find_lanelet is not None:
                lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
                while abs(abs_offset) >= lane_width:
                    if abs_offset >= lane_width:
                        abs_offset -= lane_width
                        lane_id -= 1
                    else:
                        abs_offset += lane_width
                        lane_id += 1
                    find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
                    if find_lanelet is None:
                        break
                    lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
            if find_lanelet is not None:
                # remove offset
                car = generate_car(json_car, find_lanelet, longitudinal_offset, abs_offset)
                car['lane_id'] = lane_id
                car['lateral_offset'] = abs_offset
                car['longitudinal_offset'] = longitudinal_offset
                obstacle_array.append(car)
                border = generate_border(json_car, find_lanelet,
                                         json_car['locationParams']['longitudinalOffset'][0] - 1.5,
                                         json_car['locationParams']['longitudinalOffset'][1] + 1.5,
                                         abs_offset,
                                         json_car['locationParams']['lateralOffset'][1] - json_car['locationParams']['lateralOffset'][0])
                border_array.append(border)
        elif json_car['locationType'] == 'Global Position':
            xMin = json_car['locationParams']['x'][0]
            xMax = json_car['locationParams']['x'][1]
            yMin = json_car['locationParams']['y'][0]
            yMax = json_car['locationParams']['y'][0]
            x = random.uniform(xMin, xMax)
            y = random.uniform(yMin, yMax)
            car = {'width': 1, 'length': 2, 'type': ''}
            if json_car['name'] == 'Ego':
                car['type'] = 'Ego'
            else:
                car['type'] = 'Other'
            car['center'] = [x, y]
            car['orientation'] = 0
            border = {}
            if json_car['name'] == 'Ego':
                border['type'] = 'Ego'
            else:
                border['type'] = 'Other'
                border['center_vertices'] = [[(xMax - xMin) / 2, yMin], [(xMax - xMin) / 2, yMax]]
                border['width'] = xMax - xMin
        elif json_car['locationType'] == 'Related Position':
            relate_qu.append(json_car)
    for json_car in relate_qu:
        actor_ref_str = json_car['locationParams']['actorRef']
        actor_ref = next((car for car in obstacle_array if car["name"] == actor_ref_str), None)
        border_ref = next((border for border in border_array if border["name"] == actor_ref_str), None)
        lane_id = -1
        if actor_ref is not None:
            if 'lane_id' in actor_ref:
                lane_id = actor_ref['lane_id']
            else:
                raise RuntimeError("Not support global position with related position currently!")
        if actor_ref is None:
            pass
        else:
            lateral_offset = random.uniform(json_car['locationParams']['lateralOffset'][0], json_car['locationParams']['lateralOffset'][1])
            longitudinal_offset = random.uniform(json_car['locationParams']['longitudinalOffset'][0], json_car['locationParams']['longitudinalOffset'][1])
            abs_offset = lateral_offset + actor_ref['lateral_offset']
            find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
            if find_lanelet is not None:
                lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
                while abs(abs_offset) >= lane_width:
                    if abs_offset >= lane_width:
                        abs_offset -= lane_width
                        lane_id -= 1
                    else:
                        abs_offset += lane_width
                        lane_id += 1
                    find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
                    if find_lanelet is None:
                        break
                    lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
            if find_lanelet is not None:
                car = generate_car(json_car, find_lanelet, longitudinal_offset + actor_ref['longitudinal_offset'], abs_offset)
                car['lane_id'] = lane_id
                car['lateral_offset'] = abs_offset
                car['longitudinal_offset'] = longitudinal_offset + actor_ref['longitudinal_offset']
                obstacle_array.append(car)

        if border_ref is None:
            pass
        else:
            lane_id = -1
            if actor_ref is not None:
                if 'lane_id' in actor_ref:
                    lane_id = actor_ref['lane_id']
                else:
                    raise RuntimeError("Not support global position with related position currently!")
            lateral_offset = (json_car['locationParams']['lateralOffset'][0] + json_car['locationParams']['lateralOffset'][1]) / 2
            abs_offset = lateral_offset + border_ref['offset']
            find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
            if find_lanelet is not None:
                lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
                while abs(abs_offset) >= lane_width:
                    if abs_offset >= lane_width:
                        abs_offset -= lane_width
                        lane_id -= 1
                    else:
                        abs_offset += lane_width
                        lane_id += 1
                    find_lanelet = scenario.lanelet_network.find_lanelet_by_description('.'.join([str(road_id), '-1', str(lane_id), '-1']))  # type: ignore
                    if find_lanelet is None:
                        break
                    lane_width = round(np.linalg.norm(find_lanelet.left_vertices[0] - find_lanelet.right_vertices[0]), 5)
            if find_lanelet is not None:
                # remove offset
                start_min = border_ref['start_min'] + json_car['locationParams']['longitudinalOffset'][0]
                end_max = border_ref['end_max'] + json_car['locationParams']['longitudinalOffset'][1]
                border = generate_border(json_car, find_lanelet, start_min - 1.5, end_max + 1.5,
                                         abs_offset,
                                         border_ref['width'] + json_car['locationParams']['lateralOffset'][1] - json_car['locationParams']['lateralOffset'][0])
                border_array.append(border)
    lanelet_array = []
    for lanelet in scenario.lanelet_network.lanelets:
        lanelet_array.append({'lanelet_id': lanelet.lanelet_id,
                              'left_vertices': lanelet.left_vertices.tolist(),
                              'center_vertices': lanelet.center_vertices.tolist(),
                              'right_vertices': lanelet.right_vertices.tolist()})
    for obstacle in scenario.static_obstacles:
        obstacle_array.append({'obstacle_shape': obstacle.obstacle_shape.__dict__, 'obstacle_type': str(obstacle.obstacle_type)})
    return json.dumps({'lanelet_array': lanelet_array, 'obstacle_array': obstacle_array, 'border_array': border_array}, default=complex_object_encoder)
