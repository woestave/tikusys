import { exampaperServices } from '@/apis/services/exampaper';
import examsysServices from '@/apis/services/examsys';
import { useRequest } from '@/hooks/use-request';
import { useCommonDataPinia } from '@/store/common-data.pinia';
import { functionalComponent, useCallbackP } from '@/utils/functional-component';
import { inExamTime } from 'common-packages/helpers/exam-utils';
import { DataTableColumns, NButton, NDataTable, NH1 } from 'naive-ui';
import { prop } from 'ramda';
import { useRouter, } from 'vue-router';



export default functionalComponent(() => {

  const router = useRouter();

  const [ examinationList, getExaminationList, getExaminationListStatus ] = useCallbackP(() => examsysServices
    .getMyExam()
    .then((res) => res.data.list || [])
    .then((res) => res.map((x) => {
      let examResultSQ_Marking: API__ExamResult.examResultSQ_MarkingParsed | null = null;
      try {
        if (x.myExamResult) {
          const decoded = decodeURIComponent(x.myExamResult.examResultSQ_Marking);
          if (decoded) {
            examResultSQ_Marking = JSON.parse(decoded) as API__ExamResult.examResultSQ_MarkingParsed;
          }
        }
      } catch (e) {}
      return {
        ...x,
        myExamResult: x.myExamResult ? {
          ...x.myExamResult,
          examResultSQ_Marking,
        } : null,
      };
    }))
  );

  getExaminationList();

  const [ exampaperList ] = useRequest(exampaperServices.list({}));

  const commonDataPinia = useCommonDataPinia();

  function onExaming (row: API__Examination.TableStruct__Examination) {
    router.push({
      name: 'examing',
      params: {
        examinationId: row.id,
      },
    });
  }

  return () => (
    <div class="exam-page">
      <div style="margin-top: 50px;"></div>
      <NH1>最近的考试</NH1>
      {/* <PageSubTitle>最近的考试：</PageSubTitle> */}
      <NDataTable
        data={examinationList.value || []}
        rowKey={prop('id')}
        columns={[
          {
            title: '编号',
            key: 'id',
          },
          {
            title: '考试名称',
            key: 'examName',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '试卷',
            key: 'examExampaperId',
            render (row) {
              return exampaperList.value?.list.find(x => x.paperId === row.examExampaperId)?.paperName || '';
            },
          },
          {
            title: '考试班级',
            key: 'examClassIds',
            // ellipsis: {
              // tooltip: true,
            // },
            render (row) {
              return row
                .examClassIds
                .map(classId => commonDataPinia.classes.find(y => y.value === classId))
                .map((x) => x?.label)
                .join(', ');
            },
          },
          {
            title: '考试日期',
            key: 'examDate',
            render (row) {
              const examDate = new Date(row.examDate);
              const started = inExamTime(row.examDate, row.examDuration);
              return (
                <span
                  style={{
                    color: examDate.toLocaleDateString() === new Date().toLocaleDateString()
                      ? started
                        ? 'red'
                        : 'yellow'
                      : 'inherit',
                  }}
                >{examDate.toLocaleString()}</span>
              );
            },
          },
          {
            title: '考试时长',
            key: 'examDuration',
            render (row) {
              return row.examDuration + '分钟';
            },
          },
          {
            title: '考试简介',
            key: 'examDesc',
            ellipsis: {
              tooltip: true,
            },
          },
          {
            title: '分数',
            key: '',
            render (row) {
              if (row.myExamResult) {
                const SQ_Marking = row.myExamResult.examResultSQ_Marking || null;
                const SQ_Scores = Object.keys(SQ_Marking || {}).reduce((score, currKey) => {
                  return score + (SQ_Marking![+currKey] || 0);
                }, 0);
                return row.myExamResult.examResultChoiceQuestionScore + SQ_Scores;
              }
              return '-';
            },
          },
          {
            title: '操作',
            key: '',
            render (row) {
              const examing = inExamTime(row.examDate, row.examDuration);
              return (
                <>
                  <NButton
                    type={examing ? 'primary' : 'info'}
                    onClick={() => onExaming(row)}
                  >{
                    row.myExamResult
                      ? '查看成绩'
                      : examing
                        ? '开始考试'
                        : '查看'
                  }</NButton>
                </>
              );
            },
          },
        ] as DataTableColumns<NonNullable<(typeof examinationList)['value']>[number]>}
        loading={getExaminationListStatus.value === 'pending'}
      >
      </NDataTable>
    </div>
  );
});
