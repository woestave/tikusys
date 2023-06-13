import { ChoiceQuestionModel } from 'common-packages/models/question-model-choice';
import { ClassifyQuestions } from './get-classify-questions';
import { prop, sum } from 'ramda';





/**
 * 判断单选题是否答对
 */
export function singleQuestionIsRight (x: ChoiceQuestionModel, answer: API__ExamResult.ExamResultAnswerInfoParsed) {
  return x.customQuestionInfo.choices[answer[x.id] as number]?.right;
}
/**
 * 判断多选题是否答对
 */
export function multiQuestionIsRight (x: ChoiceQuestionModel, answer: API__ExamResult.ExamResultAnswerInfoParsed) {
  const myChoices = answer[x.id] as number[];
  if (!myChoices || myChoices.length === 0) {
    return false;
  }
  return x.customQuestionInfo.choices.every((y, yi) => y.right ? myChoices.indexOf(yi) >= 0 : myChoices.indexOf(yi) === -1);
}


const propScoreValue = prop('scoreValue');


export default function computeQuestionScores (
  classifyQuestions: ClassifyQuestions,
  answer: API__ExamResult.ExamResultAnswerInfoParsed,
) {
  const singles = classifyQuestions.singles.filter(x => singleQuestionIsRight(x, answer));
  const multiples = classifyQuestions.multiples.filter(x => multiQuestionIsRight(x, answer));
  const shorts = classifyQuestions.shorts;

  /** 做对的单选题总分 */
  const rightSingleScore = sum(singles.map(propScoreValue));
  /** 做对的多选题总分 */
  const rightMultiScore = sum(multiples.map(propScoreValue));
  /** 简答题总分 */
  const shortScore = sum(shorts.map(propScoreValue));
  /** 总分 */
  const totalScore = sum([...classifyQuestions.singles, ...classifyQuestions.multiples, ...classifyQuestions.shorts].map((x) => x.scoreValue) || []);
  /** 选择题总分 */
  const choiceTotalScore = totalScore - shortScore;
  /** 做对的选择题总分 */
  const rightChoicesTotalScore = rightSingleScore + rightMultiScore;

  return {
    singles, multiples, shorts,
    rightSingleScore,
    rightMultiScore,
    shortScore,
    totalScore,
    choiceTotalScore,
    rightChoicesTotalScore,
  };
}
