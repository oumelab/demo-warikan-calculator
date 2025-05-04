import { create } from 'zustand';

type membersStore ={
  members: {
    id: string;
    name: string;
  }[] | [];
  expenses: {
    id: string; // crypto.randomUUID()
    memberId: string;
    detail: string;
    amount: number;
  }[] | [];
  totalExpenses: number;
  setMembers: (members: {
    id: string;
    name: string;
  }[]) => void;
  setExpenses: (expenses: {
    id: string;
    memberId: string;
    detail: string;
    amount: number;
  }[]) => void;
  setTotalExpenses: (totalExpenses: number) => void;
}

export const useMembersStore = create<membersStore>((set) => ({
  members: [],
  expenses: [],
  totalExpenses: 0,
  setMembers: (members) => set({ members }),
  setExpenses: (expenses) => set({ expenses }),
  setTotalExpenses: (totalExpenses) => set({ totalExpenses }),
}));