import { ChoiceQuestionModel, filterMultiChoiceQuestion, filterSingleChoiceQuestion } from 'common-packages/models/question-model-choice';
import { ShortQuestionModel, filterIsShortQuestion } from 'common-packages/models/question-model-short';

export type ClassifyQuestions = ReturnType<typeof getClassifyQuestions>;

export default function getClassifyQuestions (questions: API__Tiku.TableStruct__Tiku[]) {
  const shorts = (questions.filter(filterIsShortQuestion) || []) as Array<ShortQuestionModel & API__Tiku.TableStruct__Tiku>;
  const singles = (questions.filter(filterSingleChoiceQuestion) || []) as Array<ChoiceQuestionModel & API__Tiku.TableStruct__Tiku>;
  const multiples = (questions.filter(filterMultiChoiceQuestion) || []) as Array<ChoiceQuestionModel & API__Tiku.TableStruct__Tiku>;

  return {
    singles,
    multiples,
    shorts,
  };
}
