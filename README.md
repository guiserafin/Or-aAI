# OrçaAI — MVP

Transforme pedidos de clientes em orçamentos profissionais.

O prestador cola a mensagem que recebeu (normalmente pelo WhatsApp), o OrçaAI
identifica os serviços, o prestador informa os preços e o app entrega um
documento pronto para compartilhar.

Este repositório é um **MVP de validação**: o objetivo é colocar o app na mão de
5–10 prestadores e observar se eles realmente usam a ferramenta. Não há login,
backend, pagamentos nem integração oficial com o WhatsApp.

## Rodando

```bash
npm install
npx expo start
```

Abra no Expo Go (iOS/Android) ou pressione `w` para rodar no navegador.
Nada precisa ser configurado antes do primeiro uso.

Outros comandos úteis:

```bash
npm run typecheck   # tsc --noEmit
npm run web         # abre direto no navegador
```

## O fluxo

```
Home  →  Novo orçamento  →  Processando  →  Orçamento  →  Revisar e precificar  →  Compartilhar
```

1. **Home** — proposta de valor, CTA único e uma demonstração curta.
2. **Novo orçamento** — nome do cliente, mensagem colada e tipo de serviço.
   A seção *Exemplos* preenche tudo com um toque, para demonstrar em segundos.
3. **Processando** — checklist animado enquanto a IA lê a mensagem.
4. **Orçamento** — o documento. Se ainda faltam preços, um aviso leva direto
   para a tela de precificação.
5. **Revisar e precificar** — o prestador confere os itens e informa os valores;
   o total é calculado ao vivo.
6. **Compartilhar** — texto pronto para o WhatsApp (Share API) ou PDF
   (`expo-print` + `expo-sharing`).

O histórico fica em **Orçamentos**, persistido localmente com AsyncStorage.
Qualquer orçamento pode ser reaberto e editado.

## Preços: quem define é o prestador

Foi adotada a **Opção A**. A IA identifica serviços, quantidades, medidas e
observações, mas **nunca inventa valores**. Enquanto nenhum item tiver preço, o
total aparece como *A definir* — nunca como `R$ 0,00`, que daria a entender que
o serviço é de graça. A tela de revisão sempre lembra que
*"os valores devem ser revisados antes do envio ao cliente"*.

## Arquitetura

```
app/                      rotas (Expo Router) — arquivos finos que só apontam para as telas
  _layout.tsx             Stack + providers
  index.tsx               Home
  new-budget.tsx
  processing.tsx
  budgets.tsx             histórico
  budget/[id]/index.tsx   documento
  budget/[id]/edit.tsx    revisão e precificação
  +not-found.tsx

src/
  components/   blocos reutilizáveis (Button, Field, Card, BudgetDocument, …)
  screens/      implementação de cada tela
  services/     ai, mockAi, vocabulary, share, budgetText, budgetHtml, analytics
  store/        estado global + persistência (AsyncStorage)
  types/        contratos de dados
  utils/        moeda, datas, cálculos de orçamento
  data/         tipos de serviço e exemplos de demonstração
  theme/        design tokens
```

Styling é `StyleSheet` + tokens (`src/theme`), sem NativeWind. Para um MVP que
precisa rodar de primeira em qualquer máquina, isso elimina uma camada inteira de
configuração (Babel/Metro/Tailwind) sem custo nenhum de qualidade visual.

### Trocando o mock pela IA real

`src/services/ai.ts` é a única porta de entrada. O contrato já é o definitivo:

```ts
generateBudget({ customerName, customerMessage, serviceType }): Promise<GeneratedBudget>
```

Hoje `AI_MODE = 'mock'` e a análise roda local em `src/services/mockAi.ts` — uma
heurística em português que reconhece ambientes, quantidades, medidas em metros,
área em m² e o verbo do pedido (*pintar*, *instalar*, *trocar*, *consertar*…).
Para ligar o backend, basta implementar o ramo `'remote'`:

```ts
const response = await fetch(`${API_URL}/api/ai/generate-budget`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
});
return (await response.json()) as GeneratedBudget;
```

Nenhuma tela precisa mudar.

## Métricas

`src/services/analytics.ts` concentra a instrumentação. Hoje só escreve no
console em desenvolvimento, mas os eventos que respondem às perguntas da
validação já são disparados pelas telas:

| Pergunta | Evento |
| --- | --- |
| Quantos orçamentos foram criados? | `budget_created` |
| Quantos foram editados? | `budget_edited` |
| Quantos foram compartilhados? | `budget_shared`, `budget_pdf_generated` |
| Quantos voltaram a criar outro? | `app_opened` + `new_budget_started` |

Cada orçamento também guarda `editCount` e `shareCount`, então dá para medir
manualmente olhando o histórico do aparelho.

## Fora de escopo (de propósito)

Login, cadastro, banco de dados, assinaturas, notificações, CRM, emissão fiscal,
assinatura digital, chatbot, múltiplos funcionários e permissões. Tudo isso só
faz sentido depois que a validação mostrar que os prestadores usam o produto.
