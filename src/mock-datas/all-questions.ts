import { genChoiceModel, getPartialChoiceQuestionModel } from "common-packages/models/question-model-choice";
import { getPartialShortQuestionModel } from "common-packages/models/question-model-short";

let n = 1;
function inc () {
  return n++;
}


export const getAllQuestions = () => [
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('狗屁'),
        genChoiceModel('猫屁'),
        genChoiceModel('🐴屁', true),
        genChoiceModel('放屁'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测单选题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('狗屁'),
        genChoiceModel('猫屁'),
        genChoiceModel('🐴屁', true),
        genChoiceModel('放屁'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试=单选题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测单题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测单' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题1155' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题' + inc(),
    scoreValue: 1,
    phase: 4,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题' + inc(),
    scoreValue: 1,
    phase: 6,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('语文'),
        genChoiceModel('数学'),
        genChoiceModel('英语', true),
        genChoiceModel('物理'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试单选题' + inc(),
    scoreValue: 1,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('土星'),
        genChoiceModel('木星'),
        genChoiceModel('水星', true),
        genChoiceModel('火星'),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试多选题' + inc(),
    scoreValue: 2,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('多选题1'),
        genChoiceModel('多选题2', true),
        genChoiceModel('多选题3', true),
        genChoiceModel('多选题4', true),
      ],
    },
  }),
  getPartialChoiceQuestionModel({
    id: n,
    tName: '测试多选题' + inc(),
    scoreValue: 2,
    phase: 3,
    customQuestionInfo: {
      choices: [
        genChoiceModel('多选题1'),
        genChoiceModel('多选题2'),
        genChoiceModel('多选题3', true),
        genChoiceModel('多选题4', true),
      ],
    },
  }),

  getPartialShortQuestionModel({
    id: n,
    tName: '测试简答题' + inc(),
    scoreValue: 5,
    phase: 3,
  }),

  getPartialShortQuestionModel({
    id: n,
    tName: '测试简答题' + inc(),
    scoreValue: 5,
    phase: 3,
  }),
];
