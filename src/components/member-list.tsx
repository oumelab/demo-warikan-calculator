import {useCalcStore} from "../store/useCalcStore";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {PlusIcon} from "lucide-react";
import { useRef } from "react";

export default function MemberList() {
  // const {members, addMember, memberInput, updateMemberInput} = useCalcStore();
  const members = useCalcStore((state) => state.members);
  const addMember = useCalcStore((state) => state.addMember);
  const memberInput = useCalcStore((state) => state.memberInput);
  const updateMemberInput = useCalcStore((state) => state.updateMemberInput);

  // IME入力中かどうかを追跡する
  const isComposingRef = useRef(false);

  // エンターキーでメンバーを追加
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME入力中はキー処理をスキップ
    if (isComposingRef.current) return;

    if (e.key === 'Enter' && memberInput.trim()) {
      addMember();
    }
  };

  // IME入力の開始時に呼ばれる
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  // IME入力の終了時に呼ばれる
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    
    // IME確定直後にEnterキーとして処理されないように少し遅延させる
    setTimeout(() => {
      // IME入力が終わった後、入力欄にフォーカスがあるときのみエンターキー処理
      const inputEl = e.target as HTMLInputElement;
      if (document.activeElement === inputEl && inputEl.value.trim()) {
        // エンターキーが押されていたら処理（Enterキーのkeydownイベントがcompositionendの後に発生する場合の対策）
        // ここでは何もしない（handleKeyDownに任せる）
      }
    }, 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="size-12
       rounded-full border border-neutral-300 grid place-items-center"
      >
        <span className="text-2xl">👥</span>
      </div>
      <h2 className="text-lg font-bold">メンバーを追加</h2>
      <div>
        <div className="flex items-center gap-1">
          <Input
            type="text"
            onChange={(e) => updateMemberInput(e.target.value)}
            value={memberInput || ""}
            placeholder="名前を入力"
            className="flex-1 border-neutral-300"
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <Button
            className=""
            onClick={addMember}
            disabled={!memberInput.trim()}
          >
            <PlusIcon />
            追加
          </Button>
        </div>
        <ul className="mt-3 flex gap-2 flex-wrap">
          {members?.map((member) => (
            <li
              key={member.id}
              className="w-fit bg-blue-100 px-3 py-1 rounded-full text-sm"
            >
              {member.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
