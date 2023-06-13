import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';

export function examinationUpdate (body: API__Examination.UpdateReq) {
  const idKey: keyof typeof body = 'id';

  return Tables
    .Examination
    .update({
      ...omit([idKey], body),
      examClassIds: JSON.stringify(body.examClassIds),
    })
    .where(Tables.Examination.getFieldName('id'), '=', body.id)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Examination.UpdateReq, API__Examination.UpdateRes>((context) => {
  return examinationUpdate(context.request.body);
});
