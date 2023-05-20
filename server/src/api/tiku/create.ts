import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { getResponseStruct } from '#/utils/response-struct';
import querystring from 'querystring';

export default routePOST<API__Tiku.CreateReq, API__Tiku.CreateRes>((context) => {

  const body = context.request.body;
  const question = body?.question;

  const data: typeof Tables.Tiku['StructIn'] = {
    ...question,
    tName: querystring.escape(question.tName || ''),
    customQuestionInfo: querystring.escape(JSON.stringify(context.request.body?.question.customQuestionInfo)),
    createBy: 1,
    createTime: +new Date(),
  };

  // return getResponseStruct(333, 'sd', Tables
  // .Tiku
  // .insert([data])
  // .sql());
  // return {
  //   succ: 1, res: Tables
  //   .Tiku
  //   .insert([data])
  //   .sql(),
  //   x: data,
  // };

  return Tables
    .Tiku
    .insert([data])
    .exec()
    .then((res) => ({ succ: 1, res }));
});
