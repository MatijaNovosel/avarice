import { createApp } from "vue";
import { Field, Form } from "vee-validate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ToastService from 'primevue/toastservice';

// Component import
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Toast from 'primevue/toast';
import PanelMenu from 'primevue/panelmenu';
import Chart from 'primevue/chart';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

// CSS
import "primevue/resources/themes/mdc-dark-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@/assets/css/site.css";

const app = createApp(App);

// Plugins
app.use(store);
app.use(router);
app.use(ToastService);

// Components
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

// Config
app.config.globalProperties.$primevue = { ripple: true };

app.mount("#app");
