import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { objOf } from 'ramda';

export default routePOST<API__Teacher.ListReq, API__Teacher.ListRes>((context) => {
  const body = context.request.body;
  // return Tables.Teacher.select().exec().then(list => {
  //   return {
  //     list,
  //     total: 0,
  //   };
  // });

  const F = Tables
    .Teacher
    .groupStart()
    .where(Tables.Teacher.getFieldName('teacherName'), 'like', `%${body.teacherName || ''}%`)
    .or()
    .where(Tables.Teacher.getFieldName('teacherIdCard'), 'like', `%${body.teacherName || ''}%`)
    .groupEnd()
    .where(Tables.Teacher.getFieldName('teacherClass'), '=', body.teacherClass)
    .where(Tables.Teacher.getFieldName('teacherRole'), '=', body.teacherRole)
    .where(Tables.Teacher.getFieldName('teacherStatus'), '=', body.teacherStatus)
    .orderBy({ teacherId: 'desc', })
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
