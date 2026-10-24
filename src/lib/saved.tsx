// Saved items: one shared list of IDs, kept in React context and mirrored to localStorage.
// Every page reads from the same place, so save state is always consistent.
import type { ReactNode } from 'react';
import { usePersonal } from './personal';
export function SavedProvider({children}:{children:ReactNode}) { return children; }
export function useSaved() {
  const {state,toggle,ready,busy}=usePersonal();
  const savedIds=state.marks.filter(m=>m.kind==='saved').map(m=>m.id);
  return {savedIds,isSaved:(id:string)=>savedIds.includes(id),toggleSaved:(id:string)=>{void toggle('saved',id);},ready,busy};
}
