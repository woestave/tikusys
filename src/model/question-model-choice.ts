import { QuestionType } from "@/constants/question";
import { BaseCustomQuestionInfo, QuestionModel, getDefaultQuestionModel, getPartialQuestionModelFactory, questionTypeIs } from "./question-model-base";

/**
 * 选择题 选项数据类型
 */
export interface ChoiceType {
  label: string;
  right: boolean;
}
/**
 * 选择题的customQuestionInfo
 */
export interface ChoiceQuestionInfo extends BaseCustomQuestionInfo {
  questionType: QuestionType.choiceQuestion;
  choices: ChoiceType[];
}

export type ChoiceQuestionModel = QuestionModel<ChoiceQuestionInfo>;

export function genChoiceModel (label: string, right?: boolean): ChoiceType {
  return {
    label,
    right: !!right,
  };
}


export function getDefaultChoises () {
  return [
    genChoiceModel(''),
    genChoiceModel(''),
    genChoiceModel(''),
    genChoiceModel(''),
  ];
}



export function getDefaultChoiceQuestionModel (): ChoiceQuestionModel {
  return getDefaultQuestionModel<ChoiceQuestionInfo>(() => ({
    questionType: QuestionType.choiceQuestion,
    choices: getDefaultChoises(),
  }));
}

/**
 * 创建一个choiceQuestionModel根据个别属性
 * ```tsx
 * const test = getPartialChoiceQuestionModel({
 *   tName: '测试1',
 *   customQuestionInfo: {
       choices: [genChoiceModel('选项1'), genChoiceModel('选项2', true)],
 *   },
 * });
 * console.log(test); -> {
 *   id: 0,
 *   tName: '测试1',
 *   scoreValue: 1,
 *   phase: null,
 *   customQuestionInfo: {
 *     questionType: QuestionType.choiceQuestion,
 *     choices: [{ label: '选项1', right: false, }, { label: '选项2', right: true, }],
 *   },
 * }
 * ```
 */
export const getPartialChoiceQuestionModel = getPartialQuestionModelFactory<ChoiceQuestionModel>(QuestionType.choiceQuestion);

/**
 * 判断该选择题是否属于单选题
 */
export function filterSingleChoiceQuestion (questionModel: QuestionModel<BaseCustomQuestionInfo> | ChoiceQuestionModel) {
  return questionTypeIs(questionModel, QuestionType.choiceQuestion) && (questionModel as ChoiceQuestionModel).customQuestionInfo.choices.filter(y => y.right).length === 1;
}
/**
 * 判断该选择题是否属于多选题
 */
export function filterMultiChoiceQuestion (questionModel: QuestionModel<BaseCustomQuestionInfo> | ChoiceQuestionModel) {
  return questionTypeIs(questionModel, QuestionType.choiceQuestion) && (questionModel as ChoiceQuestionModel).customQuestionInfo.choices.filter(y => y.right).length > 1;
}


/**
 * 判断一个question是否属于选择题
 * @param anyQuestionModel 任何一个question类型的数据
 * @returns boolean
 */
export function filterIsChoiceQuestion (anyQuestionModel: QuestionModel<BaseCustomQuestionInfo>) {
  return anyQuestionModel.customQuestionInfo.questionType === QuestionType.choiceQuestion;
}

