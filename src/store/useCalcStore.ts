import {create} from "zustand";

type ExpenseInput = {
  memberId: string;
  detail: string;
  amount: number | null;
};

// メンバーの型
type Member = {
  id: string;
  name: string;
};

// 支出の型
type Expense = {
  id: string;
  memberId: string;
  detail: string;
  amount: number;
};

type CalcStore = {
  members: Member[];
  expenses: Expense[];
  totalExpenses: number;

  // フォーム入力状態
  memberInput: string;
  expensesInput: ExpenseInput;

  // データ操作アクション
  addMember: () => void;
  updateMemberInput: (input: string) => void;

  addExpense: () => void;
  updateExpenseInput: (input: Partial<ExpenseInput>) => void;
  resetExpenseInput: () => void;

  removeExpense: (id: string) => void;

  // データ取得アクション 修正前
  setMembers: (members: Member[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  setTotalExpenses: (totalExpenses: number) => void;
};

export const useCalcStore = create<CalcStore>((set, get) => ({
  members: [],
  expenses: [],
  totalExpenses: 0,

  memberInput: "",
  expensesInput: {
    memberId: "",
    detail: "",
    amount: null,
  },

  // メンバー関連のアクション
  updateMemberInput: (input) => set({memberInput: input}),

  addMember: () => {
    const {memberInput, members} = get();
    if (!memberInput.trim()) return;

    const newMember = {
      id: crypto.randomUUID(),
      name: memberInput,
    };

    set({
      members: [...members, newMember],
      memberInput: "", /// 入力をクリア
    });
  },

  // 支出関連のアクション
  updateExpenseInput: (input) =>
    set((state) => ({
      expensesInput: {...state.expensesInput, ...input},
    })),

  resetExpenseInput: () =>
    set({expensesInput: {memberId: "", detail: "", amount: null}}),

  addExpense: () => {
      const {expensesInput, expenses, totalExpenses} = get();
      const {memberId, detail, amount} = expensesInput;

      if (memberId && detail && amount && amount > 0) {
        const newExpense = {
          id: crypto.randomUUID(),
          memberId,
          detail,
          amount,
        };

        set({
          expenses: [...expenses, newExpense],
          totalExpenses: totalExpenses + amount,
          expensesInput: {memberId: "", detail: "", amount: null},
        });
      }
    },   

  removeExpense: (id: string) => {
    const {expenses, totalExpenses} = get();
    const expense = expenses.find((e) => e.id === id);

    if (!expense) return;

    set({
      expenses: expenses.filter((e) => e.id !== id),
      totalExpenses: totalExpenses - expense.amount,
    });
  },

  // 以前のセッターも互換性のために残しておく
  setMembers: (members: {id: string; name: string}[]) => set({members}),
  setExpenses: (
    expenses: {id: string; memberId: string; detail: string; amount: number}[]
  ) => set({expenses}),
  setTotalExpenses: (totalExpenses: number) => set({totalExpenses}),
}));
