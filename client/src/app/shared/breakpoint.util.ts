 const getBreakpoint = (w: number, enumerated = false): number | DeviceSize  => {
  if (w >= 1400) {
    return enumerated ? 6 : "xxl";
  } else if (w >= 1200) {
    return enumerated ? 5 : "xl";
  } else if (w >= 992) {
    return enumerated ? 4 : "lg";
  } else if (w >= 768) {
    return enumerated ? 3 : "md";
  } else if (w >= 576) {
    return enumerated ? 2 : "sm";
  } else {
    return enumerated ? 1 : "xs";
  }
}

export default getBreakpoint;
export type DeviceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
