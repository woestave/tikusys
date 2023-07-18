import { examResultServices } from '@/apis/services/exam-result';
import { useRequest } from '@/hooks/use-request';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useState } from '@/utils/functional-component';
import { filterIsShortQuestion } from 'common-packages/models/question-model-short';
import { NButton, NH1, NH2, NH4, NH5, NInputNumber, NLi, NModal, NOl, NP, NTable, NText, useMessage } from 'naive-ui';
import { dec, inc } from 'ramda';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import './Correcting.less';
import { Click } from '@vicons/tabler';
import { ChoiceQuestionModel, filterIsChoiceQuestion } from 'common-packages/models/question-model-choice';
import { getAToZ } from '@/utils/a-to-z';

/**
 * 老师阅卷
 */
export default functionalComponent(() => {

  const route = useRoute();

  const examinationId = route.query.examinationId;

  /**
   * 查看全部明细弹窗控制器
   */
  const [showAllTable, setShowAllTable] = useState(false);
  /**
   * 查看该学生的选择题详细 值为index
   */
  const [showChoiceQuestionDetailIndex, setShowChoiceQuestionDetailIndex] = useState(-1);
  const closeChoiceQuestionDetail = () => setShowChoiceQuestionDetailIndex(-1);

  // const [userInfo, userInfoPromise] = useRequest(personnelServices.getUserInfo());
  const myExamResultLoading = globalLoading.useCreateLoadingKey({ name: '获取学生考试信息...' });
  myExamResultLoading.show();

  const [myExamResult, myExamResultPromise] = useRequest(
    examResultServices
    .getTeacherCorrecting({ examinationId: Number(examinationId) })
    .finally(myExamResultLoading.hide)
  );

  myExamResultPromise.then((res) => {
    return res.list.filter(x => x.examResultSQ_Marking).forEach((x) => {
      const parsed = JSON.parse(decodeURIComponent(x.examResultSQ_Marking)) as API__ExamResult.examResultSQ_MarkingParsed;
      answerResult.value[x.examResultStudentId] = parsed;
    });
  }).catch((err) => {
    message.error(err?.errMsg)
    console.log(err);
  });

  const studentAnswer = computed(() => {
    return myExamResult.value?.list.map((item) => {
      return {
        studentId: +item.examResultStudentId,
        studentName: myExamResult.value?.studentList.find((x) => +x.studentId === +item.examResultStudentId)?.studentName,
        answer: JSON.parse(decodeURIComponent(item.examResultAnswerInfo)) as API__ExamResult.ExamResultAnswerInfoParsed,
        examResult: item,
      };
    }) || [];
  });

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const currentStudent = computed(() => myExamResult.value?.studentList.find(x => x.studentId === studentAnswer.value[currentStudentIndex.value]?.studentId));

  const choices = computed(() => myExamResult.value?.tiList.filter(filterIsChoiceQuestion) as any as ChoiceQuestionModel[]);
  const shorts = computed(() => myExamResult.value?.tiList.filter(filterIsShortQuestion));

  const answerResult = ref<Record<API__Student.TableStruct__Student['studentId'], Record<API__Tiku.TableStruct__Tiku['id'], number>>>({});

  const canSubmitCurrent = computed(() => {
    const student = currentStudent.value;
    if (!student) {
      return null;
    }
    return shorts.value?.every(q => typeof answerResult.value[student.studentId]?.[q.id] === 'number');
  });

  function getStudentScoreByStudentIndex (index: number) {
    const choiceScore = studentAnswer.value[index]?.examResult.examResultChoiceQuestionScore ?? null;
    const shortScoreMap = answerResult.value[studentAnswer.value[index]?.studentId] || null;
    const __shortScore = Object.keys(shortScoreMap || {}).reduce((score, currTid) => {
      return score + shortScoreMap[+currTid];
    }, 0);

    const shortScore = shortScoreMap ? __shortScore : null;

    return {
      choiceScore,
      shortScore,
      totalScore: typeof choiceScore === 'number' && typeof shortScore === 'number' ? choiceScore + shortScore : null,
      /** 是否全部题都判分了 */
      shortScoreAllRight: shorts.value?.every(q => typeof answerResult.value[studentAnswer.value[index]?.studentId]?.[q.id] === 'number') || false,
    };
  }
  const currentStudentScore = computed(() => {
    return getStudentScoreByStudentIndex(currentStudentIndex.value);
  });

  const allTableOverview = computed(() => {
    return studentAnswer.value.map((x, i) => ({
      studentId: x.studentId,
      studentName: x.studentName,
      index: i,
      scores: getStudentScoreByStudentIndex(i),
    }));
  });


  const submitLoading = globalLoading.useCreateLoadingKey({ name: '保存中...' });
  const message = useMessage();
  function onSubmitCurrent () {
    const currentExamResult = myExamResult.value?.list.find(x => +x.examResultStudentId === +currentStudent.value?.studentId!);
    if (currentExamResult) {
      submitLoading.show();
      examResultServices.saveStudentExamResult({
        examResultId: currentExamResult.examResultId,
        SQMarking: answerResult.value[currentExamResult.examResultStudentId],
      }).then(() => {
        message.success('保存成功');
      }).finally(submitLoading.hide);
    }
  }

  function onCheckStudent (studentId: API__Student.TableStruct__Student['studentId']) {
    const targetIndex = studentAnswer.value.findIndex(y => y.studentId === studentId);
    if (targetIndex > -1 && currentStudentIndex.value !== targetIndex) {
      setCurrentStudentIndex(targetIndex);
    }
  }

  function onNext () {
    setCurrentStudentIndex(inc);
  }
  function onPrev () {
    setCurrentStudentIndex(dec);
  }


  return () => (
    <div class="correcting">
      <NH1>{myExamResult.value?.examination.examName}</NH1>
      <NH5>{myExamResult.value?.examination.examDesc}</NH5>
      <NP>
        <NButton text type="info" onClick={() => setShowAllTable(true)}>查看总览</NButton>
      </NP>
      <div class="student-item">
        <NH2>考生姓名：{
          studentAnswer.value.map((x, i) => (
            <NButton
              class={{'student-btn': true, active: x.studentId === currentStudent.value?.studentId}}
              text
              onClick={() => onCheckStudent(x.studentId)}
            >{x.studentName}</NButton>
          ))}
        </NH2>
        <NP>
          <NText>选择题得分：{currentStudentScore.value.choiceScore ?? '-'}分</NText>
          <NButton text type="info" style="margin-left: 12px;" onClick={() => setShowChoiceQuestionDetailIndex(currentStudentIndex.value)}>查看详细</NButton>
        </NP>
        <NP>学生最终得分：{console.log(currentStudentScore)}{
          typeof currentStudentScore.value.totalScore === 'number'
            ? currentStudentScore.value.totalScore
            : '-'
        }分</NP>
        <NOl>
          {shorts.value?.map((x, i) => {
            const targetAnswer = studentAnswer.value[currentStudentIndex.value]?.answer;
            return (
              <NLi style="margin-top: 48px;">
                <NH4>
                  <NText>{x.tName}</NText>
                  <NText style="font-size: 12px; font-style: italic; color: lightgreen;">({x.scoreValue}分)</NText>
                </NH4>
                <NP>{targetAnswer?.[x.id]}</NP>
                <div>
                  <NInputNumber
                    placeholder="请输入得分"
                    value={answerResult.value[currentStudent.value?.studentId || -999]?.[x.id] ?? null}
                    onUpdateValue={value => {
                      if (answerResult.value[currentStudent.value?.studentId || -1000]?.[x.id]) {
                        answerResult.value[currentStudent.value!.studentId][x.id] = value!;
                      } else if (currentStudent.value?.studentId) {
                        answerResult.value[currentStudent.value.studentId] = {
                          ...answerResult.value[currentStudent.value.studentId],
                          [x.id]: value!,
                        };
                      }
                    }}
                    min={0}
                    max={x.scoreValue}
                    step={1}
                    precision={0}
                    style="width: 150px;"
                  />
                </div>
              </NLi>
            );
          })}
        </NOl>
        {currentStudentIndex.value >= studentAnswer.value.length - 1 ? (
          <>
            <NButton type="info" onClick={onPrev} v-show={currentStudentIndex.value > 0}>上一个</NButton>
          </>
        ) : (
          <>
            <NButton type="info" onClick={onPrev} v-show={currentStudentIndex.value > 0}>上一个</NButton>
            <NButton type="info" onClick={onNext} v-show={currentStudentIndex.value < studentAnswer.value.length - 1} style="margin-left: 24px;">下一个</NButton>
          </>
        )}
        <NButton
          onClick={onSubmitCurrent}
          type="primary"
          style="margin-left: 24px;"
          disabled={!canSubmitCurrent.value}>提交{currentStudent.value?.studentName}的成绩</NButton>
      </div>


      <NModal
        v-model:show={showAllTable.value}
        class="custom-card"
        preset="card"
        style="width: 640px"
        title="学生考试明细"
        size="huge"
        bordered={false}
        // segmented="segmented"
      >
        <NTable bordered singleLine={false}>
          <thead>
            <tr>
              <th>学生姓名</th>
              <th>选择题得分</th>
              <th>主观题得分</th>
              <th>总分</th>
            </tr>
          </thead>
          <tbody>
            {allTableOverview.value.map((x, i) => (
              <tr>
                <td>{x.studentName}</td>
                <td>{x.scores.choiceScore}</td>
                <td>{x.scores.shortScore ?? '-'}</td>
                <td>{x.scores.shortScoreAllRight ? x.scores.totalScore : (
                  <NButton
                    renderIcon={() => <Click />}
                    iconPlacement="right"
                    text
                    type="error"
                    onClick={() => {
                      onCheckStudent(x.studentId);
                      setShowAllTable(false);
                    }}
                  >未充分判卷</NButton>
                )}</td>
              </tr>
            ))}
          </tbody>
        </NTable>
      </NModal>

      <NModal
        show={showChoiceQuestionDetailIndex.value !== -1}
        onClose={closeChoiceQuestionDetail}
        class="custom-card"
        preset="card"
        style="width: 640px"
        title={`${currentStudent.value?.studentName}选择题明细`}
        size="huge"
        onEsc={closeChoiceQuestionDetail}
        onMaskClick={closeChoiceQuestionDetail}
        bordered={false}
      >
        <NOl>
          {choices.value?.map((x) => (
            <NLi style="margin-bottom: 32px;">
              <NP>{x.tName}({x.scoreValue}分)</NP>
              <NP>
                {x.customQuestionInfo.choices.map((y, yi) => {
                  const answers = studentAnswer.value[currentStudentIndex.value]?.answer;
                  const isWrong = Array.isArray(answers?.[x.id])
                    ? !y.right && (answers[x.id] as number[])?.includes(yi)
                    : !y.right && yi === answers?.[x.id];
                  return (
                    <NP>
                      <NText>{getAToZ(yi)}</NText>
                      <NText style={{
                        marginLeft: '24px',
                        color: isWrong ? '#b22222' : y.right ? 'green' : 'inherit',
                      }}>{y.label}</NText>
                    </NP>
                  );
                })}
              </NP>
            </NLi>
          ))}
        </NOl>
      </NModal>
    </div>
  );
});
