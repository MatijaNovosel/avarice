import { createApp } from "vue";
import { VuelidatePlugin } from "@vuelidate/core";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ToastService from "primevue/toastservice";
import Ripple from "primevue/ripple";
import PrimeVue from "primevue/config";

// PrimeVue component import
import Toast from "primevue/toast";
import Chart from "primevue/chart";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import Listbox from "primevue/listbox";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Tooltip from "primevue/tooltip";
import InputSwitch from "primevue/inputswitch";
import ColorPicker from "primevue/colorpicker";
import Paginator from "primevue/paginator";
import DataView from "primevue/dataview";
import ProgressSpinner from "primevue/progressspinner";
import ContextMenu from "primevue/contextmenu";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";
import ProgressBar from "primevue/progressbar";
import Skeleton from "primevue/skeleton";
import Dropdown from 'primevue/dropdown';

// Custom component import
import Tag from "@/components/tag.vue";

// CSS
import "@/assets/css/themes/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "@/assets/css/site.sass";
import "./index.css";

// Translations
import en from "@/translations/en";
import hr from "@/translations/hr";

const app = createApp(App);

const messages = {
  en,
  hr
};

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "hr",
  legacy: false,
  messages
});

// Plugins
app.use(store);
app.use(router);
app.use(VuelidatePlugin);
app.use(ToastService);
app.use(i18n);
app.use(PrimeVue, { ripple: true });

// Custom components
app.component("tag", Tag);

// PrimeVue components
app.component("toast", Toast);
app.component("chart", Chart);
app.component("p-dialog", Dialog);
app.component("input-number", InputNumber);
app.component("list-box", Listbox);
app.component("input-text", InputText);
app.component("text-area", Textarea);
app.component("input-switch", InputSwitch);
app.component("p-color-picker", ColorPicker);
app.component("paginator", Paginator);
app.component("data-view", DataView);
app.component("progress-spinner", ProgressSpinner);
app.component("context-menu", ContextMenu);
app.component("calendar", Calendar);
app.component("radio-button", RadioButton);
app.component("progress-bar", ProgressBar);
app.component("skeleton", Skeleton);

// Directives
app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);

app.mount("#app");
