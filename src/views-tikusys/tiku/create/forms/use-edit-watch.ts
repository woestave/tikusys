import { DefaultQuestionModel } from 'common-packages/models/question-model-base';
import { watch } from 'vue';

export default function useEditWatch<M extends DefaultQuestionModel> (
  watchTarget: () => M | void | null,
  setModel: (model: M) => void,
) {

  watch(
    watchTarget,
    (n, o) => {
      if (n) {
        setModel({...n});
      }
    },
    {immediate: true,},
  );
}
