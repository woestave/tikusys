import { functionalComponent } from "@/utils/functional-component";
import { NH1 } from "naive-ui";
import { useRoute } from "vue-router";

export const PageTitle = functionalComponent<{}>((props) => {

  const route = useRoute();

  return () => (
    <NH1>{route.meta.title}</NH1>
  );
});
