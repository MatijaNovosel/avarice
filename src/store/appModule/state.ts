export interface AppStateInterface {
  createTransactionTrigger: boolean;
}

function state(): AppStateInterface {
  return {
    createTransactionTrigger: false
  };
}

export default state;
