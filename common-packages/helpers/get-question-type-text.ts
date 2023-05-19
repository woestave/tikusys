import { filterSingleChoiceQuestion } from 'common-packages/models/question-model-choice';
import { QuestionType } from 'common-packages/constants/question';
import { DefaultQuestionModel } from 'common-packages/models/question-model-base';

export function getQuestionTypeText (
  question: DefaultQuestionModel
) {
  switch (question.customQuestionInfo.questionType) {
    case QuestionType.shortAnswerQuestion:
      return '简答题';
    case QuestionType.choiceQuestion:
      return filterSingleChoiceQuestion(question)
        ? '单选题'
        : '多选题';
  }
}
