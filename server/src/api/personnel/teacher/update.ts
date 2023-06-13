import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';

export function teacherUpdate (body: API__Teacher.UpdateReq) {
  const idKey: keyof typeof body = 'teacherId';

  return Tables
    .Teacher
    .update({
      ...omit([idKey], body),
    })
    .where(Tables.Teacher.getFieldName('teacherId'), '=', body.teacherId)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Teacher.UpdateReq, API__Teacher.UpdateRes>((context) => {
  return teacherUpdate(context.request.body);
});
