import { functionalComponent } from '@/utils/functional-component';
import {
  FormInst,
  FormRules,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  InputProps,
  NButton,
  InputNumberProps,
  NP,
  NDivider,
  SelectProps,
  NPopover,
  NText,
  NIcon,
  NRow,
} from 'naive-ui';
import { computed, ref } from 'vue';
import './Create.less';
import { getAToZ } from '@/utils/a-to-z';
import { EyeSharp, WarningOutline, } from '@vicons/ionicons5';
import { prop, sum } from 'ramda';
import { ChoiceQuestionModel, filterMultiChoiceQuestion, filterSingleChoiceQuestion } from '@/model/question-model-choice';
import { ShortQuestionModel, filterIsShortQuestion } from '@/model/question-model-short';
import { BaseCustomQuestionInfo, QuestionModel } from '@/model/question-model-base';
import { NumberAnimation } from '@/components/NumberAnimation';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { getAllQuestions } from '@/mock-datas/all-questions';


const CONFIGS = {
  paperName: {
    maxlength: 30,
    minlength: 1,
    showCount: true,
    clearable: true,
  } as InputProps,
  paperTotalScore: {
    precision: 0,
    min: 1,
  } as InputNumberProps,
  chooseQuestionSelect: {
    multiple: true,
    clearable: true,
    filterable: true,
    valueField: 'id',
    labelField: 'tName',
    // renderLabel: (props: { label: string; value: string | number; target: ChoiceQuestionModel; }) => {
      renderLabel: (x: ChoiceQuestionModel) => {
      return (
        <NText class="global--tName-with-score">
          <span class="ti-name-text">{x.tName}</span>
          <span class="score">({x.scoreValue}分)</span>
          <NPopover class="select-ti-popover" delay={500} trigger="hover">
            {{
              trigger () {
                return (
                  <NIcon class="hover-eye-icon" color="gray">
                    <EyeSharp />
                  </NIcon>
                );
              },
              default () {
                return (
                  <div class="ti-popover-wrap">
                    <NP class="global--tName-with-score at-popover">
                      <span class="ti-name-text">{x.tName}</span>
                      <span class="score">({x.scoreValue}分)</span>
                    </NP>
                    <NP class="ti-phase-text">{x.phase}</NP>
                    <div class="ti-choices">
                      {x.customQuestionInfo.choices?.map((y, yi) => (
                        <NText class={{ 'ti-choice-item': true, right: y.right, }}>{getAToZ(yi)}. {y.label}</NText>
                      ))}
                    </div>
                  </div>
                );
              },
            }}
          </NPopover>
        </NText>
      );
    },
  } as SelectProps,
} as const;



// const toOptional = function<T extends {}, VK extends keyof T, LK extends keyof T> (valueKey: VK, labelKey: LK) {
//   return function (obj: T) {
//     return {
//       value: obj[valueKey] || '',
//       label: obj[labelKey] || '',
//       target: obj,
//     };
//   };
// };





interface ExampaperCreateArguments {
  paperName: null | string;
  examPhase: null | number;
  examClass: number[];
  paperTotalScore: number;
  exampaperInfo: {
    singleChoiceQuestions: Array<ChoiceQuestionModel['id']>;
    multiChoiceQuestions: Array<ChoiceQuestionModel['id']>;
    shortAnswerQuestions: Array<ShortQuestionModel['id']>;
  };
}



/**
 * 生成试卷
 */
