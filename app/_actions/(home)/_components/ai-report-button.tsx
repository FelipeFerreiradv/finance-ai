'use client';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { FileText, Loader2Icon } from 'lucide-react';
import { generateAiReport } from '../_actions/generate-ai-report';
import { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface AIReportProps {
  month: string;
  hasPremiumPlan: boolean;
}

const ReportAiButton = ({ month, hasPremiumPlan }: AIReportProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const handleGeneratesReportClick = async () => {
    try {
      setReportIsLoading(true);
      const aireport = await generateAiReport({ month });
      console.log({ aireport });
      setReport(aireport);
    } catch (error) {
      console.log(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button
            className="flex items-center gap-4 bg-transparent"
            variant={'outline'}
          >
            Relatório AI <FileText width={16} />
          </Button>
        </DialogTrigger>
        {hasPremiumPlan ? (
          <>
            <DialogContent className="max-w-[600px] max-h-[800px]">
              <DialogHeader className="flex fle-col gap-6">
                <DialogTitle className="flex items-center gap-2">
                  <FileText
                    width={16}
                    className="font-bold text-[18px] text-[#55B02E] leading-6"
                  />
                  Relatorio IA
                </DialogTitle>
                <DialogDescription className="font-normal text-[14px] leading-7 text-[#71717A]">
                  Use a inteligência artificial para gerar relatórios com
                  insights sobre suas finanças
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="prose prose-h3:text-white prose-h4:text-white max-h-[550px] prose-strong:text-white text-white">
                <Markdown>{report}</Markdown>
              </ScrollArea>
              <DialogFooter className="flex items-center gap-4">
                <DialogClose>
                  <Button className="w-[120px]" size={'lg'} variant={'outline'}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  className="bg-[#55B02E] text-white w-[120px]"
                  size={'lg'}
                  variant={'ghost'}
                  onClick={handleGeneratesReportClick}
                  disabled={reportIsLoading}
                >
                  {reportIsLoading && <Loader2Icon className="animate-spin" />}
                  Gerar Relatorio
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        ) : (
          <div>
            <DialogContent>
              <DialogHeader className="flex fle-col gap-6">
                <DialogTitle className="flex items-center gap-2">
                  <FileText
                    width={16}
                    className="font-bold text-[18px] text-[#55B02E] leading-6"
                  />
                  Relatorio IA
                </DialogTitle>
                <DialogDescription className="font-normal text-[14px] leading-7">
                  Você precisa assinar o plano premium para ter acesso a
                  relatórios!
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="prose prose-h3:text-white prose-h4:text-white prose-strong:text-white max-h-[100vh] text-white">
                <Markdown>{report}</Markdown>
              </ScrollArea>
              <DialogFooter>
                <DialogClose className="flex gap-4">
                  <Button className="w-[160px]" size={'lg'} variant={'outline'}>
                    Cancelar
                  </Button>
                  <Button
                    className="bg-[#55B02E] text-white w-[160px]"
                    size={'lg'}
                    variant={'link'}
                  >
                    <Link href="/subscription"> Assinar o plano premium</Link>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>{' '}
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ReportAiButton;
