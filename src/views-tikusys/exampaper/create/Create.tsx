import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import {
  FormInst,
  FormRules,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  InputNumberProps,
  NDivider,
  SelectProps,
  NPopover,
  NText,
  NIcon,
  NRow,
  InputProps,
  PopoverInst,
  useMessage,
} from 'naive-ui';
import { computed, ref } from 'vue';
import './Create.less';
import { WarningOutline, } from '@vicons/ionicons5';
import { omit, prop, sum } from 'ramda';
import { ChoiceQuestionModel, filterMultiChoiceQuestion, filterSingleChoiceQuestion } from 'common-packages/models/question-model-choice';
import { ShortQuestionModel, filterIsShortQuestion } from 'common-packages/models/question-model-short';
import { BaseCustomQuestionInfo, QuestionModel } from 'common-packages/models/question-model-base';
import { NumberAnimation } from '@/components/NumberAnimation';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { ChoiceQuestionContent, QuestionContentTooltip, ShortAnswerQuestionContent } from '@/components/QuestionContentBase';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { SelectBaseOption } from 'naive-ui/es/select/src/interface';
import { globalLoading } from '@/utils/create-loading';
import { exampaperServices } from '@/apis/services/exampaper';
import { tikuServices } from '@/apis/services/tiku';
import { useRoute, useRouter } from 'vue-router';


