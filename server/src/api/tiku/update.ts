import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';
import querystring from 'querystring';


export function tikuUpdate (body: API__Tiku.UpdateReq) {
  const question = body.question;
  const idKey: keyof typeof question = 'id';

  return Tables
    .Tiku
    .update({
      ...omit([idKey], question),
      tName: querystring.escape(question.tName || ''),
      customQuestionInfo: querystring.escape(JSON.stringify(question.customQuestionInfo)),
    })
    .where(Tables.Class.getFieldName('id'), '=', question.id)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Tiku.UpdateReq, API__Tiku.UpdateRes>((context) => {
  return tikuUpdate(context.request.body);
});
