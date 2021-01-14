import { createApp } from "vue";
import { VuelidatePlugin } from "@vuelidate/core";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ToastService from "primevue/toastservice";
import Ripple from "primevue/ripple";

// PrimeVue component import
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Toast from "primevue/toast";
import PanelMenu from "primevue/panelmenu";
import Chart from "primevue/chart";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import Listbox from "primevue/listbox";
import InputText from "primevue/inputtext";
import SelectButton from "primevue/selectbutton";
import MultiSelect from "primevue/multiselect";
import Textarea from "primevue/textarea";
import Fieldset from "primevue/fieldset";
import Tooltip from "primevue/tooltip";
import Card from "primevue/card";
import InputSwitch from "primevue/inputswitch";
import Checkbox from "primevue/checkbox";
import ColorPicker from "primevue/colorpicker";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Paginator from "primevue/paginator";
import DataView from "primevue/dataview";
import Slider from "primevue/slider";
import ProgressSpinner from "primevue/progressspinner";
import OverlayPanel from "primevue/overlaypanel";
import ContextMenu from "primevue/contextmenu";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";

// Custom component import
import Tag from "@/components/tag.vue";
import GroupBox from "@/components/group-box.vue";
import Icon from "@/components/icon.vue";

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

// Custom components
app.component("tag", Tag);
app.component("group-box", GroupBox);
app.component("icon", Icon);

// PrimeVue components
app.component("data-table", DataTable);
app.component("column", Column);
app.component("column-group", ColumnGroup);
app.component("menubar", Menubar);
app.component("btn", Button);
app.component("sidebar", Sidebar);
app.component("p-menu", Menu);
app.component("toast", Toast);
app.component("panel-menu", PanelMenu);
app.component("chart", Chart);
app.component("p-dialog", Dialog);
app.component("input-number", InputNumber);
app.component("list-box", Listbox);
app.component("input-text", InputText);
app.component("select-button", SelectButton);
app.component("multi-select", MultiSelect);
app.component("text-area", Textarea);
app.component("field-set", Fieldset);
app.component("card", Card);
app.component("input-switch", InputSwitch);
app.component("p-checkbox", Checkbox);
app.component("p-color-picker", ColorPicker);
app.component("accordion", Accordion);
app.component("accordion-tab", AccordionTab);
app.component("paginator", Paginator);
app.component("data-view", DataView);
app.component("slider", Slider);
app.component("progress-spinner", ProgressSpinner);
app.component("overlay-panel", OverlayPanel);
app.component("context-menu", ContextMenu);
app.component("calendar", Calendar);
app.component("radio-button", RadioButton);

// Directives
app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);

// Config
app.config.globalProperties.$primevue = { ripple: true };

app.mount("#app");
