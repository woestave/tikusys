
export interface HMS {
  /** 小时数 */
  h: number;
  /** 分钟数 */
  m: number;
  /** 秒数 */
  s: number;
}
/**
 * 将小时的毫秒数格式化为小时数、分钟数、秒数
 * @param ms 小时的毫秒数
 */
export function formatMsToHMS (ms: number): HMS {
  const hour = ms / 1000 / 60 / 60;
  const h = Math.floor(hour);
  const m = Math.floor(ms / 60 / 1000 % 60);
  const s = Math.floor(ms / 1000 % 60);

  return { h, m, s };
}

/**
 * 将h、m、s格式化为毫秒数
 */
export function formatHMSToMs ({ h, m, s }: HMS) {
  return (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000);
}
