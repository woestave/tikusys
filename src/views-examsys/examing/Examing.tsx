import { functionalComponent } from '@/utils/functional-component';
import './Examing.less';
import { useRoute } from 'vue-router';
import { useRequest } from '@/hooks/use-request';
import examsysServices from '@/apis/services/examsys';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { filterIsShortQuestion, ShortQuestionModel } from 'common-packages/models/question-model-short';
import { filterMultiChoiceQuestion, filterSingleChoiceQuestion } from 'common-packages/models/question-model-choice';
import { ChoiceQuestionModel } from 'common-packages/models/question-model-choice';
import { NButton, NCard, NCheckbox, NCheckboxGroup, NH1, NH2, NH3, NInput, NLi, NModal, NOl, NP, NRadioButton, NRadioGroup, NRow, NSpace, NText, NUl, useDialog, useMessage, useNotification } from 'naive-ui';
import { formatMsToHMS } from '@/utils/HMS';
import { T, prop, sum } from 'ramda';
import { examResultServices } from '@/apis/services/exam-result';
import { globalLoading } from '@/utils/create-loading';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import LeftTime from './components/LeftTime';
import { sleep } from 'common-packages/utils/sleep';

const propScoreValue = prop('scoreValue');

export default functionalComponent(() => {

  const route = useRoute();

  const dialog = useDialog();

  const notification = useNotification();

  const commonDataPinia = useCommonDataPinia();

  const loadingDetail = globalLoading.useCreateLoadingKey({ name: '加载考试详细信息...', });
  const loadingTiList = globalLoading.useCreateLoadingKey({ name: '加载考试试题列表...', });
  loadingDetail.show();
  loadingTiList.show();

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

  const [ examTiList, examTiListPromise, examTiListPromiseStatus, ] = useRequest(examDetailPromise.then((res) => {
    return examsysServices.getTiListByPaperId({ id: res.examExampaperId });
  }).finally(loadingTiList.hide));

  const [ examResult, examResultPromise, examResultPromiseStatus, ] = useRequest(examDetailPromise.then((res) => {
    return examsysServices.getMyExamResult({ id: res.id, });
  }));
  const [ userInfo ] = useRequest(examsysServices.getUserInfo());

  examResultPromise.then((examResult) => {
    console.log(examResult);
    // if (examResult && typeof examResult.examResultAnswerInfo === 'object') {
    if (examResult && typeof examResult.examResultAnswerInfo === 'string') {
      answer.value = JSON.parse(
        examResult
        .examResultAnswerInfo
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
      );
      submitted.value = true;
      examResultModal.value = true;
    }
  });

  const questions = computed(() => {
    const shorts = (examTiList.value?.tiList.filter(filterIsShortQuestion) || []) as Array<ShortQuestionModel & API__Tiku.TableStruct__Tiku>;
    const singles = (examTiList.value?.tiList.filter(filterSingleChoiceQuestion) || []) as Array<ChoiceQuestionModel & API__Tiku.TableStruct__Tiku>;
    const multiples = (examTiList.value?.tiList.filter(filterMultiChoiceQuestion) || []) as Array<ChoiceQuestionModel & API__Tiku.TableStruct__Tiku>;

    return {
      singles,
      multiples,
      shorts,
    };
  });


  const answer = ref<Record<number, number[] | number | string>>({});

  window.setAnswer = function (__arg: string | object) {
    if (typeof __arg === 'string') {
      try {
        const parsed = JSON.parse(__arg.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
        answer.value = parsed;
        submitted.value = true;
      } catch (e) {
        console.error(e);
      }
    } else if (typeof __arg === 'object') {
      answer.value = __arg as any;
      submitted.value = true;
    }
  };

  /**
   * 判断单选题是否答对
   */
  function singleQuestionIsRight (x: ChoiceQuestionModel) {
    return x.customQuestionInfo.choices[answer.value[x.id] as number]?.right;
  }
  /**
   * 判断多选题是否答对
   */
  function multiQuestionIsRight (x: ChoiceQuestionModel) {
    const myChoices = answer.value[x.id] as number[];
    if (!myChoices || myChoices.length === 0) {
      return false;
    }
    return x.customQuestionInfo.choices.every((y, yi) => y.right ? myChoices.indexOf(yi) >= 0 : myChoices.indexOf(yi) === -1);
  }

  const submitted = ref(false);
  const examResultModal = ref(false);

  const isNotStart = computed(() => +new Date() < examDetail.value?.examDate!);

  const answerResult = computed(() => {
    const singles = questions.value.singles.filter(singleQuestionIsRight);
    const multiples = questions.value.multiples.filter(multiQuestionIsRight);
    const shorts = questions.value.shorts;

    /** 做对的单选题总分 */
    const rightSingleScore = sum(singles.map(propScoreValue));
    /** 做对的多选题总分 */
    const rightMultiScore = sum(multiples.map(propScoreValue));
    /** 简答题总分 */
    const shortScore = sum(shorts.map(propScoreValue));
    /** 总分 */
    const totalScore = sum(examTiList.value?.tiList.map((x) => x.scoreValue) || []);
    /** 选择题总分 */
    const choiceTotalScore = totalScore - shortScore;
    /** 做对的选择题总分 */
    const rightChoicesTotalScore = rightSingleScore + rightMultiScore;

    const res = {
      singles, multiples, shorts,
      rightSingleScore,
      rightMultiScore,
      shortScore,
      totalScore,
      choiceTotalScore,
      rightChoicesTotalScore,
    };

    return res;
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

  function getQuestionResultPrefix<Q extends API__Tiku.TableStruct__Tiku> (q: Q, isRight: (q: Q) => boolean) {
    if (!submitted.value) {
      return null;
    }
    return q.id in answer.value ? (
      isRight(q) ? null : (<span style="color: red;">×</span>)
    ) : (<span style="color: yellow;">(未作答)</span>);
  }

  function onSubmit () {
    console.log(answer.value);
    function confirm () {
      examResultServices
        .create({ id: examDetail.value?.id!, answerInfo: answer.value, })
        .then((res) => {
          localStorage.removeItem(LOCAL_ANSWER_KEY);
          notification.success({ title: '提交成功', duration: 2400, });
          examResultModal.value = true;
          submitted.value = true;
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
      confirm();
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
  async function onUpdateAnswer () {
    await sleep();
    if (!submitted.value) {
      localStorage.setItem(LOCAL_ANSWER_KEY, JSON.stringify({
        id: Number(route.params.examinationId),
        answer: answer.value,
      }));
    }
    console.log(!submitted.value);
  }
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
              <NText>已交卷</NText>
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
        <NRow justifyContent="flex-start">
          <NText>{examDetail.value?.examDate && new Date(examDetail.value.examDate).toLocaleDateString()}</NText>
          <NText style="margin-left: 12px;">时长{examDetail.value?.examDuration}分钟</NText>
        </NRow>

        <NH3>单选题</NH3>
        <NOl class="single-question-list">
          {questions.value.singles.map((x) => (
            <NLi style={{ marginTop: '64px' }}>
              <NP>
                {getQuestionResultPrefix(x, singleQuestionIsRight)}{x.tName}
                <span style="font-size: 12px; color: gray;">({x.scoreValue}分)</span>
              </NP>
              <NSpace vertical itemStyle="overflow-y: hidden; overflow-x: auto;">
                <NRadioGroup
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
                {getQuestionResultPrefix(x, multiQuestionIsRight)}{x.tName}
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
                  <NP>选择题： {answerResult.value.rightChoicesTotalScore}分 满分{answerResult.value.choiceTotalScore}分</NP>
                  <NP>主观题： ?/{answerResult.value.shortScore}分 请等待老师阅卷</NP>
                  <NP>
                    <NText>本次考试可重复答卷，</NText>
                    <NButton text type="primary" onClick={onClickRepeatExam}>清除考试记录并重新答题</NButton>
                  </NP>
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
