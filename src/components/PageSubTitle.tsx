import { functionalComponent } from "@/utils/functional-component";
import { NP } from "naive-ui";

export const PageSubTitle = functionalComponent<{}>((props) => {

  return () => (
    <NP style="color: #555;">{props.context.slots.default?.()}</NP>
  );
});
