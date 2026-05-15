/**
 * bloco1.js — A Base Numérica (Arquivo Unificado)
 * Foco: Valor Posicional, 4 Operações, Divisibilidade, Primos, MMC/MDC e Potenciação
 * Clusters: SISTEMA_NUMERICO, MODELAGEM_SITUACIONAL, ALGORITMO_MULTIPLICACAO, LITERACIA_DADOS
 */

export const bloco1 = [

    // ── AULA 1: VALOR POSICIONAL E LEITURA ───────────────────────────────

    // [NOVA] QUESTÃO DE RECOMPOSIÇÃO (Resgate de Base)
    {
        id: "B1Q00", bloco: 1, aula: 1, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "recomposicao", // ADA puxa se errar o reagrupamento
        bncc: "EF06MA03", bncc_desc: "Conceito de Reagrupamento (Dinheiro)",
        display: "Você tem 1 nota de R$ 100 e precisa pagar R$ 8. Como você não tem troco, o que precisa fazer com a nota?",
        res: "Trocar por notas menores (ex: 10 de R$ 10)",
        alternativas: [
            { valor: "Trocar por notas menores (ex: 10 de R$ 10)", tipo: "acerto" },
            { valor: "Diminuir o valor da nota para R$ 92", tipo: "erro", categoria: "conceito", erro: "base10_mutacao_valor", descricao: "Acredita que a nota física pode mudar de valor.", peso: 3 },
            { valor: "Pagar com 0 reais", tipo: "erro", categoria: "estrategia", erro: "base10_fuga_problema", descricao: "Evitou a operação de troca e reagrupamento.", peso: 2 },
            { valor: "Ficar devendo o 8", tipo: "erro", categoria: "interpretacao", erro: "base10_ignora_reserva", descricao: "Ignorou que possui valor suficiente, apenas não fracionado.", peso: 1 }
        ],
        passo: "Para tirar um valor pequeno de uma nota grande, você deve 'desfazer' a nota grande em partes menores. É isso que o 'pedir emprestado' faz na conta armada!",
        dica: "Dica da ADA: Uma centena é como uma nota de 100. Você precisa trocá-la por 10 dezenas (notas de 10) para conseguir usar!"
    },

    {
        id: "B1T1Q01", bloco: 1, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA01", bncc_desc: "Valor Posicional",
        display: "Qual é o valor posicional do algarismo 4 no número 349.205?",
        res: "40.000",
        alternativas: [
            { valor: "40.000", tipo: "acerto" },
            { valor: "4", tipo: "erro", categoria: "conceito", erro: "valorposicional_ignora_ordem", descricao: "Considerou apenas o valor absoluto do dígito, ignorando a posição na base 10.", peso: 3 },
            { valor: "4.000", tipo: "erro", categoria: "procedimento", erro: "valorposicional_erro_ordem_grandeza", descricao: "Identificou a classe dos milhares, mas errou a ordem (unidade em vez de dezena).", peso: 2 },
            { valor: "400", tipo: "erro", categoria: "atencao", erro: "valorposicional_confunde_classe_simples", descricao: "Trocou a classe dos milhares pela classe das unidades simples.", peso: 1 }
        ],
        passo: "O 4 está na Dezena de Milhar. Multiplicamos o algarismo pela sua posição: 4 × 10.000 = 40.000.",
        dica: "Imagine o número num quadro: cada casa para a esquerda vale 10 vezes mais!"
    },
    
    {
        id: "B1T1Q02", bloco: 1, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA01", bncc_desc: "Valor Posicional",
        display: "No número 5.847, quanto vale o algarismo 8?",
        res: "800",
        alternativas: [
            { valor: "800", tipo: "acerto" },
            { valor: "8", tipo: "erro", categoria: "conceito", erro: "valorposicional_ignora_ordem", descricao: "Indicou o valor absoluto do algarismo isolado.", peso: 3 },
            { valor: "80", tipo: "erro", categoria: "procedimento", erro: "valorposicional_reduz_ordem", descricao: "Atribuiu o valor de dezena em vez de centena.", peso: 2 },
            { valor: "8.000", tipo: "erro", categoria: "procedimento", erro: "valorposicional_aumenta_ordem", descricao: "Atribuiu o valor de milhar em vez de centena.", peso: 2 }
        ],
        passo: "O 8 ocupa a terceira ordem (centenas). Ele representa 8 grupos de 100.",
        dica: "Conte da direita para a esquerda: Unidade, Dezena, Centena..."
    },
    {
        id: "B1T1Q03", bloco: 1, aula: 1, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF06MA01", bncc_desc: "Leitura de Números",
        display: "Como se lê corretamente o número 10.030?",
        res: "Dez mil e trinta",
        alternativas: [
            { valor: "Dez mil e trinta", tipo: "acerto" },
            { valor: "Um zero zero trinta", tipo: "erro", categoria: "conceito", erro: "leitura_algarismo_isolado", descricao: "Leu os dígitos individualmente, sem compreender a estrutura das classes numéricas.", peso: 3 },
            { valor: "Cem e trinta", tipo: "erro", categoria: "conceito", erro: "leitura_ignora_classe_milhar", descricao: "Não reconheceu a ordem de grandeza do milhar.", peso: 3 },
            { valor: "Dez mil trinta", tipo: "erro", categoria: "atencao", erro: "leitura_omissao_conectivo", descricao: "Leitura correta, mas omitiu a conjunção gramatical padrão.", peso: 1 }
        ],
        passo: "O 10 está na classe dos milhares. O 30 na classe simples. Lemos: Dez mil e trinta.",
        dica: "A primeira parte (antes do ponto) diz quantos milhares o número tem."
    },

    // ── AULA 2: ADIÇÃO E SUBTRAÇÃO ───────────────────────────────────────
    
    {
        id: "B1T1Q11", bloco: 1, aula: 2, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Adição com Reagrupamento",
        display: "Calcule a soma: 1.245 + 879",
        res: "2.124",
        alternativas: [
            { valor: "2.124", tipo: "acerto" },
            { valor: "2.024", tipo: "erro", categoria: "procedimento", erro: "adicao_falha_reagrupamento_centena", descricao: "Esqueceu de somar a reserva (o 'vai um') na coluna das centenas.", peso: 2 },
            { valor: "1.124", tipo: "erro", categoria: "conceito", erro: "adicao_ignora_reagrupamento_milhar", descricao: "Não converteu 10 centenas em 1 unidade de milhar no final da conta.", peso: 3 },
            { valor: "2.114", tipo: "erro", categoria: "calculo", erro: "adicao_erro_tabuada", descricao: "Cometeu um erro de soma simples em uma das colunas.", peso: 1 }
        ],
        passo: "5+9=14 (sobe 1). 4+7+1=12 (sobe 1). 2+8+1=11 (sobe 1). 1+1=2. Total: 2.124.",
        dica: "Não esqueça: sempre que passar de 9 em uma coluna, 1 dezena deve 'subir' para a próxima casa!"
    },
    {
        id: "B1T1Q12", bloco: 1, aula: 2, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Subtração com Reagrupamento",
        display: "Resolva: 2.000 - 1.342",
        res: "658",
        alternativas: [
            { valor: "658", tipo: "acerto" },
            { valor: "748", tipo: "erro", categoria: "procedimento", erro: "subtracao_falha_emprestimo_sucessivo", descricao: "Tratou os zeros como 10 em vez de 9 ao pedir emprestado em sequência.", peso: 2 },
            { valor: "642", tipo: "erro", categoria: "conceito", erro: "subtracao_inverte_minuendo_subtraendo", descricao: "Subtraiu o menor do maior em cada coluna (ex: 2-0=2) por não saber reagrupar.", peso: 3 },
            { valor: "668", tipo: "erro", categoria: "calculo", erro: "subtracao_erro_tabuada", descricao: "Erro operacional de subtração em uma das ordens.", peso: 1 }
        ],
        passo: "Como as casas têm zero, o 2.000 empresta sucessivamente. Ficamos com 1.99(10). 10-2=8, 9-4=5, 9-3=6.",
        dica: "Quando o vizinho é zero, você tem que ir até a primeira casa que tem valor para 'pedir emprestado'."
    },
    {
        id: "B1T1Q15", bloco: 1, aula: 2, tipo: "contexto",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Adição — Contexto",
        display: "Um atleta correu 1.250m na segunda e 350m A MAIS na terça. Qual o total percorrido nos dois dias?",
        res: "2.850 m",
        alternativas: [
            { valor: "2.850 m", tipo: "acerto" },
            { valor: "1.600 m", tipo: "erro", categoria: "interpretacao", erro: "problema_omite_etapa_soma_final", descricao: "Calculou apenas a distância de terça-feira, esquecendo de somar com a de segunda.", peso: 3 },
            { valor: "1.950 m", tipo: "erro", categoria: "conceito", erro: "problema_ignora_relacao_aditiva", descricao: "Somou os valores do texto (1250 + 350) sem entender que um era o acréscimo do outro.", peso: 2 },
            { valor: "2.350 m", tipo: "erro", categoria: "calculo", erro: "problema_erro_soma_centenas", descricao: "Erro aritmético durante o reagrupamento das ordens superiores.", peso: 1 }
        ],
        passo: "Passo 1: terça = 1.250 + 350 = 1.600m. Passo 2: Total = 1.250 + 1.600 = 2.850m.",
        dica: "Cuidado! O problema pergunta o total dos DOIS dias combinados."
    },
    {
        id: "B1T1Q18", bloco: 1, aula: 2, tipo: "conceito",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Subtração — Sentido",
        display: "Ao 'pedir emprestado' na subtração, o que acontece com a casa vizinha que cedeu o valor?",
        res: "Ela diminui em 1",
        alternativas: [
            { valor: "Ela diminui em 1", tipo: "acerto" },
            { valor: "Ela não muda", tipo: "erro", categoria: "conceito", erro: "algoritmo_nao_reduz_emprestimo", descricao: "Acredita que o valor é criado, não transferido entre as colunas.", peso: 3 },
            { valor: "Ela aumenta em 1", tipo: "erro", categoria: "procedimento", erro: "algoritmo_confunde_com_adicao", descricao: "Aplicou a regra do 'vai um' (adição) no contexto da subtração.", peso: 2 },
            { valor: "Ela zera sempre", tipo: "erro", categoria: "interpretacao", erro: "algoritmo_extrema_generalizacao", descricao: "Generalizou que qualquer empréstimo esvazia a casa vizinha.", peso: 1 }
        ],
        passo: "Reagrupar é transferir: você tira 1 de uma ordem superior e ela vira 10 na ordem inferior (que vale menos).",
        dica: "É como trocar uma nota de 10 reais por 10 moedas de 1 real. Você ainda tem 10 reais, mas em formatos diferentes."
    },
    {
        id: "B1T1Q19", bloco: 1, aula: 2, tipo: "conceito",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Operações Inversas",
        display: "Como verificar se 1.600 - 937 = 663 está correto sem fazer a conta de menos de novo?",
        res: "Somar 663 + 937",
        alternativas: [
            { valor: "Somar 663 + 937", tipo: "acerto" },
            { valor: "Subtrair 663 de 937", tipo: "erro", categoria: "conceito", erro: "prova_real_mantem_operador", descricao: "Não aplicou o conceito de operação inversa para validação.", peso: 3 },
            { valor: "Dividir 1.600 por 2", tipo: "erro", categoria: "estrategia", erro: "prova_real_sem_correlacao", descricao: "Sugeriu uma operação sem qualquer base lógica no modelo aditivo.", peso: 2 },
            { valor: "Multiplicar por 2", tipo: "erro", categoria: "estrategia", erro: "prova_real_chute_proporcional", descricao: "Tentou validar usando dobros, o que não se aplica aqui.", peso: 2 }
        ],
        passo: "A Adição desfaz a Subtração. Se você somar o que sobrou (663) com o que tirou (937), deve voltar ao total (1.600).",
        dica: "A prova real é como 'voltar no tempo': use o sinal oposto para conferir."
    },

    // ── AULA 3: MULTIPLICAÇÃO ────────────────────────────────────────────

    {
        id: "B1T2Q01", bloco: 1, aula: 3, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Multiplicação — Sentido",
        display: "7 + 7 + 7 + 7 = ? Qual multiplicação representa essa soma?",
        res: "4 × 7",
        alternativas: [
            { valor: "4 × 7", tipo: "acerto" },
            { valor: "7 × 7", tipo: "erro", categoria: "conceito", erro: "multiplicacao_ignora_fatores", descricao: "Tratou a parcela repetida como o próprio multiplicador.", peso: 3 },
            { valor: "4 + 7", tipo: "erro", categoria: "atencao", erro: "multiplicacao_confunde_operador", descricao: "Identificou os numerais, mas utilizou o operador de adição.", peso: 2 },
            { valor: "7 ÷ 4", tipo: "erro", categoria: "estrategia", erro: "multiplicacao_operador_inverso", descricao: "Aplicou a divisão em um contexto de acúmulo de parcelas.", peso: 1 }
        ],
        passo: "A multiplicação é a soma de parcelas iguais. Se o 7 aparece 4 vezes, temos 4 × 7.",
        dica: "Conte quantas vezes o número se repete. Esse número de vezes será o seu multiplicador!"
    },
    {
        id: "B1T2Q02", bloco: 1, aula: 3, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Multiplicação — Algoritmo",
        display: "Calcule: 24 × 5 = ?",
        res: "120",
        alternativas: [
            { valor: "120", tipo: "acerto" },
            { valor: "29", tipo: "erro", categoria: "conceito", erro: "multiplicacao_operacao_aditiva", descricao: "Realizou a soma dos fatores em vez da multiplicação.", peso: 3 },
            { valor: "100", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_esquece_unidade", descricao: "Multiplicou apenas a dezena (20x5), ignorando a unidade do multiplicando.", peso: 2 },
            { valor: "124", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_erro_misto_soma", descricao: "Multiplicou a dezena e somou a unidade de forma isolada.", peso: 2 }
        ],
        passo: "5 × 4 = 20 (fica 0, sobe 2). 5 × 2 = 10, mais os 2 que subiram = 12. Resultado: 120.",
        dica: "Multiplique o 5 pelas unidades (4) e depois pelas dezenas (2). Não esqueça do que 'sobe'!"
    },
    {
        id: "B1T2Q05", bloco: 1, aula: 3, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Multiplicação — Algoritmo",
        display: "Resolva: 45 × 13 = ?",
        res: "585",
        alternativas: [
            { valor: "585", tipo: "acerto" },
            { valor: "495", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_ignora_posicao_dezena", descricao: "Esqueceu de pular uma casa ou usar o zero ao multiplicar pela dezena do multiplicador.", peso: 3 },
            { valor: "555", tipo: "erro", categoria: "calculo", erro: "multiplicacao_erro_soma_final", descricao: "Realizou as multiplicações parciais corretamente, mas falhou na soma final.", peso: 2 },
            { valor: "580", tipo: "erro", categoria: "calculo", erro: "multiplicacao_falha_unidade", descricao: "Erro de tabuada básica no primeiro nível da conta.", peso: 1 }
        ],
        passo: "Etapa 1: 3 × 45 = 135. Etapa 2: 10 × 45 = 450. Soma final: 135 + 450 = 585.",
        dica: "Quando começar a multiplicar pelo '1' do 13, lembre-se de colocar um zero (ou pular a casa) das unidades!"
    },

    // ── AULA 4: DIVISÃO ──────────────────────────────────────────────────

    {
        id: "B1T2Q09", bloco: 1, aula: 4, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Divisão — Resto",
        display: "Ao dividir 130 por 4, qual o quociente e o resto?",
        res: "32 com resto 2",
        alternativas: [
            { valor: "32 com resto 2", tipo: "acerto" },
            { valor: "32 com resto 0", tipo: "erro", categoria: "conceito", erro: "divisao_ignora_resto_existente", descricao: "Não identificou a sobra final, tratando a divisão como exata.", peso: 3 },
            { valor: "30 com resto 10", tipo: "erro", categoria: "procedimento", erro: "divisao_resto_maior_divisor", descricao: "Parou a conta com um resto maior que o divisor, falhando no algoritmo.", peso: 2 },
            { valor: "33 com resto 2", tipo: "erro", categoria: "calculo", erro: "divisao_quociente_errado", descricao: "Erro de tabuada ao definir o valor do quociente.", peso: 1 }
        ],
        passo: "13 ÷ 4 dá 3 e sobra 1. Baixa o 0 (fica 10). 10 ÷ 4 dá 2 e sobram 2. Resultado: 32 com resto 2.",
        dica: "O resto é o que 'sobra' da conta. Ele deve ser sempre menor que o número pelo qual você está dividindo."
    },
    {
        id: "B1T2Q10", bloco: 1, aula: 4, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA03", bncc_desc: "Divisão — Contexto",
        display: "4 amigos dividiram R$ 130 igualmente. Eles não usam moedas. Quanto cada um recebe e quanto sobra?",
        res: "R$ 32 e sobram R$ 2",
        alternativas: [
            { valor: "R$ 32 e sobram R$ 2", tipo: "acerto" },
            { valor: "R$ 32,50", tipo: "erro", categoria: "interpretacao", erro: "problema_ignora_condicao_inteira", descricao: "Ignorou a restrição 'sem moedas', realizando uma divisão decimal.", peso: 3 },
            { valor: "R$ 30 e sobram R$ 10", tipo: "erro", categoria: "procedimento", erro: "problema_divisao_incompleta", descricao: "Não esgotou as possibilidades de divisão das dezenas restantes.", peso: 2 },
            { valor: "R$ 35", tipo: "erro", categoria: "calculo", erro: "problema_excede_valor_total", descricao: "Calculou um valor individual que multiplicado ultrapassa o total de 130.", peso: 1 }
        ],
        passo: "Dividir R$ 130 por 4 em partes inteiras resulta em R$ 32 para cada. Os R$ 2 que restam não podem ser divididos.",
        dica: "Atenção à regra: 'sem moedas'. Isso significa que você deve parar a conta quando chegar no resto inteiro!"
    },

    // ── AULA 6: CRITÉRIOS DE DIVISIBILIDADE ──────────────────────────────

    {
        id: "B1T3Q01", bloco: 1, aula: 6, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Critério de Divisibilidade por 2",
        display: "Qual destes números NÃO é divisível por 2?",
        res: "77",
        alternativas: [
            { valor: "77", tipo: "acerto" },
            { valor: "990", tipo: "erro", categoria: "conceito", erro: "divisibilidade_desconhece_regra_paridade", descricao: "Selecionou um número par terminado em 0, desconhecendo que 0 é critério de paridade.", peso: 3 },
            { valor: "342", tipo: "erro", categoria: "procedimento", erro: "divisibilidade_foco_ordem_errada", descricao: "Analisou o algarismo inicial (centena) em vez da unidade final.", peso: 2 },
            { valor: "128", tipo: "erro", categoria: "interpretacao", erro: "divisibilidade_inverte_comando", descricao: "Procurou um número divisível em vez de um NÃO divisível.", peso: 2 }
        ],
        passo: "Para ser divisível por 2, o número deve terminar em 0, 2, 4, 6 ou 8. O 77 termina em 7 (ímpar).",
        dica: "Dica de Ouro: Olhe apenas para o último algarismo da direita. Ele é quem manda na regra do 2!"
    },
    {
        id: "B1T3Q02", bloco: 1, aula: 6, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Critério de Divisibilidade por 3",
        display: "O número 471 é divisível por 3?",
        res: "Sim (4+7+1=12)",
        alternativas: [
            { valor: "Sim (4+7+1=12)", tipo: "acerto" },
            { valor: "Não (termina em 1)", tipo: "erro", categoria: "conceito", erro: "divisibilidade_aplica_regra_dois_no_tres", descricao: "Tentou aplicar a regra do 2 (olhar final) no critério do 3.", peso: 3 },
            { valor: "Não (soma é 12)", tipo: "erro", categoria: "procedimento", erro: "divisibilidade_falha_analise_soma", descricao: "Somou corretamente, mas não reconheceu o 12 como múltiplo de 3.", peso: 2 },
            { valor: "Sim (termina em 1)", tipo: "erro", categoria: "estrategia", erro: "divisibilidade_justificativa_incoerente", descricao: "Acertou a resposta por intuição, mas usou uma regra falsa.", peso: 2 }
        ],
        passo: "Soma: 4 + 7 + 1 = 12. Como 12 está na tabuada do 3 (3 × 4), o número 471 também está!",
        dica: "A regra do 3 é diferente: você precisa 'quebrar' o número e somar todos os seus pedaços."
    },
    {
        id: "B1T3Q16", bloco: 1, aula: 6, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Divisibilidade — Algarismo Oculto",
        display: "No número 5.4_2, qual algarismo completa o espaço para que ele seja múltiplo de 3?",
        res: "1",
        alternativas: [
            { valor: "1", tipo: "acerto" },
            { valor: "2", tipo: "erro", categoria: "conceito", erro: "divisibilidade_aplica_regra_paridade", descricao: "Tentou usar um número par para satisfazer a regra do 3.", peso: 3 },
            { valor: "3", tipo: "erro", categoria: "estrategia", erro: "divisibilidade_literalidade_algarismo", descricao: "Acreditou que colocar o algarismo 3 torna o número múltiplo de 3 automaticamente.", peso: 2 },
            { valor: "5", tipo: "erro", categoria: "procedimento", erro: "divisibilidade_soma_insuficiente", descricao: "Escolheu um valor cuja soma final (16) não é múltipla de 3.", peso: 2 }
        ],
        passo: "Somamos os que já temos: 5 + 4 + 2 = 11. Para chegar no próximo múltiplo de 3 (que é 12), precisamos de +1.",
        dica: "A soma total deve resultar em um número da tabuada do 3 (3, 6, 9, 12, 15, 18...)."
    },

    // ── AULA 7: DIVISORES E NÚMEROS PRIMOS ───────────────────────────────

    {
        id: "B1T3Q09", bloco: 1, aula: 7, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Divisores de um Número",
        display: "Quais são todos os divisores naturais do número 12?",
        res: "{1, 2, 3, 4, 6, 12}",
        alternativas: [
            { valor: "{1, 2, 3, 4, 6, 12}", tipo: "acerto" },
            { valor: "{2, 3, 4, 6}", tipo: "erro", categoria: "conceito", erro: "divisores_omite_extremos_triviais", descricao: "Esqueceu que o 1 e o próprio número (12) são sempre divisores.", peso: 3 },
            { valor: "{1, 2, 4, 12}", tipo: "erro", categoria: "procedimento", erro: "divisores_omite_fator_central", descricao: "Pulou os fatores centrais (3x4), demonstrando falha na varredura da tabuada.", peso: 2 },
            { valor: "{1, 3, 4, 12}", tipo: "erro", categoria: "atencao", erro: "divisores_omite_base_par", descricao: "Esqueceu dos divisores pares óbvios (2 e 6).", peso: 1 }
        ],
        passo: "Pense nos pares que multiplicados dão 12: 1x12, 2x6, 3x4. Juntando todos: {1, 2, 3, 4, 6, 12}.",
        dica: "Dica da ADA: Divisores sempre vêm em pares! Se você achou o 2, o 6 (12 ÷ 2) também tem de estar lá."
    },
    {
        id: "B1T3Q10", bloco: 1, aula: 7, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Número Primo",
        display: "Qual destes números é um número PRIMO?",
        res: "11",
        alternativas: [
            { valor: "11", tipo: "acerto" },
            { valor: "9", tipo: "erro", categoria: "conceito", erro: "primo_confunde_com_impar", descricao: "Classificou um número composto (3x3) como primo apenas por ser ímpar.", peso: 3 },
            { valor: "15", tipo: "erro", categoria: "procedimento", erro: "primo_ignora_fator_cinco", descricao: "Não testou a divisibilidade por 5 em um número terminado em 5.", peso: 2 },
            { valor: "21", tipo: "erro", categoria: "calculo", erro: "primo_falha_revisao_tabuada", descricao: "Esqueceu que 21 está na tabuada do 3 e do 7.", peso: 2 }
        ],
        passo: "O 11 só divide por 1 e por ele mesmo. Já o 9 divide por 3, o 15 por 5 e o 21 por 7.",
        dica: "Ser primo é ser 'exclusivo': só aceita ser dividido pelo 1 e por si mesmo. Se aparecer em outra tabuada, não é primo!"
    },
    {
        id: "B1T3Q20", bloco: 1, aula: 7, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "Primos Gêmeos",
        display: "Primos gêmeos são primos com diferença de 2 (ex: 3 e 5). Qual par é de gêmeos autênticos?",
        res: "17 e 19",
        alternativas: [
            { valor: "17 e 19", tipo: "acerto" },
            { valor: "13 e 15", tipo: "erro", categoria: "procedimento", erro: "primos_gemeos_inclui_multiplo_tres", descricao: "Identificou a distância 2, mas não percebeu que 15 é composto.", peso: 3 },
            { valor: "7 e 9", tipo: "erro", categoria: "calculo", erro: "primos_gemeos_inclui_composto_impar", descricao: "Validou o 9 como primo, falhando na base da teoria.", peso: 2 },
            { valor: "19 e 21", tipo: "erro", categoria: "atencao", erro: "primos_gemeos_inclui_multiplo_sete", descricao: "Ignorou que 21 divide por 3 e 7.", peso: 1 }
        ],
        passo: "17 e 19 são ambos primos. Nos outros pares, o 15, o 9 e o 21 são números 'disfarçados' que têm outros divisores.",
        dica: "Não basta ter distância 2; os DOIS números precisam ser primos de verdade!"
    },

    // ── AULA 8: MMC (MÍNIMO MÚLTIPLO COMUM) ──────────────────────────────
    
    {
        id: "B1T4Q01", bloco: 1, aula: 8, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "MMC — Conceito",
        display: "Qual é o significado correto da afirmação MMC(8, 12) = 24?",
        res: "24 é o menor múltiplo comum",
        alternativas: [
            { valor: "24 é o menor múltiplo comum", tipo: "acerto" },
            { valor: "24 é o produto de 8 e 12", tipo: "erro", categoria: "conceito", erro: "mmc_confunde_com_produto", descricao: "Assumiu que o MMC é o resultado da multiplicação direta dos termos.", peso: 3 },
            { valor: "24 é o maior divisor", tipo: "erro", categoria: "conceito", erro: "mmc_confunde_com_mdc", descricao: "Confundiu a definição de múltiplo comum com a de divisor comum (MDC).", peso: 3 },
            { valor: "24 é a soma dos dois", tipo: "erro", categoria: "interpretacao", erro: "mmc_operacao_aditiva", descricao: "Interpretou os dados numéricos como uma instrução de soma.", peso: 2 }
        ],
        passo: "O 24 é o primeiro número que aparece tanto na tabuada do 8 quanto na do 12 (excluindo o zero).",
        dica: "MMC é o 'primeiro encontro' das tabuadas dos dois números."
    },
    {
        id: "B1T4Q03", bloco: 1, aula: 8, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "MMC — Aplicação (Ciclos)",
        display: "O Ônibus A sai a cada 12 min e o B a cada 8 min. Se saíram juntos agora, em quanto tempo saem juntos novamente?",
        res: "Em 24 minutos",
        alternativas: [
            { valor: "Em 24 minutos", tipo: "acerto" },
            { valor: "Em 96 minutos", tipo: "erro", categoria: "procedimento", erro: "problema_mmc_multiplica_direto", descricao: "Multiplicou os intervalos diretamente em vez de encontrar o mínimo múltiplo comum.", peso: 2 },
            { valor: "Em 20 minutos", tipo: "erro", categoria: "interpretacao", erro: "problema_mmc_soma_intervalos", descricao: "Somou os intervalos de tempo em vez de projetar múltiplos cíclicos.", peso: 2 },
            { valor: "Em 4 minutos", tipo: "erro", categoria: "conceito", erro: "problema_mmc_calcula_mdc", descricao: "Calculou o MDC (maior divisor) em um contexto de eventos futuros repetitivos.", peso: 3 }
        ],
        passo: "Para eventos que se repetem e buscam um reencontro, usamos MMC. MMC(12, 8) = 24.",
        dica: "Dica da ADA: Sempre que o problema falar de 'tempo para se encontrarem de novo', use o MMC!"
    },

    // ── AULA 9: MDC (MÁXIMO DIVISOR COMUM) ───────────────────────────────

    {
        id: "B1T4Q07", bloco: 1, aula: 9, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "MDC — Conceito",
        display: "O que significa afirmar que o MDC(36, 24) = 12?",
        res: "12 é o maior que divide os dois exatamente",
        alternativas: [
            { valor: "12 é o maior que divide os dois exatamente", tipo: "acerto" },
            { valor: "12 é o menor múltiplo", tipo: "erro", categoria: "conceito", erro: "mdc_confunde_com_mmc", descricao: "Inverteu a lógica de divisor comum com a de múltiplo comum.", peso: 3 },
            { valor: "12 é a diferença entre eles", tipo: "erro", categoria: "estrategia", erro: "mdc_generaliza_subtracao", descricao: "Observou a diferença (36-24) e assumiu como regra universal para encontrar o MDC.", peso: 2 },
            { valor: "12 é a soma dividida por dois", tipo: "erro", categoria: "calculo", erro: "mdc_regra_arbitraria", descricao: "Criou um procedimento sem fundamentação teórica para o divisor comum.", peso: 2 }
        ],
        passo: "O MDC é o maior número da tabuada que 'cabe' exatamente dentro do 36 e do 24 ao mesmo tempo.",
        dica: "MDC serve para 'repartir' algo no maior tamanho possível sem sobrar nada."
    },
    {
        id: "B1T4Q08", bloco: 1, aula: 9, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA05", bncc_desc: "MDC — Aplicação (Cortes)",
        display: "Você quer cortar cordas de 36cm e 24cm em pedaços iguais e no maior tamanho possível. Qual será a medida?",
        res: "12 cm",
        alternativas: [
            { valor: "12 cm", tipo: "acerto" },
            { valor: "24 cm", tipo: "erro", categoria: "interpretacao", erro: "problema_mdc_assume_fator_menor", descricao: "Escolheu o menor pedaço disponível sem verificar se ele divide exatamente o maior.", peso: 2 },
            { valor: "6 cm", tipo: "erro", categoria: "procedimento", erro: "problema_mdc_divisor_comum_nao_maximo", descricao: "Encontrou um divisor comum, mas não o Máximo Divisor solicitado.", peso: 2 },
            { valor: "4 cm", tipo: "erro", categoria: "procedimento", erro: "problema_mdc_fatoracao_incompleta", descricao: "Interrompeu o processo de fatoração antes de encontrar o MDC real.", peso: 2 }
        ],
        passo: "Buscamos o maior divisor comum. Divisores de 36: {1,2,3,4,6,9,12...}. Divisores de 24: {1,2,3,4,6,8,12...}. O maior é 12.",
        dica: "Sempre que precisar 'cortar em partes iguais' no 'maior tamanho', pense no MDC."
    },

    // ── AULA 10: POTENCIAÇÃO ─────────────────────────────────────────────

    {
        id: "B1T4Q13", bloco: 1, aula: 10, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA06", bncc_desc: "Potenciação — Conceito",
        display: "Qual é o significado real da expressão 3⁴?",
        res: "3 × 3 × 3 × 3",
        alternativas: [
            { valor: "3 × 3 × 3 × 3", tipo: "acerto" },
            { valor: "3 × 4", tipo: "erro", categoria: "conceito", erro: "potenciacao_multiplica_base_expoente", descricao: "Multiplicou a base pelo expoente (erro de linearização).", peso: 3 },
            { valor: "4 × 4 × 4", tipo: "erro", categoria: "atencao", erro: "potenciacao_inverte_base_expoente", descricao: "Inverteu a função da base e do expoente na representação.", peso: 1 },
            { valor: "3 + 3 + 3 + 3", tipo: "erro", categoria: "conceito", erro: "potenciacao_confunde_com_adicao", descricao: "Tratou a potência como uma soma repetida em vez de multiplicação sucessiva.", peso: 3 }
        ],
        passo: "O expoente (número de cima) diz quantas vezes a base (número de baixo) deve se multiplicar por ela mesma. 3 × 3 × 3 × 3 = 81.",
        dica: "Atenção: Potência NÃO é conta de vezes simples. É uma multiplicação em cascata!"
    },
    {
        id: "B1T4Q15", bloco: 1, aula: 10, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF06MA06", bncc_desc: "Potenciação — Expoente Zero",
        display: "Qual é o valor numérico de 9⁰?",
        res: "1",
        alternativas: [
            { valor: "1", tipo: "acerto" },
            { valor: "0", tipo: "erro", categoria: "conceito", erro: "potenciacao_expoente_zero_nulo", descricao: "Assumiu que o expoente zero anula o valor da base.", peso: 3 },
            { valor: "9", tipo: "erro", categoria: "procedimento", erro: "potenciacao_expoente_zero_neutro", descricao: "Tratou o zero como se fosse expoente 1, mantendo a base intacta.", peso: 2 },
            { valor: "Inexistente", tipo: "erro", categoria: "interpretacao", erro: "potenciacao_confunde_com_divisao_zero", descricao: "Confundiu a regra do expoente zero com a impossibilidade da divisão por zero.", peso: 2 }
        ],
        passo: "Regra fundamental: Qualquer número (diferente de zero) elevado a zero é sempre igual a 1.",
        dica: "Lembre-se da escada: 9²=81, 9¹=9, e o degrau final 9⁰ é sempre 1."
    },
    {
        id: "B1T4Q22", bloco: 1, aula: 10, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF06MA06", bncc_desc: "Potenciação — Propriedades",
        display: "O dobro matemático da potência 2¹⁰ é igual a:",
        res: "2¹¹",
        alternativas: [
            { valor: "2¹¹", tipo: "acerto" },
            { valor: "4¹⁰", tipo: "erro", categoria: "conceito", erro: "potenciacao_multiplica_base_mantem_expoente", descricao: "Multiplicou a base pelo escalar ignorando as leis de potências de mesma base.", peso: 3 },
            { valor: "2²⁰", tipo: "erro", categoria: "procedimento", erro: "potenciacao_multiplica_expoente", descricao: "Multiplicou o expoente por 2 em vez de somar 1 unidade (regra do produto).", peso: 2 },
            { valor: "4²⁰", tipo: "erro", categoria: "conceito", erro: "potenciacao_duplica_tudo", descricao: "Dobrou tanto a base quanto o expoente, violando a estrutura algébrica.", peso: 3 }
        ],
        passo: "Dobro significa 2 × número. Logo: 2¹ × 2¹⁰. Mantemos a base e somamos os expoentes: 1 + 10 = 11.",
        dica: "Quando você multiplica potências de base igual, você apenas 'ganha' mais um no expoente!"
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO (Para Combo Alto)
    {
        id: "B1Q99", bloco: 1, aula: 10, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "investigacao", // ADA puxa se o Combo for >= 4
        bncc: "EF06MA05", bncc_desc: "Lógica de Divisibilidade Combinada",
        display: "Investigação: Se um número é divisível por 2 e também por 3 ao mesmo tempo, ele obrigatoriamente será divisível por:",
        res: "6",
        alternativas: [
            { valor: "6", tipo: "acerto" },
            { valor: "5", tipo: "erro", categoria: "conceito", erro: "investiga_soma_divisores", descricao: "Somou os divisores (2+3) em vez de multiplicá-los.", peso: 3 },
            { valor: "8", tipo: "erro", categoria: "estrategia", erro: "investiga_chute_par", descricao: "Elegeu um número par aleatório por causa da divisibilidade por 2.", peso: 2 },
            { valor: "9", tipo: "erro", categoria: "estrategia", erro: "investiga_chute_impar", descricao: "Elegeu um múltiplo de 3 aleatório.", peso: 2 }
        ],
        passo: "Se um número obedece à regra do 2 (é par) e à regra do 3, ele é um múltiplo do produto deles: 2 × 3 = 6. (Ex: 12, 18, 24).",
        dica: "Pense num número que seja par (divide por 2) e esteja na tabuada do 3. Qual é a menor tabuada que todos esses números formam?"
    }
];
