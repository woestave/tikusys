import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';

export default routePOST<API__Class.ListReq, API__Class.ListRes>((context) => {

  return Tables.Class.select().orderBy({ createTime: 'desc' }).exec().then(list => ({
    list,
  }));
});
