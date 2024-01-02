import RangeValue from "../value/RangeValue";
import EnumValue from "../value/enumValue";

const valueMatch = (
  valuePostConvert: EnumValue | RangeValue,
  attribute: string
): string => {
  if (valuePostConvert instanceof EnumValue) {
    const enumValue = valuePostConvert.value.map((v) => `${attribute}==${v}`);
    return enumValue.join(" or ");
  } else if (valuePostConvert instanceof RangeValue) {
    if (valuePostConvert.min === valuePostConvert.max) {
      // min === max 退化为等于
      return `${attribute}==${valuePostConvert.min}`;
    } else {
      if (valuePostConvert.max === Infinity) {
        return `${attribute}>=${valuePostConvert.min}`;
      } else if (valuePostConvert.min === -Infinity) {
        return `${attribute}<=${valuePostConvert.max}`;
      } else {
        return `${attribute}>=${valuePostConvert.min} and ${attribute}<=${valuePostConvert.max}`;
      }
    }
  } else {
    throw new Error("unexpected valuePostConvert type");
  }
};

export default valueMatch;