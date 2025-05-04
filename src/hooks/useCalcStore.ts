import { create } from 'zustand';

type membersStore ={
  members: string[] | null;
  expenses: {
    id: string; // crypto.randomUUID()
    name: string;
    detail: string;
    amount: number;
  }[] | null;
  totalExpenses: number;
  setMembers: (members: string[]) => void;
  setExpenses: (expenses: {
    id: string;
    name: string;
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