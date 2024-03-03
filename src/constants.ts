export enum FILE_SUFFIX {
  TREE = "tree",
  MODEL = "model",
  JSON = "json",
  XML = "xml",
  XODR = "xodr",
  OSC = "osc",
  ADSML = "adsml",
  ADSTL = "adstl",
  CSV = "csv",
  PKL = "pkl",
  NPY = "npy",
  VIRTUAL_SIMULATION_RESULT = "$$\ua265virtual_simulation_result\ua265$$",
}

export enum FILE_TYPE {
  DIRECTORY = "directory",
  FILE = "file",
}

export enum FILE_OPERATION {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  RENAME = "rename",
}

export const defaultStlTemplate = `# 内置道路限速扩展法规

__Extend__ INCLUDE speed OF subject vehicle FOR motorway IS 60, 120 km/h          # 高速公路

__Extend__ INCLUDE speed OF subject vehicle FOR highway IS 60, 120 km/h           # 高速公路

__Extend__ INCLUDE speed OF subject vehicle FOR interstate IS 60, 120 km/h        # 高速公路

__Extend__ INCLUDE speed OF subject vehicle FOR primary roads IS 60, 100 km/h     # 快速路/一级公路

__Extend__ INCLUDE speed OF subject vehicle FOR radial roads IS 40, 60 km/h       # 主干路/二级公路

__Extend__ INCLUDE speed OF subject vehicle FOR distributor roads IS 30, 50 km/h  # 次干路/三级公路

__Extend__ INCLUDE speed OF subject vehicle FOR minor roads IS 20, 40 km/h        # 支路/四级公路

__Extend__ INCLUDE speed OF subject vehicle FOR local roads IS 20, 40 km/h        # 支路/四级公路

__Extend__ INCLUDE speed OF subject vehicle FOR slip roads IS 0, 40 km/h          # 匝道

__Extend__ INCLUDE speed OF subject vehicle FOR off-ramps IS 0, 40 km/h           # 匝道

__Extend__ INCLUDE speed OF subject vehicle FOR parking space IS 0, 20 km/h

__Extend__ INCLUDE speed OF subject vehicle FOR shared space IS 0, 20 km/h

---

# 机动车在高速公路上行驶，车速超过每小时100公里时，应当与同车道前车保持100米以上的距离，车速低于每小时100公里时，与同车道前车距离可以适当缩短，但最小距离不得少于50米。

GLOBALLY 
  IF
    location of car IS EQUAL TO motorway
  THEN
      IF 
        speed of car IS GREATER THAN 27.7
      THEN
        distance between car and front IS GREATER THAN 100
    AND
      IF 
        speed of car IS LESS THAN 27.7
      THEN
        distance between car and front IS GREATER THAN 50

# 机动车在高速公路上行驶，遇有雾、雨、雪、沙尘、冰雹等低能见度气象条件时，应当遵守下列规定：
#（一）能见度小于200米时，开启雾灯、近光灯、示廓灯和前后位灯，车速不得超过每小时60公里，与同车道前车保持100米以上的距离；
#（二）能见度小于100米时，开启雾灯、近光灯、示廓灯、前后位灯和危险报警闪光灯，车速不得超过每小时40公里，与同车道前车保持50米以上的距离；
#（三）能见度小于50米时，开启雾灯、近光灯、示廓灯、前后位灯和危险报警闪光灯，车速不得超过每小时20公里，并从最近的出口尽快驶离高速公路。

GLOBALLY
  IF
    location of car IS EQUAL TO motorway
  THEN
      IF 
        particulate IS LESS THAN 200
      THEN
        speed of car IS LESS THAN 16.6 AND distance between car and front IS GREATER THAN 100
    AND
      IF 
        particulate IS LESS THAN 100
      THEN
        speed of car IS LESS THAN 11.1 AND distance between car and front IS GREATER THAN 50
    AND
      IF 
        particulate IS LESS THAN 50
      THEN
        speed of car IS LESS THAN 5.6`;
