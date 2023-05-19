import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { prop } from 'ramda';


export default routePOST<API__Tiku.ListReq, API__Tiku.ListRes>(async (context) => {
  const body = context.request.body;

  // const getSql = (limit?: [number, number]) => `\
  //   select\
  //     tiku.id as tikuId,\
  //     tName,\
  //     JSON_OBJECT('ids', JSON_ARRAYAGG(exampaper.id), 'names', JSON_ARRAYAGG(exampaper.paperName)) as paperInfo\
  //   from tiku left join exampaper on JSON_CONTAINS(paperQuestionInfo->'$.*', JSON_ARRAY(tiku.id))\
  //   where tiku.id like '%${(body.id || '').replace(/^0+/, '').trim()}%'\
  //   and (tName like '%${body.tName || ''}%' or customQuestionInfo like '%${body.tName || ''}%')\
  //   ${body.phase?.length ? 'and phase in (' + body.phase.join(',') + ')' : ''}\
  //   GROUP BY tiku.id\
  //   ${' '} ${limit ? limit[0] + ' ' + limit[1] : ''}\
  // `.replace('\\n', ' ');

  // const w = await connectionPromisify.query(getSql()).then((res) => {
  //   return res[0];
  // });

  const F = Tables
    .Tiku
    .select()
    .where(Tables.Tiku.getTableFieldName('id'), 'like', `%${(body.id || '').replace(/^0+/, '').trim()}%`)
    .groupStart()
    .where(Tables.Tiku.getTableFieldName('tName'), 'like', `%${body.tName || ''}%`)
    .or()
    .where(Tables.Tiku.getTableFieldName('customQuestionInfo'), 'like', `%${body.tName || ''}%`)
    .groupEnd()
    .where(Tables.Tiku.getTableFieldName('phase'), 'in', body.phase)
    .where(Tables.Tiku.getTableFieldName('major'), '=', body.major)
    .orderBy({ id: 'desc', });

  // return {
  //   list: [],
  //   total: 1,
  //   sql: F.sql(),
  // };

  return (
    typeof body.pageNumber === 'number' && typeof body.pageSize === 'number'
    ? F.limit((body.pageNumber - 1) * body.pageSize, body.pageSize)
    : F
  )
    .exec()
    .then((tikuList) => {

      return F.select('count(*) as total').exec().then(([total]) => {

        // Tables
        //   .Exampaper
        //   .select('id', 'paperName')
        //   .where('in', 'in', [])
        //   .exec().then((exampapers) => {

        //   });

        return Tables
          .Relation__Exampaper__Tiku
          .join(
            'left',
            Tables.Exampaper,
            Tables.Relation__Exampaper__Tiku.getTableFieldName('paperId') + '=' + Tables.Exampaper.getTableFieldName('paperId'),
          )
          .where(Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId'), 'in', tikuList.map(prop('id')))
          .select(
            Tables.Exampaper.getTableFieldName('paperId'),
            Tables.Exampaper.getTableFieldName('paperName'),
            Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId'),
          )
          .exec()
          .then((res) => {
            const list: API__Tiku.TikuStructWithPaperInfo[] = tikuList.map((x) => ({
              ...x,
              paperInfo: res.filter((y) => y.tikuId === x.id),
            }));
            return {
              list,
              total: (total?.total as void | number) || 0,
            };
          });
      });
    });
});
