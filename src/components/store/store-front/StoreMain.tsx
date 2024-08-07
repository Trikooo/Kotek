import { Search } from "lucide-react";

export default function StoreMain() {
  return (
    <div>
       <div className="relative">
            <input
              type="search"
              placeholder="What are you looking for?"
              className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2" strokeWidth={1.5}/>
          </div>
          <div>
            
          </div>
    </div>
  );
}
