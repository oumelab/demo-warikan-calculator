// src/store/useWarikanStore.ts

import { create } from "zustand";
import { Expense } from "../types";

type State = {
  inputMember: string; // 入力中のメンバーの名前
  inputExpense: Expense; // 入力中の立て替えの記録
  members: string[]; // 入力→追加されたメンバーのリスト
  expenses: Expense[]; // 入力→追加された立て替えのリスト
};

type Action = {
  updateInputMember: (inputMember: string) => void;
  updateInputExpense: (inputExpense: Expense) => void;
  addMember: () => void;
  addExpense: () => void;
  removeExpense: (description: string) => void;
};

const useWarikanStore = create<State & Action>((set) => ({
  // initial state
  inputMember: "",
  inputExpense: { paidBy: "", description: "", amount: 0 },
  members: [],
  expenses: [],
  
  // actions
  updateInputMember: (inputMember: string) =>
    set(() => ({ inputMember: inputMember })),
  updateInputExpense: (inputExpense: Expense) =>
    set(() => ({ inputExpense: inputExpense })),

  // 割り勘するメンバーを、リストに追加するボタンの処理
  addMember: () =>
    set((state) => {
      const trimmedMember = state.inputMember.trim(); // フォームに入力されているテキストから、空白を取り除く
      const isDuplicateMember = state.members.includes(trimmedMember); // 既存のメンバーリストから、重複があるかどうかを判定
      if (trimmedMember && !isDuplicateMember) { // 値が空白でなく、かつ重複していない名前の場合、set関数のreturnで、状態を更新
        return {
          members: [...state.members, trimmedMember], // ネストされたオブジェクトや配列がある場合は、明示的にマージする必要
          inputMember: "",
        };
      }
      return state;
    }),

    // 立て替えた記録を、リストに追加するボタンの処理
    addExpense: () =>
      set((state) => {
        const { paidBy, description, amount } = state.inputExpense;
        const trimmedDescription = description.trim();
        const isDuplicateDescription = state.expenses.some( // some() は 配列の中の少なくとも1つの要素が条件を満たすかどうかを判定
          (expense) => expense.description === trimmedDescription
        );
        if (paidBy && trimmedDescription && amount && !isDuplicateDescription) {
          return {
            expenses: [
              ...state.expenses,
              { ...state.inputExpense, description: trimmedDescription },
            ],
            inputExpense: { paidBy: "", description: "", amount: 0 },
          };
        }
        return state;
      }),
      // 立て替えた記録を、リストから削除するボタンの処理
      removeExpense: (description: string) =>
        set((state) => {
          return {
            expenses: state.expenses.filter(
              (expense) => expense.description !== description
            ),
          };
        }),
  
}));

export default useWarikanStore;