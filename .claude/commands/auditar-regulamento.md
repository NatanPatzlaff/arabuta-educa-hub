---
description: Audita o site inteiro contra o regulamento do Summit e emite relatório de conformidade
---

# Auditoria de conformidade com o regulamento

Você vai auditar o estado atual deste site contra o regulamento do Summit. Esta é uma **verificação**, não uma implementação: **não altere código durante a auditoria.**

## Procedimento

1. Leia `docs/regulamento.md` por completo.
2. Leia `docs/requisitos.md` por completo.
3. Varra o código do projeto: páginas, componentes, formulários, schemas de validação, textos, rotas, configurações de data/prazo e conteúdo estático.
4. Para **cada item** de `docs/requisitos.md`, determine o status com base no que existe de fato no código — não no que o checklist diz estar marcado. **Marcações anteriores não são evidência; reverifique tudo.**

## Regras da auditoria

- Um item só é `IMPLEMENTADO` se você encontrou onde ele está no código e pode citar arquivo e trecho. Se não achou, é `FALTANDO` — nunca presuma que existe em algum lugar não inspecionado.
- Texto exibido conta: se o regulamento exige que uma informação apareça para o usuário, ela precisa estar visível na interface, não só em um comentário ou constante não usada.
- Valores normativos (datas, cargas horárias, pesos, quantidades, limites) precisam bater **exatamente** com o regulamento. Divergência numérica é `DIVERGENTE`, não `PARCIAL`.
- Verifique também o que o site faz **além** do regulamento: campo extra que coleta dado não previsto, canal alternativo de envio, prazo diferente. Isso entra como `EXCEDENTE` e precisa ser reportado.
- Confira a seção "Armadilhas de conformidade" no fim de `docs/requisitos.md` e reporte explicitamente cada uma.

## Formato do relatório

Comece com um resumo:

```
CONFORMIDADE: X/Y itens implementados
Faltando: N · Parcial: N · Divergente: N · Excedente: N
```

Depois, agrupe por bloco (A, B, C, ...) e liste apenas os itens que **não** estão plenamente implementados:

| ID | Status | Evidência (arquivo:linha) | O que falta |
|---|---|---|---|

Em seguida, uma seção **BLOQUEADORES** com os itens que impedem o site de operar legalmente ou de cumprir o regulamento — priorize: dados pessoais (bloco L), prazos (D4, K), certificação (J), separação Mostra × ProLEEI (B3, C4, C5, DP6).

Termine com **PRÓXIMOS PASSOS**: até 5 ações concretas, em ordem de prioridade.

## Ao final

Atualize os marcadores de status em `docs/requisitos.md` para refletir o que você constatou. Essa é a única alteração de arquivo permitida nesta auditoria.
