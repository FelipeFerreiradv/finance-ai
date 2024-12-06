import { Button } from '@/app/components/ui/button';
import { Input } from './ui/input';
import { MoneyInput } from './money-input';
import { DatePicker } from './ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { z } from 'zod';
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { upsertTransaction } from '../_actions/upsert-transaction';

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TransactionType.EXPENSE, label: 'Despesa' },
  { value: TransactionType.DEPOSITE, label: 'Deposito' },
  { value: TransactionType.INVESTIMENT, label: 'Investimento' },
];

export const TRANSACTION_PAYMENTMETHOD_OPTIONS = [
  { value: TransactionPaymentMethod.CASH, label: 'Dinheiro' },
  { value: TransactionPaymentMethod.PIX, label: 'PIX' },
  { value: TransactionPaymentMethod.CREDIT_CARD, label: 'Cartão de Credito' },
  { value: TransactionPaymentMethod.DEBIT_CARD, label: 'Cartão de Debito' },
  {
    value: TransactionPaymentMethod.BANK_TRANSFER,
    label: 'Transferência Bancária',
  },
  { value: TransactionPaymentMethod.BANK_SPLIT, label: 'Boleto Bancário' },
  { value: TransactionPaymentMethod.OTHER, label: '-' },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: TransactionCategory.EDUCATION, label: 'Educação' },
  { value: TransactionCategory.ENTERTAINMENT, label: 'Entretenimento' },
  { value: TransactionCategory.FOOD, label: 'Comida' },
  { value: TransactionCategory.SALARY, label: 'Salário' },
  { value: TransactionCategory.HEALTH, label: 'Saude' },
  { value: TransactionCategory.HOUSING, label: 'Moradia' },
  { value: TransactionCategory.TRANSPORTATION, label: 'Transporte' },
  { value: TransactionCategory.UTILITY, label: 'Utilidade' },
  { value: TransactionCategory.OTHER, label: 'Outros' },
];

// Props
interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: FormSchema;
  transactionId?: string; // Adicione esta linha
}

// Pre definições do formulário
const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'O nome é obrigatório.',
  }),
  amount: z
    .number({
      required_error: 'O valor é obrigátório.',
    })
    .positive({
      message: 'O valor deve ser positivo.',
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: 'O tipo é obrigátório.',
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: 'A categoria é obrigátória.',
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: 'O método de pagamento é obrigátório.',
  }),
  date: z.date({
    required_error: 'O método de pagamento é obrigátório.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  transactionId,
  defaultValues,
}: UpsertTransactionDialogProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      amount: 0,
      category: TransactionCategory.OTHER,
      date: new Date(),
      name: '',
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      // console.log('Data being submitted:', data); // Adicione esta linha para depuração
      await upsertTransaction({ ...data, id: transactionId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdate = Boolean(transactionId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger></DialogTrigger>
      <DialogContent className="flex flex-col max-sm: w-[300px]">
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle className="font-bold text-[20px]">
            {isUpdate ? 'Atualizar ' : 'Adicionar '}
            Transação
          </DialogTitle>
          <DialogDescription className="font-normal text-[14px]">
            Insira as informações abaixo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-white text-[14px]">
                    Título
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-white text-[14px]">
                    Valor
                  </FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="R$0.000,00"
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-white text-[14px]">
                    Tipo de Transação
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-14">
                      <SelectValue
                        placeholder="Selecione"
                        className="font-bold text-white text-[16px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipos de Transação</SelectLabel>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-white text-[14px]">
                    Método de Pagamento
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-14">
                      <SelectValue
                        placeholder="Selecione"
                        className="font-bold text-white text-[16px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Método de Pagamento</SelectLabel>
                        {TRANSACTION_PAYMENTMETHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-white text-[14px]">
                    Categoria
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-14">
                      <SelectValue
                        placeholder="Selecione"
                        className="font-bold text-white text-[16px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold text-white text-[14px]">
                    Data
                  </FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex items-center justify-center gap-4 w-[100% - .5rem] mx-[.5rem]">
              <Button className="w-1/2 h-[35px] rounded-full font-bold text-[14px] text-white bg-[#55B02E] hover:bg-[#55B02E]">
                {!isUpdate ? 'Adicionar' : 'Atualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
