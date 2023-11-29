import { inject, InjectionKey } from "vue";

export interface CreateConfirmDialogOptions {
  width?: string | number;
  showCancel?: boolean;
  persistent?: boolean;
}

export type CreateConfirmDialog = (
  title: string,
  content: string,
  options: CreateConfirmDialogOptions
) => Promise<boolean>;

export const CreateConfirmDialogKey: InjectionKey<CreateConfirmDialog> =
  Symbol("CreateConfirmDialogKey");

export const useConfirmationDialog = () => {
  const dialog = inject(CreateConfirmDialogKey);

  if (!dialog) {
    throw new Error("Could not resolve provider");
  }

  return dialog;
};
