'use server';

import { db } from '@/app/_lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { GenerateAiReportSchema, generateAiReportSchema } from './schema';

const DUMMY_REPORT =
  '### Relatório de Finanças Pessoais\n\n#### Resumo Geral das Finanças\nAs transações listadas foram analisadas e as seguintes informações foram extraídas para oferecer insights sobre suas finanças:\n\n- **Total de despesas:** R$ 19.497,56\n- **Total de investimentos:** R$ 14.141,47\n- **Total de depósitos/correntes:** R$ 10.100,00 (considerando depósitos de salário e outros)\n- **Categoria de maior despesa:** Alimentação\n\n#### Análise por Categoria\n\n1. **Alimentação:** R$ 853,76\n2. **Transporte:** R$ 144,05\n3. **Entretenimento:** R$ 143,94\n4. **Outras despesas:** R$ 17.828,28 (inclui categorias como saúde, educação, habitação)\n\n#### Tendências e Insights\n- **Despesas Elevadas em Alimentação:** A categoria de alimentação representa uma parte significativa de suas despesas, com um total de R$ 853,76 nos últimos meses. É importante monitorar essa categoria para buscar economia.\n  \n- **Despesas Variáveis:** Outros tipos de despesas, como entretenimento e transporte, também se acumulam ao longo do mês. Identificar dias em que se gasta mais pode ajudar a diminuir esses custos.\n  \n- **Investimentos:** Você fez investimentos significativos na ordem de R$ 14.141,47. Isso é um bom sinal para a construção de patrimônio e aumento de sua segurança financeira no futuro.\n  \n- **Categorização das Despesas:** Há uma série de despesas listadas como "OUTRA", que podem ser reavaliadas. Classificar essas despesas pode ajudar a ter um controle melhor das finanças.\n\n#### Dicas para Melhorar Sua Vida Financeira\n\n1. **Crie um Orçamento Mensal:** Defina um limite de gastos para cada categoria. Isso ajuda a evitar gastos excessivos em áreas como alimentação e entretenimento.\n\n2. **Reduza Gastos com Alimentação:** Considere cozinhar em casa com mais frequência, planejar refeições e usar listas de compras para evitar compras impulsivas.\n\n3. **Revise Despesas Recorrentes:** Dê uma olhada nas suas despesas fixas (como saúde e educação) para verificar se estão adequadas às suas necessidades e se há espaço para redução.\n\n4. **Estabeleça Metas de Poupança:** Com base em seus depósitos e investimentos, estabeleça metas específicas para economizar uma porcentagem do seu rendimento mensal. Estimar quanto você pode economizar pode ajudar a garantir uma reserva de emergência.\n\n5. **Diminua os Gastos com Entretenimento:** Planeje lazer de forma que não exceda seu orçamento, busque opções gratuitas ou de baixo custo. Lembre-se de que entretenimento também pode ser feito em casa.\n\n6. **Reavalie Seus Investimentos:** Certifique-se de que seus investimentos estejam alinhados com seus objetivos financeiros a curto e longo prazo. Pesquise alternativas que podem oferecer melhor retorno.\n\n7. **Acompanhe Suas Finanças Regularmente:** Use aplicativos de gerenciamento financeiro para controlar suas despesas e receitas, ajudando você a manter-se informado sobre sua saúde financeira.\n\n#### Conclusão\nMelhorar sua vida financeira é um processo contínuo que envolve planejamento, monitoramento e ajustes regulares. Com as análises e as sugestões acima, você pode começar a tomar decisões financeiras mais estratégicas para alcançar seus objetivos. Lembre-se que cada real economizado é um passo a mais em direção à segurança financeira!';

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return DUMMY_REPORT;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const user = (await clerkClient()).users.getUser(userId);
  const hasPremiumPlan =
    (await user).publicMetadata.subscriptionPlan === 'premium';
  if (!hasPremiumPlan) {
    throw new Error('Unauthorized');
  }

  // take transaction of month received
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2024-${month}-01`),
        lt: new Date(`2024-${month}-31`),
      },
    },
  });

  // send transactions to gpt chat and ask to itgenerate a report with insights
  const content = `**PARTE 1: Abaixo eu vou informar:**

1. Uma **[ação]** para você executar;  
2. A **[persona]** que você representa;  
3. A sua principal **[tarefa]**;  
4. Os **[passos]** que você deve seguir para executar a ação e tarefa;  
5. Um conjunto de **[dados]**;  
6. O **[contexto]** da situação;  
7. O **[formato]** da saída.

**PARTE 2:**  
**[Ação]**  
Quero que você analise as minhas finanças com base nas transações que vou fornecer e crie um relatório detalhado, com insights, dicas e sugestões para melhorar minha vida financeira. 

