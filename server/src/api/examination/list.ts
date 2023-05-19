import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { objOf } from "ramda";

export default routePOST<API__Examination.ListReq, API__Examination.ListRes>(function (cxt, next) {

  return Tables
    .Examination
    .select()
    .orderBy({ createTime: 'desc', })
    .exec()
    // .then(objOf('list'));
    .then(x => ({
      list: x,
      userInfo: cxt.state,
    }));
});
