import { functionalComponent, useCallbackP, useStateP } from '@/utils/functional-component';
import './Examing.less';
import { useRoute } from 'vue-router';
import { useRequest } from '@/hooks/use-request';
import examsysServices from '@/apis/services/examsys';
import { computed, onMounted, ref } from 'vue';
import { filterIsShortQuestion } from 'common-packages/models/question-model-short';
import { filterMultiChoiceQuestion, filterSingleChoiceQuestion } from 'common-packages/models/question-model-choice';
import { NButton, NCard, NCheckbox, NCheckboxGroup, NH1, NH2, NH3, NInput, NLi, NModal, NOl, NP, NPopconfirm, NRadioButton, NRadioGroup, NRow, NSpace, NText, NUl, useDialog, useMessage, useNotification } from 'naive-ui';
import { T, sum } from 'ramda';
import { examResultServices } from '@/apis/services/exam-result';
import { globalLoading } from '@/utils/create-loading';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import LeftTime from './components/LeftTime';
import { sleep } from 'common-packages/utils/sleep';
import getClassifyQuestions from 'common-packages/helpers/get-classify-questions';
import computeQuestionScores, { multiQuestionIsRight, singleQuestionIsRight } from 'common-packages/helpers/compute-question-scores';
import { throttle } from 'ts-debounce-throttle';
import { withLatestFromP } from '@/utils/promise-operators';


