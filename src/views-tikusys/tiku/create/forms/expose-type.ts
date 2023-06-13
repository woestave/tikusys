import { QuestionType } from 'common-packages/constants/question';
import { DefaultQuestionModel } from 'common-packages/models/question-model-base';

export interface ExposeType {
  resetAll: () => void;
  setModel: (model: DefaultQuestionModel) => void;
  questionType: QuestionType;
}
