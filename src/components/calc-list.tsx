import {useCalcStore} from "../store/useCalcStore";
import useCalcLogic from "@/hooks/useCalcLogic";

export default function CalcList() {
  // const {members, expenses} = useCalcStore();
  const members = useCalcStore((state) => state.members);
  const expenses = useCalcStore((state) => state.expenses);
  const {settlements, balances,  isCalculationReady, needsSettlement} = useCalcLogic();

  return (
    <div className="flex flex-col gap-4">
      <div
        className="size-12
     rounded-full border border-neutral-300 grid place-items-center"
      >
        <span className="text-2xl">💰</span>
      </div>
      <h2 className="text-lg font-bold">割り勘方法</h2>

      {!members || members.length < 2 ? (
        <p className="text-sm text-gray-500">
          メンバーを2名以上追加してください
        </p>
      ) : members?.length >= 2 && !expenses || expenses.length === 0 ? (
        <p className="text-sm text-gray-500">支払い記録を入力してください</p>
      ) : null}

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
      {isCalculationReady && (
      <div>
          <h3 className="text-sm font-semibold mb-2">精算方法</h3>
          {!needsSettlement ? (
            <p className="text-sm text-gray-500">
              全員の支払いが均等なため、清算は必要ありません。
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
            {settlements.map((settlement, index) => (
              <li key={index} className="bg-emerald-100 p-2 rounded-lg text-sm">
                <span className="font-medium">{settlement.from}</span>が
                <span className="font-medium">{settlement.to}</span>に
                <span className="font-medium">
                  {settlement.amount.toLocaleString()}円
                </span>
                を支払う
              </li>
            ))}
        </ul>
        )}
      </div>
      )}
    </div>
  );
}
