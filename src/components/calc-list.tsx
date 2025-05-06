import {useMemo} from "react";
import {useMembersStore} from "../hooks/useCalcStore";

export default function CalcList() {
  const {members, expenses, totalExpenses} = useMembersStore();
  // const [results, setResults] = useState<
  //   {personId: string; person: string; amount: number}[]
  // >([]);

  // useEffect(() => {
  //   if (!members?.length) return;
  //   const perPerson = totalExpenses / members?.length;

  //   const newResults = members?.map((member) => ({
  //     personId: member.id,
  //     person: member.name,
  //     amount: Math.ceil(
  //       perPerson -
  //         expenses
  //           .filter((expense) => expense.memberId === member.id)
  //           .reduce((acc, expense) => acc + expense.amount, 0)
  //     ),
  //   }));
  //   setResults(newResults);
  // }, [members, expenses, totalExpenses]);

  // useMemoを使って計算結果をキャッシュ
  const {balances, settlements} = useMemo(() => {
    // メンバーが2人未満または支払いがない場合は計算しない
    if (!members?.length || members.length < 2 || !expenses?.length) {
      return {balances: [], settlements: []};
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

    // 精算取引リストを生成
    const settlements = [];

    // 支払う人と受け取る人をリストアップしてコピー
    const payers = [...balances.filter((b) => b.balance > 0)];
    const receivers = [...balances.filter((b) => b.balance < 0)];

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

    return {balances, settlements};
  }, [members, expenses, totalExpenses]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="size-12
     rounded-full border border-neutral-300 grid place-items-center"
      >
        <span className="text-2xl">💰</span>
      </div>
      <h2 className="text-lg font-bold">割り勘方法</h2>

      {members.length < 2 && (
        <p className="text-sm text-gray-500">
          メンバーを2名以上追加してください
        </p>
      )}
      {members.length >= 2 && expenses.length === 0 && (
        <p className="text-sm text-gray-500">支払い記録を入力してください</p>
      )}
      {/* 各メンバーの支払い状況 */}
      {balances.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">支払い状況</h3>
          <div className="bg-blue-50 p-3 rounded-lg mb-2">
            <ul className="text-xs space-y-1">
              {balances.map((balance) => (
                <li key={balance.personId}>
                  <span className="font-medium">{balance.person}</span>：
                  {balance.paid.toLocaleString()}円支払い /
                  {balance.share.toLocaleString()}円負担
                  <span
                    className={
                      balance.balance > 0
                        ? "text-red-500 ml-1"
                        : balance.balance < 0
                        ? "text-green-500 ml-1"
                        : "ml-1"
                    }
                  >
                    (
                    {balance.balance === 0
                      ? "精算なし"
                      : balance.balance > 0
                      ? balance.balance.toLocaleString() + "円不足"
                      : (-balance.balance).toLocaleString() + "円超過"}
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* 精算方法 */}
      <div>
        <h3 className="text-sm font-semibold mb-2">精算方法</h3>
        <ul className="flex flex-col gap-2">
          {/* 最初に自分で考えたコード（中央清算所型というらしい）*/}
          {/* 
         {results
          .filter((result) => result.amount > 0)
          .map((result) => (
            <li
              key={result.personId}
              className="bg-emerald-100 p-2 rounded-lg text-sm"
            >
              {result.person}が
              {results.find((result) => result.amount < 0)?.person}に
              {result.amount}円を支払う
            </li>
          ))}
        {results.filter((result) => result.amount < 0)?.length > 1 &&
          results
            .filter((result, index) => result.amount < 0 && index > 1)
            .map((result) => (
              <li
                key={result.personId}
                className="bg-red-100 p-2 rounded-lg text-sm"
              >
                {result.person}が
                {results.find((result) => result.amount < 0)?.person}から
                {Math.abs(result.amount)}円を受け取る
              </li>
            ))} */}
          {members.length > 1 &&
          expenses?.length > 0 &&
          settlements.length === 0 ? (
            <p className="text-sm text-gray-500">
              全員の支払いが均等なため、清算は必要ありません。
            </p>
          ) : (
            settlements.map((settlement, index) => (
              <li key={index} className="bg-emerald-100 p-2 rounded-lg text-sm">
                <span className="font-medium">{settlement.from}</span>が
                <span className="font-medium">{settlement.to}</span>に
                <span className="font-medium">
                  {settlement.amount.toLocaleString()}円
                </span>
                を支払う
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
