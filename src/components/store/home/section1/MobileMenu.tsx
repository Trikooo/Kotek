import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  CircleUserRound,
  LogOut,
  Settings,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Store,
  LayoutGrid,
  Building2,
  PhoneCall,
} from "lucide-react";

const MobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) => {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const navigation = [
    { name: "Store", href: "/store", icon: Store },
    { name: "Categories", href: "/categories", icon: LayoutGrid },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  const authItems = [
    { name: "My Cart", href: "/cart", icon: ShoppingCart },
    { name: "Profile", href: "/profile", icon: User },
    { name: "My Orders", href: "/orders", icon: ShoppingCart },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Logout", href: "/api/auth/signout", icon: LogOut },
  ];

  if (session?.user?.role === "ADMIN") {
    authItems.unshift({
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    });
  }

  const unauthItems = [
    { name: "Log in", href: "/login", icon: LogIn },
    { name: "Register", href: "/login?create=true", icon: UserPlus },
  ];

  return (
    <Dialog
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
      className="lg:hidden"
    >
      <div className="fixed inset-0 z-50" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">KOTEK</span>
            <Image
              alt="KOTEK"
              src="/kotek.png"
              className="h-8 w-auto"
              width={80}
              height={80}
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            {status === "authenticated" && session.user && (
              <div className="py-6">
                <div className="flex items-center gap-x-4">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <CircleUserRound
                      className="h-10 w-10 text-gray-400"
                      strokeWidth={1.5}
                    />
                  )}
                  <div className="text-sm font-semibold leading-6 text-gray-900">
                    {session.user.name || "User"}
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <item.icon className="mr-4 h-4 w-4" strokeWidth={1.5} />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {status === "authenticated" ? (
                <>
                  {authItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      <item.icon className="mr-4 h-4 w-4" strokeWidth={1.5} />
                      {item.name}
                      {item.name === "My Cart" &&
                        cart &&
                        cart.items.length > 0 && (
                          <span className="ml-2 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                            {cart.items.length}
                          </span>
                        )}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {unauthItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      <item.icon className="mr-4 h-6 w-6" strokeWidth={1.5} />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default MobileMenu;