export default functionalComponent(() => {
  const formRef = ref<FormInst | null>(null);

  const model = ref<ExampaperCreateArguments>({
    paperName: null,
    examPhase: null,
    examClass: [],
    paperTotalScore: 100,
    exampaperInfo: {
      singleChoiceQuestions: [],
      multiChoiceQuestions: [],
      shortAnswerQuestions: [],
    },
  });

  const __findQuestionById = function (arr: QuestionModel<BaseCustomQuestionInfo>[]) {
    return function (id: number) {
      return arr.find(x => x.id === id)!;
    }
  }

  const scores = computed(() => {
    const info = model.value.exampaperInfo;
    const single = sum(
      info
        .singleChoiceQuestions
        .map(__findQuestionById(singleChoiceQuestions.value))
        .filter(Boolean)
        .map(prop('scoreValue'))
    );
    const multi = sum(
      info
        .multiChoiceQuestions
        .map(__findQuestionById(multiChoiceQuestions.value))
        .filter(Boolean)
        .map(prop('scoreValue'))
    );
    const short = sum(
      info
        .shortAnswerQuestions
        .map(__findQuestionById(shortQuestions.value))
        .filter(Boolean)
        .map(prop('scoreValue'))
    );

    const total = single + multi + short;

    return {
      single, multi, short, total,
      notEqTotalScore: total !== model.value.paperTotalScore,
    };
  });

  const rules: FormRules = {};

  const examPhaseList = computed(() => {
    return ['groode', 'veli good', 'emazing', 'lidiculous'].map((v, i) => ({
      label: v,
      value: i,
    }));
  });

  const examClassList = computed(() => {
    return ['一班', '两班', '三班', '五连鞭'].map((v, i) => ({
      label: v,
      value: i,
    }));
  });

  const allQuestions = getAllQuestions();

  const singleChoiceQuestions = computed(() => allQuestions.filter(filterSingleChoiceQuestion));

  const multiChoiceQuestions = computed(() => allQuestions.filter(filterMultiChoiceQuestion));

  const shortQuestions = computed(() => allQuestions.filter(filterIsShortQuestion));


  function onClear () {}

  function onSubmit () {}


  return () => (
    <div class="exampaper-create">
      <PageTitle />
      <PageSubTitle>选择试题生成试卷</PageSubTitle>
      <NDivider />
      <NForm
        class="exampaper-form"
        ref={formRef}
        model={model.value}
        rules={rules}
        labelPlacement="left"
        labelWidth="auto"
        requireMarkPlacement="right-hanging"
        size="medium"
        style={{
          maxWidth: '640px'
        }}
      >
        <NFormItem label="试卷名称" path="tName">
          <NInput
            v-model:value={model.value.paperName}
            placeholder="请输入试卷名称"
            {...CONFIGS.paperName}
          />
        </NFormItem>
        <NFormItem label="单选题" path="singleChoiceQuestion">
          <NSelect
            menuProps={{
              class: 'global--naive-select-menu-inline',
            }}
            virtualScroll={false}
            v-model:value={model.value.exampaperInfo.singleChoiceQuestions}
            placeholder="请选择单选题数据"
            options={singleChoiceQuestions.value as []}
            {...CONFIGS.chooseQuestionSelect}
          />
        </NFormItem>
        <NFormItem label="多选题" path="multipleChoiceQuestion">
          <NSelect
            menuProps={{
              class: 'global--naive-select-menu-inline',
            }}
            virtualScroll={false}
            v-model:value={model.value.exampaperInfo.multiChoiceQuestions}
            placeholder="请选择多选题数据"
            options={multiChoiceQuestions.value as []}
            {...CONFIGS.chooseQuestionSelect}
          />
        </NFormItem>
        <NFormItem label="简答题" path="shortAnswerQuestion">
          <NSelect
            menuProps={{
              class: 'global--naive-select-menu-inline',
            }}
            virtualScroll={false}
            v-model:value={model.value.exampaperInfo.shortAnswerQuestions}
            placeholder="请选择简答题数据"
            options={shortQuestions.value as []}
            {...CONFIGS.chooseQuestionSelect}
          />
        </NFormItem>

        <NFormItem label="考试阶段" path="examPhase">
          <NSelect
            v-model:value={model.value.examPhase}
            placeholder="请选择考试阶段"
            options={examPhaseList.value}
          />
        </NFormItem>

        <NFormItem label="考试班级" path="examClass">
          <NSelect
            v-model:value={model.value.examClass}
            multiple
            clearable
            placeholder="请选择考试班级"
            options={examClassList.value}
          />
        </NFormItem>

        <NFormItem label="试卷分值" path="paperTotalScore">
          <NInputNumber
            v-model:value={model.value.paperTotalScore}
            placeholder="请设置试卷分值"
            {...CONFIGS.paperTotalScore}
          />
          <NRow
            class={{ 'scores-row': true, warn: scores.value.notEqTotalScore, }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <NPopover trigger="click" delay={300} disabled={!scores.value.notEqTotalScore}>
              {{
                trigger: () => (
                  <div class="scores-popover-wrap">
                    <NIcon class="scores-warn-icon" color="#f2c97d" size={16} v-show={scores.value.notEqTotalScore}>
                      <WarningOutline />
                    </NIcon>
                    <NText class="scores-text">
                      {scores.value.single} + {scores.value.multi}
                      {' + '}
                      <NumberAnimation duration={400} value={scores.value.short} />
                      {' = '}
                      <NumberAnimation duration={1000} value={scores.value.total} />
                    </NText>
                  </div>
                ),
                default: () => (
                  <span style="color: #f2c97d;">所有试题的分值总和必须等于试卷分值({model.value.paperTotalScore})。</span>
                ),
              }}
            </NPopover>
          </NRow>
        </NFormItem>

        <div class="form-actions">
          <NButton class="clear-btn" ghost round type="warning" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
    </div>
  );
});
