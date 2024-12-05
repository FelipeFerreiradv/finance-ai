'use client';

import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between w-full h-[60px] border-solid border-2">
      <nav className="flex items-center gap-[4rem] ml-[2rem]">
        <div>
          <Image
            src="/logo-svg.svg"
            alt="finnance logo"
            width={150}
            height={60}
          />
        </div>
        <div className="flex items-center gap-[4rem] max-md:hidden">
          <Link
            href="/dashboard/?month=9"
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
      </nav>
      <div className="mr-[2rem]">
        <UserButton showName />
      </div>
    </header>
  );
};

export default Navbar;
