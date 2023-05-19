import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { objOf } from 'ramda';

export default routePOST<API__Teacher.ListReq, API__Teacher.ListRes>((context) => {
  return Tables.Teacher.select().exec().then(objOf('list'));
});
