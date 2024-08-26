import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"

export default function SearchComp() {
  return(
    <div className="relative ml-auto flex items-center md:grow-0">
    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" strokeWidth={1.5}/>
    <Input
      type="search"
      placeholder="Search..."
      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
    />
  </div>
  )
};
