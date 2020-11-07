import { createApp } from "vue";
import { Field, Form } from "vee-validate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ToastService from "primevue/toastservice";

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
import Textarea from 'primevue/textarea';
import Fieldset from 'primevue/fieldset';
import Tooltip from 'primevue/tooltip';

// Custom component import
import Chip from "@/components/chip.vue";
import GroupBox from "@/components/group-box.vue";
import Icon from "@/components/icon.vue";

// CSS
import "primevue/resources/themes/mdc-dark-deeppurple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@/assets/css/site.css";

const app = createApp(App);

// Plugins
app.use(store);
app.use(router);
app.use(ToastService);

// Custom components
app.component("chip", Chip);
app.component("group-box", GroupBox);
app.component("icon", Icon);

// PrimeVue components
app.component("vee-field", Field);
app.component("vee-form", Form);
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

// Directives
app.directive("tooltip", Tooltip);

// Config
app.config.globalProperties.$primevue = { ripple: true };

app.mount("#app");
