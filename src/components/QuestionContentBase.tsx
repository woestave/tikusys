import { useCommonDataPinia } from '@/store/common-data.pinia';
import { functionalComponent } from '@/utils/functional-component';
import './QuestionContentBase.less';
import { NP, NPopover, NText } from 'naive-ui';
import { BaseCustomQuestionInfo, QuestionModel } from 'common-packages/models/question-model-base';
import { ChoiceQuestionModel } from 'common-packages/models/question-model-choice';
import { getAToZ } from '@/utils/a-to-z';
import { ShortQuestionModel } from 'common-packages/models/question-model-short';
import { globalTextHighlightProcessor } from '@/utils/create-text-highlight-processor';

export interface QuestionContentBaseProps<Q extends QuestionModel<BaseCustomQuestionInfo>> {
  class?: any;
  questionModel: Q;
  highLightTName?: string,
}

export const QuestionContentBase = functionalComponent<QuestionContentBaseProps<QuestionModel<BaseCustomQuestionInfo>>>((props) => {

  const commonDataPinia = useCommonDataPinia();


  return () => (
    <div class={['question-content-base', props.class]}>
      <NP class="ti-name-with-score">
        <span
          class="ti-name-text white-space-pre"
          innerHTML={globalTextHighlightProcessor(props.questionModel.tName || '', props.highLightTName)}
        ></span>
        <span class="score">({props.questionModel.scoreValue}分)</span>
      </NP>
      <NP class="ti-phase-text">{commonDataPinia.getPhaseName(props.questionModel.phase) || '未知阶段'}</NP>
      {props.context.slots.default?.(props.questionModel)}
    </div>
  );
});



interface ChoiceQuestionContentProps extends QuestionContentBaseProps<ChoiceQuestionModel> {}
export const ChoiceQuestionContent = functionalComponent<ChoiceQuestionContentProps>((props) => {

  return () => (
    <QuestionContentBase
      class={['column', props.class]}
      questionModel={props.questionModel}
      highLightTName={props.highLightTName}
    >
      <div class="ti-choices">
        {props.questionModel.customQuestionInfo.choices?.map((y, yi) => (
          <NText class={{ 'ti-choice-item': true, 'white-space-pre': true, right: y.right, }}>
            <span>{getAToZ(yi)}.</span>
            <span innerHTML={globalTextHighlightProcessor(y.label, props.highLightTName)}></span>
          </NText>
        ))}
      </div>
    </QuestionContentBase>
  );
});

interface ShortAnswerQuestionContentProps extends QuestionContentBaseProps<ShortQuestionModel> {}
export const ShortAnswerQuestionContent = functionalComponent<ShortAnswerQuestionContentProps>((props) => {

  return () => (
    <QuestionContentBase questionModel={props.questionModel} class={['column', props.class]}>
      <div class="short-answer-content">
        {null}
      </div>
    </QuestionContentBase>
  );
});



export interface QuestionContentTooltipProps<Q extends QuestionModel<BaseCustomQuestionInfo>> {
  //
  questionModel: Q;
}
export const QuestionContentTooltip: <Q extends QuestionModel<BaseCustomQuestionInfo>>(props: QuestionContentTooltipProps<Q>) => JSX.Element = functionalComponent<QuestionContentTooltipProps<any>>((props) => {

  // const commonDataPinia = useCommonDataPinia();

  return () => (
    <div class="question-content-base row">
      {/* <NP class="ti-name-with-score at-popover">
        <span class="ti-name-text">{props.questionModel.tName}</span>
        <span class="score">({props.questionModel.scoreValue}分)</span>
      </NP> */}
      {(
        <NPopover
          class="question-content-tooltip-popover"
          keepAliveOnHover={false}
          delay={800}
          trigger="hover"
          disabled={!props.context.slots.default}
        >
          {{
            trigger () {
              return (
                // <NIcon class="hover-eye-icon" color="gray">
                //   <EyeSharp />
                // </NIcon>
                <NP class="ti-name-with-score">
                  <span class="ti-name-text">{props.questionModel.tName}</span>
                  <span class="score">({props.questionModel.scoreValue}分)</span>
                </NP>
              );
            },
            default: props.context.slots.default,
          }}
        </NPopover>
      )}
    </div>
  );
});