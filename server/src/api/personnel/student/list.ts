import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { objOf } from 'ramda';

export default routePOST<API__Student.ListReq, API__Student.ListRes>((context) => {
  const body = context.request.body;

  const F = Tables
    .Student
    .groupStart()
    .where(Tables.Student.getFieldName('studentName'), 'like', `%${body.studentName || ''}%`)
    .or()
    .where(Tables.Student.getFieldName('studentIdCard'), 'like', `%${body.studentName || ''}%`)
    .groupEnd()
    .where(Tables.Student.getFieldName('studentClass'), '=', body.studentClass)
    .where(Tables.Student.getFieldName('studentStatus'), '=', body.studentStatus)
    .orderBy({ studentId: 'desc', })
    .select();

  return F.select('count(*) as total').exec().then(([{total}]) => {
    return F
      .pagination(body.pageNumber, body.pageSize)
      .exec()
      .then((list) => ({
        list,
        total: total as number,
      }));
  });
});
