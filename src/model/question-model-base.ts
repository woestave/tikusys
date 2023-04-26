import { QuestionType } from "@/constants/question";

export interface BaseCustomQuestionInfo {
  questionType: QuestionType;
}
export interface QuestionModel<CQI extends BaseCustomQuestionInfo> {
  id: number;
  tName: null | string;
  scoreValue: number;
  phase: null | number;
  customQuestionInfo: CQI;
}

// export class QuestionModel1<CQI extends BaseCustomQuestionInfo> {
//   public id: number;
//   public tName: null | string;
//   public scoreValue: number;
//   public phase: null | number;
//   public customQuestionInfo: CQI;

//   public static partial<CQI extends BaseCustomQuestionInfo> (
//     questionType: QuestionType,
//     partialModel: Partial<Omit<QuestionModel<CQI>, 'customQuestionInfo'> & {
//       customQuestionInfo?: Omit<CQI, keyof BaseCustomQuestionInfo>;
//     }>
//   ) {
//     const _default = this.getDefaultQuestionModel<CQI>(() => ({
//       questionType,
//       ...partialModel.customQuestionInfo,
//     }));
//     return new this<CQI>({});
//   }

//   public static getDefaultQuestionModel<CQI extends BaseCustomQuestionInfo> (getCustomQuestionInfo: () => CQI) {
//     return new this<CQI>({
//       id: 0,
//       tName: null,
//       scoreValue: 1,
//       phase: null,
//       customQuestionInfo: getCustomQuestionInfo(),
//     });
//   }

//   public constructor (props: QuestionModel<CQI>) {
//     this.id = props.id;
//     this.tName = props.tName;
//     this.scoreValue = props.scoreValue;
//     this.phase = props.phase;
//     this.customQuestionInfo = props.customQuestionInfo;
//   }
// }

export function getDefaultQuestionModel<CQI extends BaseCustomQuestionInfo> (getCustomQuestionInfo: () => CQI): QuestionModel<CQI> {
  return {
    id: 0,
    tName: null,
    scoreValue: 1,
    phase: null,
    customQuestionInfo: getCustomQuestionInfo(),
  };
}

export function getPartialQuestionModelFactory<
  T extends QuestionModel<CQI>,
  QT extends QuestionType = T['customQuestionInfo']['questionType'],
  CQI extends BaseCustomQuestionInfo & { questionType: QT; } = BaseCustomQuestionInfo & { questionType: QT; },
> (questionType: QT) {
  return function getPartialQuestionModel (
    partialModel: Partial<Omit<T, 'customQuestionInfo'> & {
      customQuestionInfo?: Omit<T['customQuestionInfo'], keyof BaseCustomQuestionInfo>;
    }
  >): T {
    const _default = getDefaultQuestionModel(() => ({ questionType, }));
    return {
      ..._default,
      ...partialModel,
      customQuestionInfo: {
        ..._default.customQuestionInfo,
        ...partialModel.customQuestionInfo,
      },
    } as T;
  };  
}



export function questionTypeIs (question: QuestionModel<BaseCustomQuestionInfo>, questionType: QuestionType) {
  return question.customQuestionInfo.questionType === questionType;
}
