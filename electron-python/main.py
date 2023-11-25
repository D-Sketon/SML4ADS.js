import hprose


def simulate(args) -> None:
    """
    :param args: dict.仿真参数
    :return: None
    """
    # pre_process_args(args)
    print(f'args: {args}')
    # carla_simulator = CarlaSimulator(args['scenario_img_path'],
    #                                  args['mp4_path'],
    #                                  address=args['ip'],
    #                                  port=args['port'],
    #                                  record=args['recorder'],
    #                                  data_path=args['csv_path'])
    # if args['scene'] == -1:
    #     # scenario仿真
    #     simulation_result = carla_simulator.simulate(path=args['path'])
    #     print(simulation_result)
    # else:
    #     # scene仿真
    # carla_simulator.static_scene(                 path=args['path'],
    #                             img_path=args['scene_img_path'],
    #                             count=args['scene'])
    # print('simulation finished.')


def pstl(args) -> None:
    print(f'args: {args}')


def main():
    server = hprose.HttpServer(port=20225)
    server.addFunction(simulate)
    server.addFunction(pstl)
    server.handle('RPC')
    server.start()


if __name__ == "__main__":
    main()
