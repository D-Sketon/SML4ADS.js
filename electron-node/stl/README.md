# ODD 到 STL 的转换

- ODD 语句由三个部分组成
  - 限定词: include、exclude、conditional
  - 属性
  - 属性值

## 示例

```txt
TYPE 1 |——Include regions or states is [Ottawa Canada]
       |                                    ||
       |                                    \/
       |                            Constant Value
TYPE 2 |——Include zones are [regions or states, geofenced areas]
       |                                  ||
       |                                  \/
       |                              Enum Value
TYPE 3 |——Include lane marking is [2,∞]
       |                            ||
       |                            \/
       |                        Range Value
TYPE 4 |——Include subject vehicle speed is [0, 15 km/h]
                                                ||
                                                \/
                                      Range Value with Unit
```

```txt
BNF：
([]内的元素仅为连接词，不应出现在输入中)
<odd> ::= <composition> | <conditional>
<composition> ::= <qualifier> <attribute> ["is" | "are"] <value>
<conditional> ::= <"conditional"> <"include" | "exclude"> <attribute_metric> ["of"] <attribute> [["for"] <attribute>] ["is" | "are"] <value>
<qualifier> ::= "conditional" | "include" | "exclude"
<attribute> ::= <see domain>
<value> ::= <enum_value> | <range_value>
<enum_value> ::= "VALUE" [", VALUE"]*
<range_value> ::= "NUMBER" ", " "NUMBER" [unit] (number can be Inf)
<unit> ::= "m/s" | "s" | "m" | "km/h" | "C" | "other" (see domain)
```

## 处理方式

```text
ODD语句
  || 正则预处理，提取主要信息
  \/
三元组数组/四元组数组
  ||
  \/
对应为 composition 和 conditional
  || 根据映射规则
  \/
映射转换
```
