import { FaFacebook, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";
import Link from "next/link";
import Ouedkniss from "@/components/icons/Ouedkniss";

const iconColors = "text-muted-foreground hover:text-secondary-background";

const contactLinks = [
  {
    href: "https://www.facebook.com/profile.php?id=100089458340168&paipv=0&eav=AfavK7MpqtSWeXd4hUZ4BGHTHhyVb9e2iR36uCKcDDKKEJTxfRzNIemtdS93OuL67WU",
    label: "Facebook",
    Icon: FaFacebook,
    className: iconColors,
  },
  {
    href: "https://www.instagram.com/kotek.informatique/",
    label: "Instagram",
    Icon: FaInstagram,
    className: iconColors,
  },
  {
    href: "https://www.tiktok.com/@kotek.informatique",
    label: "Tiktok",
    Icon: FaTiktok,
    className: iconColors,
  },
  {
    href: "tel:+213659865119",
    label: "Phone",
    Icon: FaWhatsapp,
    className: `${iconColors} fill-current`,
    strokeWidth: 1.5,
  },
  {
    href: "https://www.ouedkniss.com/store/26245/kotek-informatique/accueil",
    label: "Ouedkniss",
    Icon: Ouedkniss,
    className: `${iconColors} w-7`,
  },
];

export default function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between px-4 py-10 sm:px-6 border-t mt-16 gap-6 sm:gap-0 mx-10">
      <p className="text-sm text-muted-foreground text-center">
        &copy; {currentYear} Kotek. All rights reserved.
      </p>
      <div className="flex space-x-6">
        {contactLinks.map(({ href, label, Icon, className, strokeWidth }) => (
          <Link key={label} href={href} aria-label={label} prefetch={false}>
            <Icon
              className={`h-5 w-5 ${className}`}
              strokeWidth={strokeWidth}
            />
          </Link>
        ))}
      </div>
    </footer>
  );
}
