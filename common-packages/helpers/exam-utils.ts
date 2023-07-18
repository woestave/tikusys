/**
 * 通过一个时间戳和一个分钟数获取这个时间戳加上分钟数后的时间戳
 */
export function getEndTime (targetTime: number, duration: number) {
  return (targetTime + (duration * 60 * 1000));
}
/**
 * 判断当前时间是否在给定时间戳+给定持续时间之内
 */
export function inExamTime (targetTime: number, duration: number) {
  return +new Date() > targetTime && +new Date() <= getEndTime(targetTime, duration);
}
