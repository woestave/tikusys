import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { omit } from 'ramda';

export function studentUpdate (body: API__Student.UpdateReq) {
  const idKey: keyof typeof body = 'studentId';

  return Tables
    .Student
    .update({
      ...omit([idKey], body),
    })
    .where(Tables.Student.getFieldName('studentId'), '=', body.studentId)
    .exec()
    .then((res) => ({ succ: res.affectedRows as 0 | 1, result: res, }));
}

export default routePOST<API__Student.UpdateReq, API__Student.UpdateRes>((context) => {
  return studentUpdate(context.request.body);
});
