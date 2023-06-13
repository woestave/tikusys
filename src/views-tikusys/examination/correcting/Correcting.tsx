import { examResultServices } from '@/apis/services/exam-result';
import { useRequest } from '@/hooks/use-request';
import { globalLoading } from '@/utils/create-loading';
import { functionalComponent, useState } from '@/utils/functional-component';
import { filterIsShortQuestion } from 'common-packages/models/question-model-short';
import { NButton, NH1, NH2, NH4, NH5, NInputNumber, NLi, NOl, NP, NText, useMessage } from 'naive-ui';
import { dec, inc } from 'ramda';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import './Correcting.less';

/**
 * 老师阅卷
 */
export default functionalComponent(() => {

  const route = useRoute();

  const examinationId = route.query.examinationId;

  // const [userInfo, userInfoPromise] = useRequest(personnelServices.getUserInfo());

  const [myExamResult, myExamResultPromise] = useRequest(
    examResultServices
    .getTeacherCorrecting({ examinationId: Number(examinationId) })
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
        answer: JSON.parse(decodeURIComponent(item.examResultAnswerInfo)),
      };
    }) || [];
  });

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const currentStudent = computed(() => myExamResult.value?.studentList.find(x => x.studentId === studentAnswer.value[currentStudentIndex.value]?.studentId));

  const shorts = computed(() => myExamResult.value?.tiList.filter(filterIsShortQuestion));

  const answerResult = ref<Record<API__Student.TableStruct__Student['studentId'], Record<API__Tiku.TableStruct__Tiku['id'], number>>>({});

  const canSubmitCurrent = computed(() => {
    const student = currentStudent.value;
    if (!student) {
      return null;
    }
    return shorts.value?.every(q => typeof answerResult.value[student.studentId]?.[q.id] === 'number');
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

  function onCheckStudent (x: API__Student.TableStruct__Student) {
    const targetIndex = studentAnswer.value.findIndex(y => y.studentId === x.studentId);
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
      <div class="student-item">
        <NH2>考生姓名：{
          myExamResult.value?.studentList.map(x => (
            <NButton
              class={{'student-btn': true, active: x.studentId === currentStudent.value?.studentId}}
              text
              onClick={() => onCheckStudent(x)}
            >{x.studentName}</NButton>
          ))}</NH2>
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
                    value={answerResult.value[currentStudent.value?.studentId || -999]?.[x.id] || null}
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
    </div>
  );
});
