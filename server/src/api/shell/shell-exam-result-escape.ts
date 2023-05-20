import { beginTransaction } from '#/mysql';
import { Tables } from '#/mysql/tables';
import { routeGET } from '#/routes/route';
import { sleep } from 'common-packages/utils/sleep';
import querystring from 'querystring';
import { escape} from 'mysql2';

/**
 * @2023.05.20 数据清洗脚本
 * 背景：mysql exam_result表examResultAnswerInfo字段的json洗成encodeURIComponent加密形式。
 * 已完成
 */
export default routeGET((context) => {
  // return beginTransaction((conn) => {
  //   return Tables.ExamResult.select().execWithTransaction(conn).then(async (list) => {
  //     await sleep(1000);
  //     return Tables.ExamResult.delete().execWithTransaction(conn).then(async () => {
  //       await sleep(1000);
  //       return Tables.ExamResult.insert(list.map(x => ({
  //         ...x,
  //         examResultAnswerInfo: encodeURIComponent(JSON.stringify(JSON.parse(x.examResultAnswerInfo as any as string))),
  //       }))).execWithTransaction(conn);
  //     });
  //   });
  // });
});
