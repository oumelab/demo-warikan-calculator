import { useMemo } from "react";
import {useCalcStore} from "../store/useCalcStore";

// 戻り値の型定義
export type Balance = {
  personId: string;
  person: string;
  paid: number;
  share: number;
  balance: number;
};

export type Settlement = {
  from: string;
  to: string;
  amount: number;
};

export type CalcResult = {
  balances: Balance[];
  settlements: Settlement[];
  isCalculationReady: boolean;
  needsSettlement: boolean;
};

export default function useCalcLogic(): CalcResult {
  const {members, expenses, totalExpenses} = useCalcStore();

  return useMemo(() => {

  // 初期値を設定
  const result: CalcResult = {
    balances: [],
    settlements: [],
    isCalculationReady: members.length >= 2 && expenses.length > 0,
    needsSettlement: false
  };

  // メンバーが2人未満または支払いがない場合は計算しない
  if (!members?.length || members.length < 2 || !expenses?.length) {
    return result;
  }

  // 1人あたりの負担額を計算
  const perPerson = totalExpenses / members.length;

  // 各メンバーの収支バランスを計算
  const balances = members.map((member) => {
    // このメンバーが支払った合計金額
    const paid = expenses
      .filter((expense) => expense.memberId === member.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      personId: member.id,
      person: member.name,
      paid, // 支払った金額
      share: Math.ceil(perPerson), // 負担すべき金額
      balance: Math.ceil(perPerson) - paid, // 精算金額（正: 支払う、負: 受け取る）
    };
  });

   // 結果に収支を設定
   result.balances = balances;

  // 支払う人と受け取る人をリストアップしてコピー
  const payers = [...balances.filter((b) => b.balance > 0)];
  const receivers = [...balances.filter((b) => b.balance < 0)];

  // 精算が必要かどうかを確認
  result.needsSettlement = payers.length > 0 && receivers.length > 0;

  // 精算が必要ない場合は早期リターン
  if (!result.needsSettlement) {
    return result;
  }

  // 精算取引リストを生成
  const settlements: Settlement[] = [];

  // マッチングして精算取引を生成
  while (payers.length > 0 && receivers.length > 0) {
    const payer = payers[0];
    const receiver = receivers[0];

    // 支払い額と受取額の小さい方を採用
    const amount = Math.min(payer.balance, -receiver.balance);

    if (amount > 0) {
      // 精算取引を追加
      settlements.push({
        from: payer.person,
        to: receiver.person,
        amount,
      });

      // 残高を更新
      payer.balance -= amount;
      receiver.balance += amount;
    }

    // 精算が完了した人をリストから削除
    if (payer.balance <= 0) payers.shift();
    if (receiver.balance >= 0) receivers.shift();
  }

  // 結果に精算リストを設定
  result.settlements = settlements;

  return result;

}, [members, expenses, totalExpenses]); // 依存配列を指定
}
