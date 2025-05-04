import { useEffect, useState } from "react";
import {useMembersStore} from "../hooks/useCalcStore";

export default function CalcList() {
  const {members, expenses, totalExpenses} = useMembersStore();
  const [results, setResults] = useState<{ personId: string; person: string; amount: number }[]>([]);
  console.log(results);
  
  useEffect(() => {
    const perPerson = totalExpenses / members?.length;
    
    const newResults = members?.map((member) => ({
      personId: member.id,
      person: member.name,
      amount: Math.ceil(perPerson - (expenses.filter((expense) => expense.memberId === member.id).reduce((acc, expense) => acc + expense.amount, 0))),
    }));
    setResults(newResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[totalExpenses]);

  return (
    <div className="flex flex-col gap-4">
    <div
      className="size-12
     rounded-full border border-neutral-300 grid place-items-center"
    >
      <span className="text-2xl">💰</span>
    </div>
    <h2 className="text-lg font-bold">割り勘方法</h2>
    <ul className="flex flex-col gap-2">
      {results.filter(result => result.amount > 0).map((result) => (
        <li key={result.personId} className="bg-emerald-100 p-2 rounded-lg text-sm">
          {result.person}が{results.find(result => result.amount < 0)?.person}に{result.amount}円を支払う
        </li>
      ))}
      {/* <li className="bg-emerald-100 p-2 rounded-lg text-sm">ゾロさんがルフィさんに2700円を支払う</li>
      <li className="bg-emerald-100 p-2 rounded-lg text-sm">サンジさんがルフィさんに9600円を支払う</li>         */}
    </ul>
  </div>
  )
}