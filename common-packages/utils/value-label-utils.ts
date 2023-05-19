export function getValueLabelCurried<VK extends string, LK extends string> (valueKey: VK, labelKey: LK) {
  return function (obj: Record<VK, number> & Record<LK, string>) {
    return {
      label: obj[labelKey],
      value: obj[valueKey],
    };
  };
}


export function createValueLabelObj (value: number, label: string) {
  return {
    label, value,
  };
}
