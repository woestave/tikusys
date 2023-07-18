import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { responseStructPresets } from '#/utils/response-struct';
import { BaseCustomQuestionInfo } from 'common-packages/models/question-model-base';
import { ChoiceQuestionInfo, filterIsChoiceQuestion } from 'common-packages/models/question-model-choice';
import querystring from 'querystring';
import { omit } from 'ramda';

export function getTiListByPaperId (paperId: number) {
  const F = Tables
    .Relation__Exampaper__Tiku
    .select()
    .join('left', Tables.Tiku, `${Tables.Tiku.getTableFieldName('id')} = ${Tables.Relation__Exampaper__Tiku.getTableFieldName('tikuId')}`)
    .where(Tables.Relation__Exampaper__Tiku.getFieldName('paperId'), '=', paperId);

  return F
    .exec()
    .then((tiList) => {
      return {
        tiList: tiList.map((x) => ({
          ...x,
          tName: querystring.unescape(x.tName || ''),
          customQuestionInfo: JSON.parse(querystring.unescape(x.customQuestionInfo as any as string)) as BaseCustomQuestionInfo,
        })),
      };
    });
}