const CONFIGS = {
  paperName: {
    maxlength: 30,
    minlength: 1,
    showCount: true,
    clearable: true,
  },
  paperTotalScore: {
    precision: 0,
    min: 1,
    max: 1000,
  } as InputNumberProps,
  chooseQuestionSelect: {
    menuProps: {
      class: 'global--naive-select-menu-inline',
    },
    multiple: true,
    clearable: true,
    virtualScroll: false,
    filterable: true,
    valueField: 'id',
    labelField: 'tName',
    // renderLabel: (props: { label: string; value: string | number; target: ChoiceQuestionModel; }) => {
  } as SelectProps,
  paperDesc: {
    maxlength: 50,
    minlength: 0,
    showCount: true,
    autosize: {
      minRows: 3,
      maxRows: 5,
    },
  } as InputProps,
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
interface PaperQuestionInfo {
  singleChoiceQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
  multiChoiceQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
  shortAnswerQuestions: Array<API__Tiku.DefaultQuestionModel['id']>;
}

function getEmptyQuestionInfos (): PaperQuestionInfo {
  return {
    singleChoiceQuestions: [],
    multiChoiceQuestions: [],
    shortAnswerQuestions: [],
  };
}


/**
 * 生成试卷
 */
export default functionalComponent(() => {
  const formRef = ref<FormInst | null>(null);

  const commonDataPinia = useCommonDataPinia();

  const model = ref<Omit<API__Exampaper.CreateReq, 'paperQuestionIds'> & { paperQuestionInfo: PaperQuestionInfo; }>({
    paperId: 0,
    paperName: '',
    paperPhase: null,
    paperDesc: null,
    paperMajor: null,
    paperTotalScore: 100,
    paperQuestionInfo: getEmptyQuestionInfos(),
  });



  const route = useRoute();
  const router = useRouter();

  const editingPaperId = route.params.paperId;
  // const fromTid = route.query.fromTid;
  const getEditingLoading = globalLoading.useCreateLoadingKey({ name: '获取试卷信息...', });
  if (editingPaperId) {
    getEditingLoading.show();
    exampaperServices.getById({ id: +editingPaperId, }).then((res) => {
      if (res.data.paperItem) {
        model.value = {
          ...res.data.paperItem,
          paperQuestionInfo: getEmptyQuestionInfos(),
        };
        res.data.paperItem.paperMajor && getTiList(res.data.paperItem.paperMajor).then(() => {
          model.value.paperQuestionInfo.singleChoiceQuestions = res.data.tiListOfThisPaper.filter(filterSingleChoiceQuestion).map(x => x.id);
          model.value.paperQuestionInfo.multiChoiceQuestions = res.data.tiListOfThisPaper.filter(filterMultiChoiceQuestion).map(x => x.id);
          model.value.paperQuestionInfo.shortAnswerQuestions = res.data.tiListOfThisPaper.filter(filterIsShortQuestion).map(x => x.id);
        });
      }
    }).finally(getEditingLoading.hide);
  }





  const getTiListByMajorLoading = globalLoading.useCreateLoadingKey({ name: () => `获取试题列表...`, });
  /**
   * 切换专业，去获取所属专业的题
   */
  const [ tiList, getTiList, getTiListStatus ] = useCallbackP((major: number) => {
    getTiListByMajorLoading.show();
    model.value.paperQuestionInfo.singleChoiceQuestions = [];
    model.value.paperQuestionInfo.multiChoiceQuestions = [];
    model.value.paperQuestionInfo.shortAnswerQuestions = [];
    return tikuServices
      .list({ major, })
      .then((res) => res.data?.list || [])
      .finally(getTiListByMajorLoading.hide);
  });

  const __findQuestionById = function (arr: QuestionModel<BaseCustomQuestionInfo>[]) {
    return function (id: number) {
      return arr.find(x => x.id === id)!;
    }
  }

  const scores = computed(() => {
    const info = model.value.paperQuestionInfo;
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

  const rules: FormRules = {
    paperName: {
      required: true,
      trigger: ['blur', 'input'],
      whitespace: true,
      min: CONFIGS.paperName.minlength,
      max: CONFIGS.paperName.maxlength,
      message: '请输入试卷名称',
    },
    paperMajor: {
      required: true,
      type: 'number',
      trigger: ['blur', 'input'],
      message: '请选择所属专业',
    },
    paperPhase: {
      required: false,
      type: 'number',
      trigger: ['blur', 'input'],
      message: '请选择所属阶段',
    },
    paperDesc: {
      required: false,
      type: 'string',
      whitespace: true,
      trigger: ['blur', 'input'],
      message: '不合法的试卷描述',
    },
    // examClass: {
    //   required: true,
    //   type: 'array',
    //   trigger: ['blur', 'input'],
    //   message: '请选择考试班级',
    // },
    // examDate: {
    //   required: true,
    //   type: 'number',
    //   trigger: ['blur', 'input'],
    //   message: '请选择开考时间',
    // },
    // examDuration: {
    //   required: true,
    //   type: 'number',
    //   trigger: ['blur', 'input'],
    //   message: '请输入考试时长',
    // },
    paperTotalScore: {
      required: true,
      type: 'number',
      trigger: ['blur', 'input'],
      message: '请输入试卷分值',
    },
  };

  const singleChoiceQuestions = computed(() => tiList.value?.filter(filterSingleChoiceQuestion) || []);

  const multiChoiceQuestions = computed(() => tiList.value?.filter(filterMultiChoiceQuestion) || []);

  const shortQuestions = computed(() => tiList.value?.filter(filterIsShortQuestion) || []);


  const createPaperLoading = globalLoading.useCreateLoadingKey({ name: '新建试卷...', });

  const notEqTotalScorePopover = ref<PopoverInst>();

  const message = useMessage();

  function onClear () {
    // model.value.id = 0;
    model.value.paperName = '';
    model.value.paperPhase = null;
    model.value.paperDesc = null;
    model.value.paperMajor = null;
    model.value.paperTotalScore = 100;
    model.value.paperQuestionInfo = getEmptyQuestionInfos();
  }

  function onSubmit () {
    formRef
      .value
      ?.validate()
      .then(() => {
        if (scores.value.notEqTotalScore) {
          notEqTotalScorePopover.value?.setShow(true);
          return Promise.reject('notEqTotalScore');
        }
      })
      .then(() => {
        createPaperLoading.show();
        exampaperServices
          .createOrUpdate({
            ...omit(['paperQuestionInfo'], model.value),
            paperQuestionIds: [
              ...model.value.paperQuestionInfo.singleChoiceQuestions,
              ...model.value.paperQuestionInfo.multiChoiceQuestions,
              ...model.value.paperQuestionInfo.shortAnswerQuestions,
            ],
          })
          .then((res) => {
            console.log('牛逼', res);
            onClear();
            message.success(editingPaperId ? '编辑试卷成功' : '新建试卷成功');
            editingPaperId && router.back();
          }).finally(createPaperLoading.hide);
      });
  }


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
        <NFormItem label="试卷名称" path="paperName">
          <NInput
            v-model:value={model.value.paperName}
            placeholder="请输入试卷名称"
            {...CONFIGS.paperName}
          />
        </NFormItem>
        <NFormItem label="选择专业" path="paperMajor">
          <NSelect
            v-model:value={model.value.paperMajor}
            placeholder="请选择所属专业"
            options={commonDataPinia.majors as []}
            onUpdateValue={getTiList}
          />
        </NFormItem>
        <NFormItem label="单选题" path="singleChoiceQuestion">
          <NSelect
            v-model:value={model.value.paperQuestionInfo.singleChoiceQuestions}
            placeholder={!model.value.paperMajor ? '请先选择所属专业' : '请选择单选题数据'}
            disabled={!model.value.paperMajor}
            loading={getTiListStatus.value === 'pending'}
            options={singleChoiceQuestions.value as []}
            {...CONFIGS.chooseQuestionSelect}
            renderLabel={(x: ChoiceQuestionModel) => (
              <QuestionContentTooltip questionModel={x}>
                <ChoiceQuestionContent questionModel={x} />
              </QuestionContentTooltip>
            )}
          />
        </NFormItem>
        <NFormItem label="多选题" path="multipleChoiceQuestion">
          <NSelect
            v-model:value={model.value.paperQuestionInfo.multiChoiceQuestions}
            placeholder={!model.value.paperMajor ? '请先选择所属专业' : '请选择多选题数据'}
            disabled={!model.value.paperMajor}
            options={multiChoiceQuestions.value as []}
            loading={getTiListStatus.value === 'pending'}
            {...CONFIGS.chooseQuestionSelect}
            renderLabel={(x: ChoiceQuestionModel) => (
              <QuestionContentTooltip questionModel={x}>
                <ChoiceQuestionContent questionModel={x} />
              </QuestionContentTooltip>
            )}
          />
        </NFormItem>
        <NFormItem label="简答题" path="shortAnswerQuestion">
          <NSelect
            v-model:value={model.value.paperQuestionInfo.shortAnswerQuestions}
            placeholder={!model.value.paperMajor ? '请先选择所属专业' : '请选择简答题数据'}
            disabled={!model.value.paperMajor}
            options={shortQuestions.value as []}
            loading={getTiListStatus.value === 'pending'}
            {...CONFIGS.chooseQuestionSelect}
            renderLabel={(x: ShortQuestionModel) => (
              <QuestionContentTooltip questionModel={x}>
                <ShortAnswerQuestionContent questionModel={x} />
              </QuestionContentTooltip>
            )}
          />
        </NFormItem>

        <NFormItem label="所属阶段" path="paperPhase">
          <NSelect
            v-model:value={model.value.paperPhase}
            placeholder="请选择考试阶段(选填)"
            options={commonDataPinia.phases as SelectBaseOption[]}
          />
        </NFormItem>

        <NFormItem label="试卷描述" path="paperDesc">
          <NInput
            type="textarea"
            v-model:value={model.value.paperDesc}
            placeholder="请输入描述(选填)"
            {...CONFIGS.paperDesc}
          />
        </NFormItem>

        {/** 下列被注释的内容 移到`考试管理`页面了 */}
        {/* <NFormItem label="考试班级" path="examClass">
          <NSelect
            v-model:value={model.value.examClass}
            multiple
            clearable
            placeholder="请选择考试班级"
            options={commonDataPinia.classes as SelectBaseOption[]}
          />
        </NFormItem> */}

        {/* <NGrid xGap={24}>
          <NFormItemGi span={14} label="开考时间" path="examDate">
            <NDatePicker
              class="exam-date"
              v-model:value={model.value.examDate}
              type="datetime"
              clearable
            />
          </NFormItemGi>
          <NFormItemGi span={10} label="考试时长(分钟)" path="examDuration">
            <NInputNumber v-model:value={model.value.examDuration} precision={0} min={1} max={300} />
          </NFormItemGi>
        </NGrid> */}

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
            <NPopover trigger="click" ref={notEqTotalScorePopover} delay={300} disabled={!scores.value.notEqTotalScore}>
              {{
                trigger: () => (
                  <div class="scores-popover-wrap">
                    <NIcon class="scores-warn-icon" color="#e88080" size={16} v-show={scores.value.notEqTotalScore}>
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
                  <span style="color: #e88080;">所有试题的分值总和必须等于试卷分值({model.value.paperTotalScore})。</span>
                ),
              }}
            </NPopover>
          </NRow>
        </NFormItem>

        <div class="form-actions">
          <NButton class="clear-btn" ghost round type="error" onClick={onClear}>清空</NButton>
          <NButton round type="primary" onClick={onSubmit}>提交</NButton>
        </div>
      </NForm>
    </div>
  );
});
