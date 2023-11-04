import { setCompodocJson } from "@storybook/addon-docs/angular";
import { componentWrapperDecorator, addDecorator } from "@storybook/angular";

import docJson from "../documentation.json";
setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ["Documentation", ["Introduction", "Colors", "Icons"], "Component Library"],
    },
  },
  docs: { inlineStories: true },
};

// ng-template is used to scope any template reference variables and isolate the previews
const decorator = componentWrapperDecorator(
  (story) => `
<ng-template #lightPreview>
  <div class="theme_light tw-px-5 tw-py-10 tw-border-2 tw-border-solid tw-border-secondary-300 tw-bg-[#ffffff]">${story}</div>
</ng-template>
<ng-template #darkPreview>
  <div class="theme_dark tw-mt-5 tw-px-5 tw-py-10 tw-bg-[#1f242e]">${story}</div>
</ng-template>

<ng-container *ngTemplateOutlet="lightPreview"></ng-container>
<ng-container *ngTemplateOutlet="darkPreview"></ng-container>
`
);

addDecorator(decorator);
