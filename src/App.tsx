import CalcList from "./components/calc-list";
import MemberList from "./components/member-list";
import PayList from "./components/pay-list";

export default function App() {
  return (
    <div className="py-12 px-5 max-w-6xl mx-auto">
      <div className="h-fit flex flex-col gap-6">
        <h1 className="text-5xl font-bold">Warikan Calculator</h1>
        <p>
          メンバーと、立て替えた記録を記入してください。
          <br />
          自動で最適な清算方法を算出します！
        </p>
      </div>
      <div className="w-full mt-6 grid grid-cols-3 gap-6">
        <div className="border border-gray-300 rounded-lg shadow-lg py-6 px-4">
          <MemberList />
        </div>
        <div className="border border-gray-300 rounded-lg shadow-lg py-6 px-4">
          <PayList />
        </div>
        <div className="border border-gray-300 rounded-lg shadow-lg py-6 px-4">
        <CalcList />
        </div>
      </div>
    </div>
  );
}
