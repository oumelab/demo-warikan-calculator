import { Expense } from "../types";
import useWarikanStore from "../store/useWarikanStore";

type MemberCalculation = {
  [key: string]: number;
};

// 各メンバーが支払った個人総額を算出
const calculateTotalPaidByMember = (members: string[], expenses: Expense[]) => {
  const totalPaidByMember: MemberCalculation = {}; // メンバーごとの支払総額を格納するオブジェクト
  
  members.forEach((member) => (totalPaidByMember[member] = 0)); // メンバー名と支払額の初期値0をオブジェクトに追加
  expenses.forEach((expense) => {
    totalPaidByMember[expense.paidBy] += expense.amount; // 立て替え記録のpaidBy（支払った人）をキーとして、amount（立て替えた金額）を、初期値の0に足す
  });
  
  return totalPaidByMember;
};

// 全員の総額を算出
const calculateTotal = (totalPaidByMember: MemberCalculation) => {
  return Object.values(totalPaidByMember).reduce((a, b) => a + b, 0);
};

// １人あたりが本来支払うべき金額（割り勘）を算出
const calculateTotalPerMember = (total: number, members: string[]) => {
  return total / members.length;
};

// それぞれのメンバーの過払い額 or 不足額を算出
const calculateDifferences = (
  members: string[],
  totalPaidByMember: MemberCalculation,
  totalPerMember: number
) => {
  // メンバーごとの過不足を格納するオブジェクト
  const differences: MemberCalculation = {};
  // 各メンバーに対して、実際に支払った合計（totalPaidByMember[member]）から1人あたりの割り勘額（totalPerMember）を引き、過不足を計算
  members.forEach((member) => {
    differences[member] = totalPaidByMember[member] - totalPerMember;
  });
  return differences; // 正の値は過払い、負の値は支払いが不足
};

// 各メンバーの過不足を相殺し、最適な精算方法を算出します。
const calculateWarikanPlan = (differences: MemberCalculation) => {
  const warikanPlan: { from: string; to: string; amount: number }[] = [];

  // 過払いしているメンバーと不足しているメンバーを分ける
  const overpaidMembers = Object.keys(differences).filter(
    (member) => differences[member] > 0
  );
  const underpaidMembers = Object.keys(differences).filter(
    (member) => differences[member] < 0
  );

  // 過払いのメンバーと過不足のメンバーがいる場合、記述された処理を繰り返し
  // 絶対値が小さい方の額（amount）を精算することで、片方の過不足を 0 にする
  while (overpaidMembers.length > 0 && underpaidMembers.length > 0) {
    const receiver = overpaidMembers[0];
    const payer = underpaidMembers[0];
    const amount = Math.min(differences[receiver], -differences[payer]);

    // warikanPlanに、このお金の受け渡しを記録して、過不足の金額(differences)を更新
    if (amount > 0) {
      warikanPlan.push({
        from: payer,
        to: receiver,
        amount: Math.round(amount),
      });
      differences[receiver] -= amount;
      differences[payer] += amount;
    }

    // receiverか、payerの少なくともどちらかは、清算したことで、過不足額が０になっているはずなので、配列から取り除く
    if (differences[receiver] === 0) overpaidMembers.shift();
    if (differences[payer] === 0) underpaidMembers.shift();
  }

  return warikanPlan;
};


  /**
   * 割り勘を行うための最適な精算方法を求めます。
   *
   * @remarks
   * このフックでは、以下の処理が行われます：
   * 1. 各メンバーが支払った個人総額を算出
   * 2. 全員の総額を算出
   * 3. １人あたりが本来支払うべき金額（割り勘）を算出
   * 4. それぞれのメンバーの過払い額または不足額を算出
   * 5. 各メンバーの過不足を比較して相殺
   */
  const useResultLogic = () => {
    const members = useWarikanStore((state) => state.members);
    const expenses = useWarikanStore((state) => state.expenses);
  
    if (members.length === 0 || expenses.length === 0) {
      return [];
    }
  
    const totalPaidByMember = calculateTotalPaidByMember(members, expenses);
    const total = calculateTotal(totalPaidByMember);
    const totalPerMember = calculateTotalPerMember(total, members);
    const differences = calculateDifferences(
      members,
      totalPaidByMember,
      totalPerMember
    );
  
    return calculateWarikanPlan(differences);
};

export default useResultLogic;