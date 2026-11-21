import { createApp } from 'vue';
import RoseSpectacles from 'rose-spectacles/config';
import ConfirmationService from 'rose-spectacles/confirmationservice';
import DialogService from 'rose-spectacles/dialogservice';
import ToastService from 'rose-spectacles/toastservice';
import App from './App.vue';
import './gallery.css';

createApp(App).use(RoseSpectacles).use(ConfirmationService).use(DialogService).use(ToastService).mount('#app');
