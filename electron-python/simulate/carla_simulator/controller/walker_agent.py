import carla


class WalkerAgent:
    def __init__(self, client, world, bp, walker, spawn_tfs: list, location: list):
        self.client = client
        self.walker_ai_blueprint = world.get_blueprint_library().find('controller.ai.walker')
        self.walker_blueprint = bp
        self.walker = walker
        self.spawn_tfs = spawn_tfs
        self.location = location
        self.walker_ai = world.try_spawn_actor(self.walker_ai_blueprint, carla.Transform(), walker)  # type: ignore
        self.is_start = False  # 行为是否开始
        self.is_end = False  # 行为是否结束
        self.clock = 0.0
        self.next_location_point_idx = 0
        self.world = world
        self.control = None

    def run(self):
        if self.is_start is False:
            self.is_start = True
            self.next_location_point_idx += 1
            if self.next_location_point_idx >= len(self.location):
                self.is_end = True
                return
            current_speed = 1.4
            if self.location[self.next_location_point_idx]['speed_type'] == 'Manual':
                current_speed = self.location[self.next_location_point_idx]['speed_params']['speed']
            elif self.location[self.next_location_point_idx]['speed_type'] == 'Walk':
                if self.walker_blueprint.has_attribute('speed'):
                    current_speed = float(self.walker_blueprint.get_attribute('speed').recommended_values[1])
                else:
                    current_speed = 1.4
            elif self.location[self.next_location_point_idx]['speed_type'] == 'Run':
                if self.walker_blueprint.has_attribute('speed'):
                    current_speed = float(self.walker_blueprint.get_attribute('speed').recommended_values[2])
                else:
                    current_speed = 3
            x = self.spawn_tfs[self.next_location_point_idx].location.x - self.spawn_tfs[self.next_location_point_idx - 1].location.x
            y = self.spawn_tfs[self.next_location_point_idx].location.y - self.spawn_tfs[self.next_location_point_idx - 1].location.y
            dis = (x ** 2 + y ** 2) ** 0.5
            self.control = carla.WalkerControl(carla.Vector3D(x / dis, y / dis, 0), current_speed, False)  # type: ignore
            self.client.apply_batch([carla.command.ApplyWalkerControl(self.walker.id, self.control)])  # type: ignore
        else:
            dest_location = self.spawn_tfs[self.next_location_point_idx].location
            curr_location = self.walker.get_location()
            if (dest_location.x - curr_location.x) ** 2 + (dest_location.y - curr_location.y) ** 2 < 0.5 ** 2:
                self.next_location_point_idx += 1
                if self.next_location_point_idx >= len(self.location):
                    self.is_end = True
                    return
                current_speed = 1.4
                if self.location[self.next_location_point_idx]['speed_type'] == 'Manual':
                    current_speed = self.location[self.next_location_point_idx]['speed_params']['speed']
                elif self.location[self.next_location_point_idx]['speed_type'] == 'Walk':
                    if self.walker_blueprint.has_attribute('speed'):
                        current_speed = float(self.walker_blueprint.get_attribute('speed').recommended_values[1])
                    else:
                        current_speed = 1.4
                elif self.location[self.next_location_point_idx]['speed_type'] == 'Run':
                    if self.walker_blueprint.has_attribute('speed'):
                        current_speed = float(self.walker_blueprint.get_attribute('speed').recommended_values[2])
                    else:
                        current_speed = 3
                x = self.spawn_tfs[self.next_location_point_idx].location.x - self.spawn_tfs[self.next_location_point_idx - 1].location.x
                y = self.spawn_tfs[self.next_location_point_idx].location.y - self.spawn_tfs[self.next_location_point_idx - 1].location.y
                dis = (x ** 2 + y ** 2) ** 0.5
                self.control = carla.WalkerControl(carla.Vector3D(x / dis, y / dis, 0), current_speed, False)  # type: ignore
                self.client.apply_batch([carla.command.ApplyWalkerControl(self.walker.id, self.control)])  # type: ignore

    def tick(self, step):
        """
        对本agent的时钟计时
        :return:
        """
        self.clock += step
