import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';

export function classUpdate (body: API__Class.UpdateReq) {
  const idKey: keyof typeof body = 'id';

  return Tables
    .Class
    .update({
      ...omit([idKey], body),
      classTeacher: JSON.stringify(body.classTeacher),
    })
    .where(Tables.Class.getFieldName('id'), '=', body.id)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Class.UpdateReq, API__Class.UpdateRes>((context) => {
  return classUpdate(context.request.body);
});
