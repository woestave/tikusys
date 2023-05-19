import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__ClassType.ListReq, API__ClassType.ListRes>(() => {

  return Tables
    .ClassType
    .select()
    .exec()
    .then(list => ({
      list,
    }));
});