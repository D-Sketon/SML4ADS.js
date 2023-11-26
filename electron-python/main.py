import argparse
import os

import hprose
from pstl import monitor
from simulate.carla_simulator.carla_simulator import CarlaSimulator


def parse_args() -> dict:
    """

    :return:
    """
    curr_folder = os.getcwd()
    project_path = curr_folder[:curr_folder.rfind(os.path.sep) + 1]
    scenario_img_path = project_path + 'store/scenario/img'
    mp4_path = project_path + 'store/scenario/mp4/default.mp4'
    scene_path = project_path + 'store/scene'
    parser = argparse.ArgumentParser()
    parser.add_argument('path', help='ADSML文件路径', type=str)
    parser.add_argument('-scene', help='静态场景展示得图片数量', type=int, default=-1)
    parser.add_argument('-scenario_img_path', help='仿真过程存储图片的文件夹路径', type=str, default=scenario_img_path)
    parser.add_argument('-mp4_path', help='仿真过程完成后生成的视频文件路径', type=str, default=mp4_path)
    parser.add_argument('-scene_img_path', help='静态场景展示图片的存储文件夹路径', type=str, default=scene_path)
    parser.add_argument('-recorder', help='使用recorder的文件存储路径', type=str, default='')
    parser.add_argument('-ip', help='仿真器ip', type=str, default='127.0.0.1')
    parser.add_argument('-port', help='仿真器端口', type=int, default=2000)
    parser.add_argument('-csv_path', help='记录时空轨道数据，给出文件路径', type=str, default='')
    return vars(parser.parse_args())


def pre_process_args(args: dict):
    """
    对参数进行预处理
    :param args:
    :return:
    """
    curr_folder = os.getcwd()
    project_path = curr_folder[:curr_folder.rfind(os.path.sep) + 1]
    scenario_img_path = project_path + 'store/scenario/img'
    mp4_path = project_path + 'store/scenario/mp4/default.mp4'
    scene_path = project_path + 'store/scene'
    default_args = {
        'path': '',
        'scene': -1,
        'scenario_img_path': scenario_img_path,
        'mp4_path': mp4_path,
        'scene_img_path': scene_path,
        'recorder': '',
        'ip': '127.0.0.1',
        'port': 2000,
        'csv_path': ''
    }
    for key in default_args:
        args.setdefault(key, default_args[key])

    args['path'] = args['path'].replace('\\', '/')
    args['scenario_img_path'] = args['scenario_img_path'].replace('\\', '/')
    args['mp4_path'] = args['mp4_path'].replace('\\', '/')
    args['scene_img_path'] = args['scene_img_path'].replace('\\', '/')
    args['recorder'] = args['recorder'].replace('\\', '/')
    args['csv_path'] = args['csv_path'].replace('\\', '/')


"""
调用可能需要传递的参数：
1：仿真时存储rgb camera记录的图片的路径
2：仿真时存储生成的视频的路径
3：是否使用CARLA的recorder，可用于还原本次仿真过程。如果使用，存储文件路径
4：如果使用静态场景，静态场景展示的图片生成路径以及生成的图片数量
5：怎样区分是调用的静态场景展示功能还是仿真功能
6：场景模型既adsml文件的路径
7：CARLA服务器所在IP和端口（默认本地：2000）
8：是否记录时空轨道数据，如果是，存储文件的路径
"""

"""
示例args:
args: {
    'path': 'C:/Users/Jack/Desktop/SML4ADS/Examples/OvertakingScenario/Overtaking.adsml',
    'scene': -1,
    'scenario_img_path': 'C:/Users/Jack/Desktop/MY_SML4ADS/src/main/java/com/ecnu/adsmls/simulator/adsml_carla_simulation/store/scenario/img',
    'mp4_path': 'C:/Users/Jack/Desktop/MY_SML4ADS/src/main/java/com/ecnu/adsmls/simulator/adsml_carla_simulation/store/scenario/mp4/default.mp4',
    'scene_img_path': 'C:/Users/Jack/Desktop/MY_SML4ADS/src/main/java/com/ecnu/adsmls/simulator/adsml_carla_simulation/store/scene',
    'recorder': '',
    'ip': '127.0.0.1',
    'port': 2000,
    'csv_path': ''
}
"""


def simulate(args) -> None:
    """
    :param args: dict.仿真参数
    :return: None
    """
    pre_process_args(args)
    print(f'args: {args}')
    carla_simulator = CarlaSimulator(args['scenario_img_path'],
                                     args['mp4_path'],
                                     address=args['ip'],
                                     port=args['port'],
                                     record=args['recorder'],
                                     data_path=args['csv_path'])
    if args['scene'] == -1:
        # scenario仿真
        simulation_result = carla_simulator.simulate(path=args['path'])
        print(simulation_result)
    else:
        # scene仿真
        carla_simulator.static_scene(path=args['path'],
                                     img_path=args['scene_img_path'],
                                     count=args['scene'])
    print('simulation finished.')


def pstl(args) -> None:
    print(f'args: {args}')
    monitor.monitor(args)


def main():
    server = hprose.HttpServer(port=20225)
    server.addFunction(simulate)
    server.addFunction(pstl)
    server.handle('RPC')
    server.start()


if __name__ == "__main__":
    main()
