import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import SideBarContext from "./SideBarContext";
import { useContext } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const {isExpanded} = useContext(SideBarContext)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={` flex space-x-3 p-3 rounded-lg
              ${
                isActive
                  ? "text-primary bg-slate-200"
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
              }`}
          >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
            <span className={`${isExpanded? "": "sr-only"}`}>{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarLink;

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
// import { LucideIcon } from "lucide-react";

// interface SidebarLinkProps {
//   href: string;
//   icon: LucideIcon;
//   label: string;
// }

// const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon: Icon, label }) => {
//   const pathname = usePathname();
//   const isActive = pathname === href;

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Link
//             href={href}
//             className={`flex h-9 w-full items-center rounded-lg justify-center transition-colors md:h-8 md:w-full py-5
//               ${isActive ? 'text-primary bg-slate-200' : 'text-muted-foreground hover:text-foreground hover:bg-slate-200'}`}
//           >
//             <div className="flex items-center justify-start gap-3 pr-14 w-full">
//               <Icon className="ml-1 h-5 w-5" />
//               <span className="sr-only">{label}</span>
//             </div>
//           </Link>
//         </TooltipTrigger>
//         <TooltipContent side="right">{label}</TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }

// export default SidebarLink;
