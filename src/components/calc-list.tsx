export default function CalcList() {
  
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
      <li className="bg-emerald-100 p-2 rounded-lg text-sm">ゾロさんがルフィさんに2700円を支払う</li>
      <li className="bg-emerald-100 p-2 rounded-lg text-sm">サンジさんがルフィさんに9600円を支払う</li>        
    </ul>
  </div>
  )
}