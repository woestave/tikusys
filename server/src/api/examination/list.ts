import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { objOf } from "ramda";

export default routePOST<API__Examination.ListReq, API__Examination.ListRes>(function (cxt, next) {

  const body = cxt.request.body;

  const F = Tables
  .Examination
  .select()
  .orderBy({ createTime: 'desc', });

  return F.select('count(*) as total').exec().then(([{total}]) => {
    return F
      .pagination(body.pageNumber, body.pageSize)
      .exec()
      // .then(objOf('list'));
      .then(list => ({
        list,
        total: total as number,
      }));
  });
});
