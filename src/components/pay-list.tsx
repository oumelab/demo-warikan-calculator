import { useCalcStore } from "../store/useCalcStore";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function PayList() {
  const members = useCalcStore((state) => state.members);
  const expenses = useCalcStore((state) => state.expenses);
  const expensesInput = useCalcStore((state) => state.expensesInput);
  const updateExpenseInput = useCalcStore((state) => state.updateExpenseInput);
  const addExpense = useCalcStore((state) => state.addExpense);
  const removeExpense = useCalcStore((state) => state.removeExpense);

  // 支払い入力が有効かどうかを判定
  const isMembersSufficient = useMemo(() => {
    return members.length >= 2;
  }, [members]);

  return (
    <div className="flex flex-col gap-4">
      <div className="size-12 rounded-full border border-neutral-300 grid place-items-center">
        <span className="text-2xl">✏️</span>
      </div>
      <h2 className="text-lg font-bold">支払い記録</h2>
      <div className="flex flex-col gap-3">
        <Select
          name={expensesInput.memberId}
          onValueChange={(value) => updateExpenseInput({memberId: value})}
          disabled={!isMembersSufficient}
        >
          <SelectTrigger className="w-full border-neutral-300 bg-white">
            <SelectValue
              placeholder={
                isMembersSufficient ? "支払った人" : "メンバーを2名以上追加してください"
              }
            />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>支払った人</SelectLabel>
              {members?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input
            type="text"
            onChange={(e) => updateExpenseInput({detail: e.target.value})}
            value={expensesInput.detail}
            placeholder="内容"
          />
          <Input
            type="number"
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              updateExpenseInput({amount: value});
            }}
            value={expensesInput.amount ?? ""}
            placeholder="金額"
          />
        </div>
        <Button className="w-full" onClick={addExpense} disabled={!isMembersSufficient}>
          記録する
        </Button>
      </div>
      <ul className="flex flex-col gap-2 h-40 overflow-y-auto">
        {expenses &&
          expenses.length > 0 &&
          expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex gap-2 items-center p-2 bg-neutral-50 rounded-lg"
            >
              <p className="flex-1 text-sm">
                {members.find((member) => member.id === expense.memberId)?.name}
                が{expense.detail}で{expense.amount}円支払い
              </p>
              <Button
                className="w-12 h-8"
                size="icon"
                onClick={() => removeExpense(expense.id)}
              >
                <Trash2 />
                <span className="sr-only">削除</span>
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}