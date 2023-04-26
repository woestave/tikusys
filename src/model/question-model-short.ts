/**
 * 简答题 生成一个默认的简答题数据模型
 */

import { QuestionType } from "@/constants/question";
import { BaseCustomQuestionInfo, QuestionModel, getDefaultQuestionModel, getPartialQuestionModelFactory } from "./question-model-base";


/**
 * 简答题的customQuestionInfo
 */
export interface ShortQuestionInfo {
  questionType: QuestionType.shortAnswerQuestion;
}
/**
 * 简答题类型简写
 */
export type ShortQuestionModel = QuestionModel<ShortQuestionInfo>;


export function getDefaultShortQuestionModel () {
  return getDefaultQuestionModel<ShortQuestionInfo>(() => ({
    questionType: QuestionType.shortAnswerQuestion,
  }));
}


/**
 * 创建一个shortQuestionModel根据个别属性
 */
export const getPartialShortQuestionModel = getPartialQuestionModelFactory<ShortQuestionModel>(QuestionType.shortAnswerQuestion);


/**
 * 判断一个question是否属于简答题
 * @param anyQuestionModel 任何一个question类型的数据
 * @returns boolean
 */
export function filterIsShortQuestion (anyQuestionModel: QuestionModel<BaseCustomQuestionInfo>) {
  return anyQuestionModel.customQuestionInfo.questionType === QuestionType.shortAnswerQuestion;
}
