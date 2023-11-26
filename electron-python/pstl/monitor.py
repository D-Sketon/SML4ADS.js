import os
import sys

import matplotlib.pyplot as plt
import pandas as pd
import rtamt

curr_dir = os.getcwd()


def monitor():
    print(curr_dir)
    df = pd.read_csv(os.path.join(curr_dir, 'pstl', 'signal1.csv'), header=0)
    times = df['time'].tolist()
    signal = df['signal'].tolist()

    print(signal, times)

    # 创建一个STL密集时间规范
    spec = rtamt.StlDenseTimeSpecification()
    spec.name = 'STL dense-time specification'

    # 声明变量：a
    spec.declare_var('a', 'float')

    # 定义STL规范：a的值应始终大于或等于2
    spec.spec = 'a>=2'

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

    plt.plot(times, rob_values, marker='o', label="Robustness Value")
    plt.plot(times, signal, marker='x', label="Input Signal a")
    plt.xlabel('Time')
    plt.ylabel('Value')
    plt.title('Robustness Value and Input Signal Over Time')
    plt.grid(True)
    plt.legend()
    plt.show()