**[Persona]**  
Você é um analista financeiro altamente qualificado, com vasta experiência em analisar hábitos de consumo, identificar padrões financeiros e sugerir estratégias de economia. Você é analítico, meticuloso e capaz de fazer recomendações específicas baseadas nas informações fornecidas.

**[Tarefa]**  
Sua tarefa é analisar as transações financeiras fornecidas e criar um relatório detalhado com insights sobre o meu comportamento financeiro. Identifique padrões de gastos, áreas onde posso reduzir despesas e onde estou gastando mais do que deveria. Também forneça dicas práticas de como melhorar meu controle financeiro, aumentar minha poupança, reduzir dívidas ou otimizar meus investimentos. Ao final, forneça um plano de ação para melhorar minha saúde financeira.

**[Passos]**  
1. Incorpore a **[persona]** descrita neste passo a passo;  
2. Analise as transações financeiras que serão fornecidas, divididas por ponto e vírgula, no formato: {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. Que sao ${transactions.map((transaction) => `${transaction.date.toLocaleDateString('pt-BR')}-R$${transaction.amount}-${transaction.type}-${transaction.category}`).join(':')};  
3. Identifique padrões de gastos nas categorias fornecidas e calcule os totais de cada uma delas;  
4. Forneça insights sobre o meu comportamento financeiro com base nos gastos em cada categoria;  
5. Identifique áreas onde estou gastando mais do que o recomendado e sugira formas de reduzir essas despesas;  
6. Forneça recomendações para economizar mais, reduzir dívidas ou melhorar minha situação de investimento;  
7. Apresente um resumo das principais conclusões e crie um plano de ação detalhado para melhorar minhas finanças;  
8. Faça o trabalho com calma e considere todas as nuances financeiras.

**[Dados]**  
Crie uma análise detalhada com as seguintes informações:

- Total de gastos mensais por categoria (alimentação, moradia, transporte, lazer, saúde, etc.);
- Identificação de categorias de gastos onde há excessos;
- Sugestões específicas para redução de gastos em cada categoria;
- Dicas práticas de como aumentar a poupança ou realizar investimentos inteligentes;
- Identificação de padrões recorrentes (por exemplo, despesas imprevistas ou categorias com gastos acima da média);
- Recomendações para melhorar a pontuação de crédito ou controlar melhor os gastos no cartão de crédito.

**[Contexto]**  
Essas informações serão utilizadas para elaborar um plano de ação visando a melhoria do meu controle financeiro pessoal. O objetivo é otimizar minhas finanças, aumentando a poupança e reduzindo custos desnecessários.

**[Formato]**  
Crie um relatório detalhado em português brasileiro, estruturado em tópicos e subtópicos. Apresente os dados em formato de tabela, gráficos ou listas, quando necessário, e forneça um resumo executivo ao final, destacando as ações mais importantes a serem tomadas para alcançar a saúde financeira desejada.

---

**PARTE 3:**  
**[Ação]**  
Com base nas transações fornecidas e na análise feita, quero que você me forneça uma lista de recomendações específicas, destacando as áreas de maior potencial de melhoria financeira.

**[Formato]**  
Crie uma lista com:  
- **5 áreas onde posso reduzir meus gastos significativamente**:  
   1. **Categoria X**: descrição detalhada da área de gasto e sugestão de como reduzir.  
   2. **Categoria Y**: descrição detalhada da área de gasto e sugestão de como reduzir.  
   3. **Categoria Z**: descrição detalhada da área de gasto e sugestão de como reduzir.  
   4. **Categoria W**: descrição detalhada da área de gasto e sugestão de como reduzir.  
   5. **Categoria V**: descrição detalhada da área de gasto e sugestão de como reduzir.

- **5 dicas para otimizar minha poupança ou investimentos**:  
   1. **Dica 1**: descrição detalhada.  
   2. **Dica 2**: descrição detalhada.  
   3. **Dica 3**: descrição detalhada.  
   4. **Dica 4**: descrição detalhada.  
   5. **Dica 5**: descrição detalhada.

- **5 hábitos financeiros a serem adotados**:  
   1. **Hábito 1**: descrição detalhada.  
   2. **Hábito 2**: descrição detalhada.  
   3. **Hábito 3**: descrição detalhada.  
   4. **Hábito 4**: descrição detalhada.  
   5. **Hábito 5**: descrição detalhada.

- **5 erros financeiros que preciso evitar**:  
   1. **Erro 1**: descrição detalhada.  
   2. **Erro 2**: descrição detalhada.  
   3. **Erro 3**: descrição detalhada.  
   4. **Erro 4**: descrição detalhada.  
   5. **Erro 5**: descrição detalhada.

--- `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Você é um especialista em gestão e organização de finanças pessoais. Você ajkuda as pessoas a organizarem melhor as suas finanças.',
      },
      {
        role: 'user',
        content,
      },
    ],
  });

  // take the report generate by gpt chat and show to user
  return completion.choices[0].message.content;
};
