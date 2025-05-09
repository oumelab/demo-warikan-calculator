import ModelExpenseList from "@/components/ModelExpenseList";
import ModelMemberList from "@/components/ModelMemberList";
import ModelResult from "@/components/ModelResult";
import { Link } from "react-router";
export default function ModelApp() {
  return (
    <>
      <div className="min-h-screen pt-16 pb-8 space-y-8 px-16 bg-gradient-to-br from-slate-50 to-sky-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-3">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold">Warikan Culculator</h1>
            <p className="text-gray-700">
              メンバーと、立て替えた記録を記入してください。
              <br />
              自動で最適な精算方法を算出します！
            </p>
          </div>
          <p className="text-right text-sm"><Link to="/" className="underline underline-offset-2">トップに戻る &gt;</Link></p>
        </div>
        <div className="flex space-x-8 justify-center">
          <ModelMemberList />
          <ModelExpenseList />
          <ModelResult />
        </div>
      </div>
    </>
  );
}
