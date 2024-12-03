import { auth, clerkClient } from '@clerk/nextjs/server';
import { Check, X } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import AquirePlanButton from './_components/aquire-plan-button';
import { redirect } from 'next/navigation';
import { getCurrentMonthTransactions } from '../_data/get-month-current-transaction';

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const user = (await clerkClient()).users.getUser(userId);
  const currentMonthTransactions = await getCurrentMonthTransactions();
  const hasPremiumPlan =
    (await user).publicMetadata.subscriptionPlan === 'premium';
  return (
    <>
      <Navbar />

      <section className="flex flex-col m-10">
        <h1 className="font-bold text-[24px]">Assinatura</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex flex-col w-[450px] h-[475px] border rounded-[8px] my-8">
              <div className="flex flex-col items-center justify-center my-10">
                <h2 className="font-normal text-[24px]">Plano Básico</h2>
                <div className="flex items-center gap-3">
                  <p className="text-[36px]">R$</p>
                  <p className="text-[60px]">0</p>
                  <p className="font-normal text-[24px] text-[#71717A]">/mês</p>
                </div>
              </div>
              <div className="w-full h-[.3px] bg-[#ffffff21]"></div>
              <div className="flex flex-col gap-5 m-12">
                <div className="flex items-center gap-5">
                  <Check width={24} className="text-[#55B02E]" />{' '}
                  <p className="font-light text-[16px]">
                    Apenas 10 transações por dia{' '}
                    <span className="font-bold">
                      <b className="font-bold text-[#55B02E]">
                        {currentMonthTransactions}
                      </b>
                      /10
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <X width={24} />{' '}
                  <p className="font-light text-[16px]">
                    Relatórios de IA ilimitados
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <X width={24} /> <p className="font-light text-[16px]">...</p>
                </div>
              </div>
              {hasPremiumPlan ? (
                ''
              ) : (
                <div className="absolute flex items-center justify-center left-8 top-12 w-[67px] h-[28px] rounded-full text-[16px] text-[#55B02E] bg-[#55B02E14]">
                  Atual
                </div>
              )}
              <div className="flex items-center justify-center"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex flex-col w-[450px] h-[475px] border rounded-[8px] my-8">
              <div className="flex flex-col items-center justify-center my-10">
                {hasPremiumPlan && (
                  <div className="absolute flex items-center justify-center left-8 top-12 w-[67px] h-[28px] rounded-full text-[16px] text-[#55B02E] bg-[#55B02E14]">
                    Atual
                  </div>
                )}
                <h2 className="font-normal text-[24px]">Plano Pro</h2>
                <div className="flex items-center gap-3">
                  <p className="text-[36px]">R$</p>
                  <p className="text-[60px]">19</p>
                  <p className="font-normal text-[24px] text-[#71717A]">/mês</p>
                </div>
              </div>
              <div className="w-full h-[.3px] bg-[#ffffff21]"></div>
              <div className="flex flex-col gap-5 m-12">
                <div className="flex items-center gap-5">
                  <Check width={24} className="text-[#55B02E]" />{' '}
                  <p className="font-light text-[16px]">
                    Transações ilimitadas
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <Check width={24} className="text-[#55B02E]" />{' '}
                  <p className="font-light text-[16px]">
                    Relatórios de IA ilimitados
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <Check width={24} className="text-[#55B02E]" /> <p>...</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <AquirePlanButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SubscriptionPage;
