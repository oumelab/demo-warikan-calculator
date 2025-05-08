import { useMemo, useState } from "react";
import {useCalcStore} from "../store/useCalcStore";

export type PaymentLogicResult = {
  isMembersSufficient: boolean;
  isFormValid: boolean;
  handleAdddExpense: () => void;
}

 // 支払い入力が有効かどうかを判定
export const usePaymentLogic = () => {
  const members = useCalcStore((state) => state.members);
  const expensesInput = useCalcStore((state) => state.expensesInput);
  const addExpense = useCalcStore((state) => state.addExpense);

  const [error, setError] = useState<string | null>(null);

  const isMembersSufficient = useMemo(() => {
    return members.length >= 2;
  }, [members]);

  const isFormValid = useMemo(() => {
    return (
      isMembersSufficient &&
      !!expensesInput.memberId &&
      !!expensesInput.detail &&
      !!expensesInput.amount &&
      expensesInput.amount > 0
    );
  }, [isMembersSufficient, expensesInput]);

  // 支払い追加処理
  const handleAddExpense = () => {
    if (!expensesInput.memberId) {
      setError("支払った人を選択してください");
      return;
    }
    if (!expensesInput.detail) {
      setError("内容を入力してください");
      return;
    }
    if (!expensesInput.amount || expensesInput.amount <= 0) {
      setError("有効な金額を入力してください");
      return;
    }

    setError(null);
    addExpense();
  };
  return {
    isMembersSufficient,
    isFormValid,
    handleAddExpense,
    error,
  };
}