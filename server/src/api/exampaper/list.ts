import { Tables } from "#/mysql/tables";
import { routePOST } from "#/routes/route";
import { objOf } from "ramda";

export default routePOST<API__Exampaper.ListReq, API__Exampaper.ListRes>(function (cxt, next) {

  return Tables
    .Exampaper
    .select()
    .exec()
    .then(objOf('list'));
});
