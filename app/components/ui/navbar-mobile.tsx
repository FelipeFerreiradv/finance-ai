'use client';

import { ListFilter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const NavbarMobile = () => {
  const pathname = usePathname();
  return (
    <>
      <Dialog>
        <DialogTrigger className="hidden max-md:block">
          <ListFilter width={16} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="left-0 translate-x-0 w-[270px] h-screen">
          <DialogHeader className="flex flex-col items-center gap-[4rem] pt-8">
            <DialogTitle>
              <Image
                src="/logo-svg.svg"
                alt="finnance logo"
                width={150}
                height={60}
              />
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center gap-[4rem]">
                <Link
                  href="/dashboard/?month=12"
                  className={
                    pathname === '/dashboard'
                      ? 'text-[#55B02E] font-bold'
                      : 'text-white  hover:text-[#55B02E]'
                  }
                >
                  Dashboard
                </Link>
                <Link
                  href="/transactions"
                  className={
                    pathname === '/transactions'
                      ? 'text-[#55B02E] font-bold'
                      : 'text-white  hover:text-[#55B02E]'
                  }
                >
                  Transações
                </Link>
                <Link
                  href="/subscription"
                  className={
                    pathname === '/subscription'
                      ? 'text-[#55B02E] font-bold'
                      : 'text-white  hover:text-[#55B02E]'
                  }
                >
                  Assinatura
                </Link>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavbarMobile;
