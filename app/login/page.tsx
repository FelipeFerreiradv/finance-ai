import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard?month=12');
  }

  return (
    <div className="flex w-full h-full">
      {/* esquerda */}
      <div className="flex flex-col justify-center w-1/2 h-full p-32">
        <div className="flex flex-col gap-7 min-w-[550px]">
          <Image
            src="/logo-svg.svg"
            alt="finnance-ai"
            width={200}
            height={50}
          />
          <h1 className="font-bold text-5xl mt-[1rem]">Bem-vindo</h1>
          <p className="text-2xl text-muted-foreground">
            A Finance AI é uma plataforma de gestão financeira que utiliza IA
            para monitorar suas movimentações, e oferecer insights
            personalizados, facilitando o controle do seu orçamento.
          </p>
          <SignInButton>
            <Button variant="outline" className="max-w-[80%] h-[50px] radius">
              <FcGoogle className="mr-2" /> Entrar com Google
            </Button>
          </SignInButton>
        </div>
      </div>
      {/* direita */}
      <div className="relative w-1/2 h-full">
        <Image
          src="/login-two.png"
          alt="image of layout finnance"
          fill
          className="absolute left-0 bottom-0"
        />
      </div>
    </div>
  );
};

export default LoginPage;
