import { beginTransaction } from '#/mysql';
import { Tables } from '#/mysql/tables';
import { routeGET } from '#/routes/route';
import { sleep } from 'common-packages/utils/sleep';
import querystring from 'querystring';
import { escape} from 'mysql2';

/**
 * @2023.05.20 数据清洗脚本
 * 背景：mysql tName会被注入且customQuestionInfo字段的json数据格式不满足需求，需要改成text格式，并将储存的json串修改为encodeURIComponent(JSON.stringify(原数据))
 * 已完成
 */
export default routeGET((context) => {
  return null;
  // return beginTransaction((conn) => {
  //   return Tables.Tiku.select().execWithTransaction(conn).then(async (list) => {
  //     await sleep(1000);
  //     return Tables.Tiku.delete().execWithTransaction(conn).then(async () => {
  //       await sleep(1000);
  //       return Tables.Tiku.insert(list.map(x => ({
  //         ...x,
  //         tName: encodeURIComponent(x.tName || ''),
  //         customQuestionInfo: encodeURIComponent(JSON.stringify(JSON.parse(x.customQuestionInfo as any as string))),
  //       }))).execWithTransaction(conn);
  //     });
  //   });
  // });
});
