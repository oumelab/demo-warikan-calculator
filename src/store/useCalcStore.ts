import {create} from "zustand";

type CalcStore = {
  members:
    | {
        id: string;
        name: string;
      }[]
    | [];
  expenses:
    | {
        id: string; // crypto.randomUUID()
        memberId: string;
        detail: string;
        amount: number;
      }[]
    | [];
  totalExpenses: number;

  // フォーム入力状態
  memberInput: string;
  expenseDetail: string;
  expenseAmount: number | null;
  selectedMemberId: string;

  // データ操作アクション
  addMember: () => void;
  updateMemberInput: (input: string) => void;

  addExpense: () => void;
  updateExpenseDetail: (detail: string) => void;
  updateExpenseAmount: (amount: number | null) => void;
  updateSelectedMemberId: (id: string) => void;

  removeExpense: (id: string) => void;

  // データ取得アクション 修正前
  setMembers: (
    members: {
      id: string;
      name: string;
    }[]
  ) => void;
  setExpenses: (
    expenses: {
      id: string;
      memberId: string;
      detail: string;
      amount: number;
    }[]
  ) => void;
  setTotalExpenses: (totalExpenses: number) => void;
};

export const useCalcStore = create<CalcStore>((set, get) => ({
  members: [],
  expenses: [],
  totalExpenses: 0,

  memberInput: "",
  expenseDetail: "",
  expenseAmount: null,
  selectedMemberId: "",

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
  updateExpenseDetail: (detail) => set({expenseDetail: detail}),
  updateExpenseAmount: (amount) => set({expenseAmount: amount}),
  updateSelectedMemberId: (id) => set({selectedMemberId: id}),

  addExpense: () => {
    const {
      expenses,
      selectedMemberId,
      expenseDetail,
      expenseAmount,
      totalExpenses,
    } = get();

    if (!selectedMemberId || !expenseDetail || !expenseAmount || expenseAmount <= 0) return;

    const newExpense = {
      id: crypto.randomUUID(),
      memberId: selectedMemberId,
      detail: expenseDetail,
      amount: expenseAmount,
    };

    set({
      expenses: [...expenses, newExpense],
      totalExpenses: totalExpenses + expenseAmount,
      // フォームをクリア
      expenseDetail: "",
      expenseAmount: null,
    });
  },

  removeExpense: (id: string) => {
    const {expenses, totalExpenses} = get();
    const expense = expenses.find(e => e.id === id);

    if (!expense) return;

    set({
      expenses: expenses.filter(e => e.id !== id),
      totalExpenses: totalExpenses - expense.amount,
    });
  },

  // 以前のセッターも互換性のために残しておく
  setMembers: (members) => set({members}),
  setExpenses: (expenses) => set({expenses}),
  setTotalExpenses: (totalExpenses) => set({totalExpenses}),
}));