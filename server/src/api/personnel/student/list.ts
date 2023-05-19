import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { objOf } from 'ramda';

export default routePOST<API__Student.ListReq, API__Student.ListRes>((context) => {
  return Tables.Student.select().exec().then(objOf('list'));
});
