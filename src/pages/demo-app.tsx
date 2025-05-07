import CalcList from "../components/calc-list";
import MemberList from "../components/member-list";
import PayList from "../components/pay-list";

export default function DemoApp() {
  return (
    <div className="py-12 px-5 bg-linear-to-tl from-sky-200 to-white min-h-screen">
      <div className="max-w-6xl mx-auto h-fit flex flex-col gap-6">
        <h1 className="text-5xl font-bold">Warikan Calculator</h1>
        <p>
          メンバーと、立て替えた記録を記入してください。
          <br />
          自動で最適な清算方法を算出します！
        </p>
      </div>
      <div className="max-w-6xl mx-auto mt-6 grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg py-6 px-4">
          <MemberList />
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg py-6 px-4">
          <PayList />
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg py-6 px-4">
        <CalcList />
        </div>
      </div>
    </div>
  );
}