export default functionalComponent(() => {

  const route = useRoute();

  const dialog = useDialog();

  const notification = useNotification();

  const commonDataPinia = useCommonDataPinia();

  const loadingDetail = globalLoading.useCreateLoadingKey({ name: '加载考试详细信息...', });
  const loadingTiList = globalLoading.useCreateLoadingKey({ name: '加载考试试题列表...', });
  loadingDetail.show();

  const [ examDetail, examDetailPromise, examDetailPromiseStatus ] = useRequest(
    examsysServices
      .getExamDetail({ id: Number(route.params.examinationId), })
      .then((res) => {
        if (!(res.data.id && res.data.examName)) {
          return Promise.reject(res);
        }
        return res;
      })
      .finally(loadingDetail.hide)
  );

  const [ examTiList, getExamTiList ] = useCallbackP(() => examDetailPromise.then((res) => {
    loadingTiList.show();
    return examsysServices.getStudentExamTiList({
      exampaperId: res.examExampaperId,
      examinationId: res.id,
    }).then(x => x.data);
  }).finally(loadingTiList.hide));
  getExamTiList();

  const [ , myExamResultPromise, , ] = useRequest(examDetailPromise.then((res) => {
    return examsysServices.getMyExamResult({ id: res.id, });
  }));
  const [ userInfo ] = useRequest(examsysServices.getUserInfo());

  const answerParsedSQ_Marking = ref<API__ExamResult.examResultSQ_MarkingParsed | null>(null);


  /** 考试是否已结束 */
  const [examIsEnded, examIsEndedPromise] = useStateP(examDetailPromise.then((res) => {
    return res.examDate + (res.examDuration * 60 * 1000) < +new Date();
  }));
  /**
   * 是否缺考
   * 逻辑：考试已结束并且查不到该学生的考试结果
   */
  const [examIsAbsent, examIsAbsentPromise] = useStateP(
    myExamResultPromise
    .then(withLatestFromP(examIsEndedPromise))
    .then(([myExamResult, isEnded]) => {
      return !myExamResult && isEnded;
    })
  );
  /**
   * 如果缺考，直接不能提交 但还可以看题
   */
  examIsAbsentPromise.then((isAbsent) => {
    if (isAbsent) {
      submitted.value = true;
    }
  });

  myExamResultPromise.then((examResult) => {
    console.log(examResult);
    // if (examResult && typeof examResult.examResultAnswerInfo === 'object') {
    if (examResult) {
      answer.value = examResult.examResultAnswerInfo;
      try {
        answerParsedSQ_Marking.value = JSON.parse(decodeURIComponent(examResult.examResultSQ_Marking));
      } catch (e) {}
      submitted.value = true;
      examResultModal.value = true;
    }
  });

  const questions = computed(() => {
    return getClassifyQuestions(examTiList.value?.tiList || []);
  });


  const answer = ref<Record<number, number[] | number | string>>({});


  const submitted = ref(false);
  const examResultModal = ref(false);

  const isNotStart = computed(() => +new Date() < examDetail.value?.examDate!);

  const answerResult = computed(() => {
    return computeQuestionScores(questions.value, answer.value);
  });


  const uncommitted = computed(() => {
    return examTiList.value?.tiList.filter((x) => {
      const myChoices = answer.value[x.id];
      if (filterSingleChoiceQuestion(x)) {
        return typeof myChoices !== 'number';
      } else if (filterMultiChoiceQuestion(x)) {
        return !Array.isArray(myChoices) || myChoices.length === 0;
      } else if (filterIsShortQuestion(x)) {
        return typeof myChoices !== 'string' || !myChoices.trim();
      } else {
        return false;
      }
    }) || [];
  });

  function getQuestionResultPrefix<Q extends API__Tiku.TableStruct__Tiku> (q: Q, isRight: (q: Q, a: API__ExamResult.ExamResultAnswerInfoParsed) => boolean) {
    if (!submitted.value) {
      return null;
    }
    return q.id in answer.value ? (
      isRight(q, answer.value) ? null : (<span style="color: red;">×</span>)
    ) : (<span style="color: yellow;">(未作答)</span>);
  }

  function onSubmit () {
    console.log(answer.value);
    function confirm () {
      examResultServices
        .create({
          examinationId: examDetail.value?.id!,
          exampaperId: examDetail.value?.examExampaperId!,
          answerInfo: answer.value,
          // choiceQuestionScore: answerResult.value.rightChoicesTotalScore,
        })
        .then((res) => {
          getExamTiList().then(() => {
            localStorage.removeItem(LOCAL_ANSWER_KEY);
            notification.success({ title: '提交成功', duration: 2400, });
            examResultModal.value = true;
            submitted.value = true;
          });
        });
    }
    if (uncommitted.value.length) {
      dialog.warning({
        title: '警告',
        content: () => (
          <>
            <NUl>
              {uncommitted.value.map((x) => (
                <NLi style="color: gray; font-size: 12px; font-style: italic;">{x.tName}</NLi>
              ))}
            </NUl>
            <NP>以上试题未作答，确认提交？</NP>
          </>
        ),
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          // alert('牛逼！');
          confirm();
        },
        onNegativeClick: () => {},
      });
    } else {
      dialog.warning({
        title: '提示',
        content: () => '确认交卷？',
        positiveText: '是',
        negativeText: '否',
        onPositiveClick: confirm,
      });
    }
  }

  const loadingRepeat = globalLoading.useCreateLoadingKey({ name: '重新考试...' });

  function onClickRepeatExam () {
    loadingRepeat.show();
    examDetailPromise.then((res) => {
      return examsysServices.removeMyExamResult({ id: res.id }).then(() => {
        localStorage.removeItem(LOCAL_ANSWER_KEY);
        location.reload();
      });
    }).finally(loadingRepeat.hide);
  }

  /**
   * 做题进度实时保存到本地，刷新后不会丢失
   */
  const LOCAL_ANSWER_KEY = 'RSD_EXAMSYS_ANSWER_KEY';
  const message = useMessage();
  const onUpdateAnswer = throttle(async () => {
    await sleep();
    if (!submitted.value) {
      localStorage.setItem(LOCAL_ANSWER_KEY, JSON.stringify({
        id: Number(route.params.examinationId),
        answer: answer.value,
      }));
    }
    console.log(!submitted.value);
  }, 3000);
  onMounted(() => {
    const localAnswer = localStorage.getItem(LOCAL_ANSWER_KEY);
    if (typeof localAnswer === 'string') {
      try {
        const answerJSONParsed = JSON.parse(localAnswer);
        if (answerJSONParsed.id === Number(route.params.examinationId)) {
          answer.value = answerJSONParsed.answer;
        }
      } catch (e) {
        message.error('做题进度数据回显失败');
      }
    }
  });




  return () => (
    <div class="examing">
      {/* <pre>
      {JSON.stringify(examDetail.value, null, 2)}
      </pre> */}
      <If condition={isNotStart.value && examDetailPromiseStatus.value === 'fulfilled'}>
        <NH1>考试未开始</NH1>
      </If>
      <ElseIf condition={examDetailPromiseStatus.value === 'fulfilled'}>
        <div class="countdown">
          <If condition={isNotStart.value}>
            <NH1>未开始</NH1>
          </If>
          <ElseIf condition={submitted.value}>
            <NH1>
              <NText>{examIsAbsent.value ? '缺考' : '已交卷'}</NText>
              <NButton text style="margin-left: 12px; pointer-events: all;" type="primary" onClick={() => {
                examResultModal.value = true;
              }}>查看结果</NButton>
            </NH1>
          </ElseIf>
          <Else>
            <LeftTime
              examDate={examDetail.value?.examDate || 0}
              examDuration={examDetail.value?.examDuration || 0}
              onStart={(onstart) => examDetailPromise.then(onstart)}
            />
          </Else>
        </div>
        <NH1>{examDetail.value?.examName}</NH1>
        <NP>{examDetail.value?.examDesc}</NP>
        <NP>总分值{answerResult.value.totalScore}</NP>
        <NRow justifyContent="flex-start">
          <NText>
            {examDetail.value?.examDate && new Date(examDetail.value.examDate).toLocaleString()}
            ——
            {examDetail.value?.examDate && new Date(examDetail.value.examDate + (examDetail.value.examDuration * 60 * 1000)).toLocaleString()}
          </NText>
          <NText style="margin-left: 12px;">时长{examDetail.value?.examDuration}分钟</NText>
        </NRow>

        <NH3>单选题</NH3>
        <NOl class="single-question-list">
          {questions.value.singles.map((x) => (
            <NLi style={{ marginTop: '64px' }}>
              <NP>
                <span class="white-space-pre">{getQuestionResultPrefix(x, singleQuestionIsRight)}{x.tName}</span>
                <span style="font-size: 12px; color: gray;">({x.scoreValue}分)</span>
              </NP>
              <NSpace vertical itemStyle="overflow-y: hidden; overflow-x: auto;">
                <NRadioGroup
                  class="single-question-radio-group"
                  v-model:value={answer.value[x.id]}
                  disabled={submitted.value}
                  onUpdateValue={onUpdateAnswer}
                >
                  {x.customQuestionInfo.choices.map((y, yi) => (
                    <NRadioButton
                      key={yi}
                      value={yi}
                      label={y.label}
                      class={{
                        'single-question-radio-button': true,
                        'white-space-pre': true,
                        answered: x.id in answer.value,
                        wrong: submitted.value && !y.right && yi === answer.value[x.id],
                        right: submitted.value && y.right,
                      }}
                    />
                  ))}
                </NRadioGroup>
              </NSpace>
            </NLi>
          ))}
        </NOl>

        <NH3 style={{ marginTop: '64px' }}>多选题</NH3>
        <NOl class="multi-question-list">
          {questions.value.multiples.map((x) => (
            <NLi style={{ marginTop: '64px', }}>
              <NP>
                <span class="white-space-pre">{getQuestionResultPrefix(x, multiQuestionIsRight)}{x.tName}</span>
                <span style="font-size: 12px; color: gray;">({x.scoreValue}分)</span>
              </NP>
              <NCheckboxGroup
                v-model:value={answer.value[x.id]}
                disabled={submitted.value}
                onUpdateValue={onUpdateAnswer}
              >
                <NSpace item-style="display: flex;">
                  {x.customQuestionInfo.choices.map((y, yi) => (
                    <NCheckbox
                      value={yi}
                      label={y.label}
                      class={{
                        'multi-question-checkbox': true,
                        'white-space-pre': true,
                        answered: x.id in answer.value,
                        wrong: submitted.value && !y.right && (answer.value[x.id] as number[])?.includes(yi),
                        right: submitted.value && y.right,
                      }}
                    />
                  ))}
                </NSpace>
              </NCheckboxGroup>
            </NLi>
          ))}
        </NOl>

        <NH3 style={{ marginTop: '64px' }}>简答题</NH3>
        <NOl>
          {questions.value.shorts.map((x) => (
            <NLi key={'short_' + x.id}>
              <NP>
                {getQuestionResultPrefix(x, T)}{x.tName}
                <span style="font-size: 12px; color: gray;">({x.scoreValue}分)</span>
              </NP>
              <NInput
                v-model:value={answer.value[x.id]}
                disabled={submitted.value}
                showCount
                maxlength={999}
                placeholder={submitted.value ? '' : '请输入答案内容'}
                onUpdateValue={onUpdateAnswer}
                autosize={{
                  maxRows: 10,
                  minRows: 3,
                }}
                type="textarea"
              />
            </NLi>
          ))}
        </NOl>
        <div class="fotm-actions">
          <NButton
            // round
            type={uncommitted.value.length ? 'error' : 'primary'}
            block
            disabled={submitted.value}
            onClick={onSubmit}
          >{submitted.value ? '已交卷' : '交卷'}</NButton>
        </div>

        <NModal show={examResultModal.value} maskClosable={false}>
          <NCard
            style="width: 600px"
            title="考试结果"
            bordered={false}
            size="huge"
            closable
            onClose={() => {
              examResultModal.value = false;
            }}
            role="dialog"
            aria-modal="true"
          >
            {{
              default: () => (
                <div>
                  <If condition={examIsAbsent.value}>
                    <NH1>缺考</NH1>
                  </If>
                  <Else>
                    <NP>
                      <span>选择题： {answerResult.value.rightChoicesTotalScore}</span>
                      <span style="font-size: 12px; font-style: italic; color: gray; margin-left: 6px;">(满分{answerResult.value.choiceTotalScore})</span>
                    </NP>
                    {answerParsedSQ_Marking.value ? (function () {
                      const SQ_Score = sum(
                        Object
                          .keys(answerParsedSQ_Marking.value)
                          .map(key => answerParsedSQ_Marking.value?.[key as any])
                          .filter(x => typeof x === 'number') as number[]
                      );
                      return (
                        <>
                          <NP><span>主观题： {SQ_Score}</span>
                          <span style="font-size: 12px; font-style: italic; color: gray; margin-left: 6px;">(满分{answerResult.value.shortTotalScore})</span>
                        </NP>
                          <NH2>总计{answerResult.value.rightChoicesTotalScore + SQ_Score}分</NH2>
                        </>
                      )
                    })() : (
                      <NP>主观题： ?/{answerResult.value.shortTotalScore}分 请等待老师阅卷</NP>
                    )}
                  </Else>
                  {!!examDetail.value?.examIsRepeatable && !examIsEnded.value && <NP>
                    <NText>本次考试可重复答卷，</NText>
                    <NPopconfirm
                      onPositiveClick={onClickRepeatExam}
                    >
                      {{
                        trigger: () => <NButton text type="primary">清除考试记录并重新答题</NButton>,
                        default: () => '确认重新答卷吗？',
                      }}
                    </NPopconfirm>
                  </NP>}
                </div>
              ),
            }}
          </NCard>
        </NModal>
      </ElseIf>
      <Else>
        <NH1>页面不能展示</NH1>
        <NOl>
          <NLi>输入的数据有误</NLi>
          <NLi>
            <span>查看权限不足，请确认所在班级</span>
            <span style="font-style: italic; color: #009688; padding: 0 4px;">{
              commonDataPinia.classes.find(x => x.value === userInfo.value?.userInfo.studentClass)?.label
            }</span>
            <span>包含该考试信息的权限</span>
          </NLi>
        </NOl>
      </Else>
    </div>
  );
});
