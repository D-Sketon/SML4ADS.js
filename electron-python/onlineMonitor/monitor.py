import base64
import os
import sys
from io import BytesIO

import matplotlib.pyplot as plt
import pandas as pd
import rtamt

curr_dir = os.getcwd()


def monitor(args) -> str:
    df = pd.read_csv(os.path.join(curr_dir, 'onlineMonitor', args[0]) if args[0] == 'signal1.csv' else args[0], header=0)
    times = df['time'].tolist()
    signal = df['signal'].tolist()

    print(signal, times)

    # 创建一个STL密集时间规范
    spec = rtamt.StlDenseTimeSpecification()
    spec.name = 'STL dense-time specification'

    # 声明变量：a
    spec.declare_var('a', 'float')

    # 定义STL规范：a的值应始终大于或等于2
    spec.spec = args[1]

    # 解析STL规范
    try:
        spec.parse()
    except rtamt.RTAMTException as err:
        print('RTAMT Exception: {}'.format(err))
        sys.exit()

    rob_values = []
    # times = []s
    # a_values = []

    # for a_data in [a1, a2, a3]:
    #     rob = spec.update(['a', a_data])
    #
    #     # 更新鲁棒值列表和时间列表
    #     for r in rob:
    #         times.append(r[0])
    #         rob_values.append(r[1])
    #
    #     # 更新信号值列表
    #     a_values.extend([v for _, v in a_data])
    #
    #     print('rob: ' + str(rob))
    # a_values.pop()
    # print(times)
    # print(a_values)
    # print(rob_values)
    for t, s in zip(times, signal):
        rob_value = spec.update(['a', [(t, s)]])  # 使用spec.update来获取rob值
        print(rob_value)  # 打印rob_value的内容
        if rob_value:
            rob_values.append(rob_value[0][1])
    times.pop()
    signal.pop()

    plt.clf()
    plt.plot(times, rob_values, marker='o', label="Robustness Value")
    plt.plot(times, signal, marker='x', label="Input Signal a")
    plt.xlabel('Time')
    plt.ylabel('Value')
    plt.title('Robustness Value and Input Signal Over Time')
    plt.grid(True)
    plt.legend()

    if args[2]:
        # 转base64
        figfile = BytesIO()
        plt.savefig(figfile, format='png')
        figfile.seek(0)
        figdata_png = base64.b64encode(figfile.getvalue())  # 将图片转为base64
        figdata_str = str(figdata_png, "utf-8")  # 提取base64的字符串，不然是b'xxx'

        return figdata_str
    else:
        plt.show()
        return ""
