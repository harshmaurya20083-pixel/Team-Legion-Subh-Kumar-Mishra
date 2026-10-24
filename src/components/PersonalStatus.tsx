import {usePersonal} from '@/lib/personal';
import {Button} from './ui/button';
export function PersonalStatus(){const {error,retry}=usePersonal();return error?<div role="alert" className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-destructive p-3 text-sm"><p>{error}</p><Button size="sm" variant="outline" onClick={retry}>Retry account sync</Button></div>:null;}