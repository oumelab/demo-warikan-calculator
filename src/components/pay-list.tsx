import {useMembersStore} from "../hooks/useCalcStore";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {Trash2} from "lucide-react";
import { useState } from "react";

export default function PayList() {
  const {members, expenses, setExpenses, totalExpenses, setTotalExpenses} =
    useMembersStore();
    const [memberId, setMemberId] = useState("");
    const [detail, setDetail] = useState("");
    const [amount, setAmount] = useState(0);
    
    const handleAddExpense = () => {
      if (memberId && detail && amount) {
        const newExpense = { id:crypto.randomUUID(), memberId, detail, amount };
        setExpenses(expenses && expenses.length > 0 ? [...expenses, newExpense] : [newExpense]);
        setTotalExpenses(totalExpenses + amount);
        setMemberId("");
        setDetail("");
        setAmount(0);
      }
    };

    const handleDeleteExpense = (id: string) => {
      if (expenses) {
        const newExpenses = expenses.filter((expense) => expense.id !== id);
        const deletedExpense = expenses.find((expense) => expense.id === id)?.amount ?? 0;
        setTotalExpenses(totalExpenses - deletedExpense);
        setExpenses(newExpenses);
      }
    };    

  return (
    <div className="flex flex-col gap-4">
      <div
        className="size-12
     rounded-full border border-neutral-300 grid place-items-center"
      >
        <span className="text-2xl">✏️</span>
      </div>
      <h2 className="text-lg font-bold">支払い記録</h2>
      <div className="flex flex-col gap-3">
        <Select name={memberId} onValueChange={(value) => setMemberId(value)}>
          <SelectTrigger className="w-full border-neutral-300 bg-white">
            <SelectValue placeholder="支払った人" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>
                {members && members.length > 0
                  ? "支払った人"
                  : "メンバーを追加してください"}
              </SelectLabel>
              {members?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input type="text" onChange={(e) => setDetail(e.target.value)} value={detail} placeholder="内容" />
          <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} value={amount} placeholder="金額" />
        </div>
        <Button className="w-full" onClick={handleAddExpense}>記録する</Button>
      </div>
      <ul className="flex flex-col gap-2">
        {expenses && expenses.length > 0 && expenses.map((expense) => (
          <li key={expense.id} className="flex gap-2 items-center p-2 bg-neutral-50 rounded-lg">
            <p className="flex-1 text-sm">{members.find(member => member.id === expense.memberId)?.name}が{expense.detail}で{expense.amount}円支払い</p>
            <Button className="w-12 h-8" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
              <Trash2 />
              <span className="sr-only">削除</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}