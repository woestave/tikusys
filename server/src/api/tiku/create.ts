import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { getResponseStruct } from '#/utils/response-struct';
import querystring from 'querystring';

export function tikuCreate (body: API__Tiku.CreateReq) {
  const question = body?.question;

  const data: typeof Tables.Tiku['StructIn'] = {
    ...question,
    tName: querystring.escape(question.tName || ''),
    customQuestionInfo: querystring.escape(JSON.stringify(body?.question.customQuestionInfo)),
    createBy: 1,
    createTime: +new Date(),
  };


  return Tables
    .Tiku
    .insert([data])
    .exec()
    .then((res) => ({ succ: 1 as const, res, }));
}

export default routePOST<API__Tiku.CreateReq, API__Tiku.CreateRes>((context) => {

  return tikuCreate(context.request.body);
});
