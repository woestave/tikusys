import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__Class.ListReq, API__Class.ListRes>((context) => {

  const body = context.request.body;

  const F = Tables.Class.select().orderBy({ createTime: 'desc' });

  return F
    .pagination(body.pageNumber, body.pageSize)
      .exec()
      .then((classList) => {
        return Tables
          .Student
          .where(Tables.Student.getFieldName('studentClass'), 'in', classList.map((x) => x.id))
          .select()
          .exec()
          .then((students) => {
            return F.select('count(*) as total').exec().then(([{total}]) => ({
              list: classList.map((x) => ({
                ...x,
                studentCount: students.filter((student) => student.studentClass === x.id).length,
              })),
              total: total as number,
            }));
          });
    });
});
