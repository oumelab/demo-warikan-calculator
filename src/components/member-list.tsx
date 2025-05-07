import {useCalcStore} from "../hooks/useCalcStore";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {PlusIcon} from "lucide-react";

export default function MemberList() {
  const {members, addMember, memberInput, updateMemberInput} = useCalcStore();

  // キーボードのEnterキーを押したときにメンバーを追加
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && memberInput.trim()) {
      addMember();
    }
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
