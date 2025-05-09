import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="text-4xl font-bold text-center">404 Not Found</h1>
      <p className="text-center">ページが見つかりませんでした。</p>
      <p className="text-center mt-8"><Link to="/" className="underline underline-offset-2">トップページに戻る</Link></p>
    </div>
  )
}