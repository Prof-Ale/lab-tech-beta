/**
 * bloco4.js — Álgebra e Padrão
 * Foco: Expressões, Equações do 1° Grau, Inequações e Modelagem
 * Clusters: PENSAMENTO_ALGEBRICO, LITERACIA_MATEMATICA, RESOLUCAO_PROBLEMAS
 */

export const bloco4 = [

    // ── AULA 1: EXPRESSÕES ALGÉBRICAS ──────────────────────────────────────

    // [NOVA] QUESTÃO DE RECOMPOSIÇÃO (Resgate de Base)
    {
        id: "B4Q00", bloco: 4, aula: 1, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "recomposicao", // ADA puxa essa se o aluno errar a B4Q01
        bncc: "EF08MA06", bncc_desc: "Linguagem Algébrica",
        display: "Na linguagem da álgebra, o que significa a expressão '3x'?",
        res: "3 vezes o valor de x",
        alternativas: [
            { valor: "3 vezes o valor de x", tipo: "acerto" },
            { valor: "30 mais x", tipo: "erro", categoria: "conceito", erro: "algebra_confunde_dezena", descricao: "Achou que o 3 representava a casa das dezenas (trinta e x).", peso: 3 },
            { valor: "3 mais x", tipo: "erro", categoria: "conceito", erro: "algebra_confunde_soma", descricao: "Assumiu que a ausência de sinal significa adição.", peso: 2 },
            { valor: "x elevado a 3", tipo: "erro", categoria: "procedimento", erro: "algebra_confunde_potencia", descricao: "Confundiu coeficiente multiplicativo com expoente.", peso: 2 }
        ],
        passo: "Na matemática, quando um número está 'grudado' em uma letra sem nenhum sinal entre eles, significa que estão se multiplicando.",
        dica: "Dica da ADA: Número colado na letra = Multiplicação! 3x é o mesmo que 3 vezes x."
    },

    {
        id: "B4Q01", bloco: 4, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF08MA06", bncc_desc: "Valor Numérico",
        display: "Para x = 3, qual é o valor numérico da expressão 2x + 5?",
        res: "11",
        alternativas: [
            { valor: "11", tipo: "acerto" },
            { valor: "28", tipo: "erro", categoria: "conceito", erro: "expressao_justaposicao_variavel", descricao: "Justapôs o número e a letra (formando 23) em vez de multiplicar.", peso: 3 },
            { valor: "16", tipo: "erro", categoria: "procedimento", erro: "expressao_erro_precedencia", descricao: "Somou (x+5) antes de multiplicar pelo coeficiente 2.", peso: 2 },
            { valor: "8", tipo: "erro", categoria: "atencao", erro: "expressao_ignora_coeficiente", descricao: "Somou apenas x + 5, esquecendo de multiplicar por 2.", peso: 1 }
        ],
        passo: "O termo 2x significa 2 vezes x. Substituindo x por 3: (2 × 3) + 5 = 6 + 5 = 11.",
        dica: "Lembre-se: quando um número está grudado na letra, eles estão se multiplicando!"
    },
    
    {
        id: "B4Q03", bloco: 4, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF08MA06", bncc_desc: "Simplificação Algébrica",
        display: "Simplifique a expressão: 3x + 2x - x",
        res: "4x",
        alternativas: [
            { valor: "4x", tipo: "acerto" },
            { valor: "6x", tipo: "erro", categoria: "conceito", erro: "polinomio_ignora_coeficiente_oculto", descricao: "Tratou '- x' como se não tivesse valor ou como se fosse uma adição.", peso: 3 },
            { valor: "4", tipo: "erro", categoria: "conceito", erro: "polinomio_remove_variavel", descricao: "Operou os números mas 'jogou fora' a letra x no resultado.", peso: 3 },
            { valor: "5x", tipo: "erro", categoria: "atencao", erro: "polinomio_omite_ultimo_termo", descricao: "Esqueceu de subtrair o último termo da conta.", peso: 1 }
        ],
        passo: "A letra x sozinha vale 1x. Então fazemos (3 + 2 - 1) e mantemos o x. Resultado: 4x.",
        dica: "Dica da ADA: Toda letra sem número na frente tem um '1' invisível protegendo ela!"
    },

    // ── AULA 2: EQUAÇÕES DO 1° GRAU ────────────────────────────────────────

    {
        id: "B4Q05", bloco: 4, aula: 2, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF08MA06", bncc_desc: "Equação — Transposição",
        display: "Resolva a equação: x + 5 = 12",
        res: "x = 7",
        alternativas: [
            { valor: "x = 7", tipo: "acerto" },
            { valor: "x = 17", tipo: "erro", categoria: "procedimento", erro: "equacao_mantem_sinal_transposicao", descricao: "Moveu o 5 mas continuou somando (12 + 5).", peso: 2 },
            { valor: "x = 60", tipo: "erro", categoria: "conceito", erro: "equacao_inverte_operacao_errada", descricao: "Trocou a soma por multiplicação ao mudar de lado.", peso: 3 },
            { valor: "x = 5", tipo: "erro", categoria: "atencao", erro: "equacao_copia_termo", descricao: "Apenas repetiu um dos números da pergunta.", peso: 1 }
        ],
        passo: "O +5 deve 'pular' a igualdade com a operação inversa. x = 12 - 5. Logo, x = 7.",
        dica: "Pense na balança: para equilibrar, o que você tira de um lado, tem que tirar do outro!"
    },
    
    {
        id: "B4Q09", bloco: 4, aula: 2, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF08MA06", bncc_desc: "Equação — Membros",
        display: "Resolva: 5x - 3 = 2x + 9",
        res: "x = 4",
        alternativas: [
            { valor: "x = 4", tipo: "acerto" },
            { valor: "x = 6", tipo: "erro", categoria: "procedimento", erro: "equacao_erro_sinal_variavel", descricao: "Somou as variáveis (5x+2x) em vez de subtrair ao mudar de lado.", peso: 2 },
            { valor: "x = 2", tipo: "erro", categoria: "procedimento", erro: "equacao_erro_sinal_constante", descricao: "Subtraiu as constantes (9-3) em vez de somar ao mudar de lado.", peso: 2 },
            { valor: "x = 12", tipo: "erro", categoria: "atencao", erro: "equacao_omite_divisao_final", descricao: "Chegou em 3x = 12 mas esqueceu de dividir por 3.", peso: 2 }
        ],
        passo: "1º: Junte os x: 5x - 2x = 3x. 2º: Junte os números: 9 + 3 = 12. 3º: Divida: 12 ÷ 3 = 4.",
        dica: "Cada um na sua casa! Letras para a esquerda, números para a direita. Quem muda de casa, muda de sinal!"
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO (Equações Visuais)
    {
        id: "B4Q12", bloco: 4, aula: 3, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "investigacao", // ADA puxa se o Combo for >= 4
        bncc: "EF08MA06", bncc_desc: "Lógica Algébrica",
        display: "Investigação: 2 maçãs e 1 pera custam R$ 10. Se a pera custa R$ 4, qual o valor de 1 maçã?",
        res: "R$ 3",
        alternativas: [
            { valor: "R$ 3", tipo: "acerto" },
            { valor: "R$ 6", tipo: "erro", categoria: "atencao", erro: "logica_esquece_divisao", descricao: "Subtraiu a pera (10 - 4) mas não dividiu o restante pelas 2 maçãs.", peso: 2 },
            { valor: "R$ 5", tipo: "erro", categoria: "conceito", erro: "logica_divisao_direta", descricao: "Dividiu os R$ 10 por 2 ignorando a existência da pera.", peso: 3 },
            { valor: "R$ 4", tipo: "erro", categoria: "estrategia", erro: "logica_igualdade_valores", descricao: "Assumiu que a maçã tinha o mesmo valor da pera.", peso: 1 }
        ],
        passo: "Tire o valor da pera do total: 10 - 4 = 6. Sobram R$ 6 para as 2 maçãs. Logo, cada maçã custa 6 ÷ 2 = 3.",
        dica: "Pense como uma equação: 2x + 4 = 10. Tente descobrir o valor do x!"
    },

    // ── AULA 4: INEQUAÇÕES ─────────────────────────────────────────────────

    {
        id: "B4Q14", bloco: 4, aula: 4, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF08MA06", bncc_desc: "Inequação — Regra do Negativo",
        display: "Resolva a inequação: -2x > 8",
        res: "x < -4",
        alternativas: [
            { valor: "x < -4", tipo: "acerto" },
            { valor: "x > -4", tipo: "erro", categoria: "conceito", erro: "inequacao_esquece_inversao_sinal", descricao: "Dividiu pelo negativo mas não inverteu o sentido da desigualdade.", peso: 3 },
            { valor: "x < 4", tipo: "erro", categoria: "procedimento", erro: "inequacao_erro_sinal_numérico", descricao: "Inverteu o sinal da desigualdade mas esqueceu o sinal negativo no 4.", peso: 2 },
            { valor: "x > 4", tipo: "erro", categoria: "estrategia", erro: "inequacao_trata_como_natural", descricao: "Ignorou todas as regras de sinais e inversão.", peso: 3 }
        ],
        passo: "Ao dividir por um número negativo (-2), o sinal da desigualdade DEVE virar. 8 ÷ (-2) = -4. Então x < -4.",
        dica: "Cuidado! Sempre que multiplicar ou dividir por número NEGATIVO, a boca do jacaré (>) tem que virar pro outro lado (<)!"
    },

    // ── AULA 5: PADRÕES E MODELAGEM ────────────────────────────────────────

    {
        id: "B4Q16", bloco: 4, aula: 5, tipo: "padrao",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF08MA08", bncc_desc: "Padrões — Generalização",
        display: "1 quadrado usa 4 palitos. 2 quadrados grudados usam 7. 3 grudados usam 10. Qual a fórmula para 'n' quadrados?",
        res: "3n + 1",
        alternativas: [
            { valor: "3n + 1", tipo: "acerto" },
            { valor: "4n", tipo: "erro", categoria: "conceito", erro: "padrao_assume_crescimento_isolado", descricao: "Não percebeu que quadrados grudados compartilham palitos.", peso: 3 },
            { valor: "3n", tipo: "erro", categoria: "procedimento", erro: "padrao_omite_termo_fixo", descricao: "Identificou o pulo de 3 em 3, mas esqueceu o palito inicial de fechamento.", peso: 2 },
            { valor: "n + 3", tipo: "erro", categoria: "estrategia", erro: "padrao_modelo_linear_errado", descricao: "Tentou criar uma soma simples em vez de uma progressão multiplicativa.", peso: 2 }
        ],
        passo: "Cada novo quadrado adiciona 3 palitos (3n). O primeiro quadrado precisou de +1 palito para fechar a forma. Logo, 3n + 1.",
        dica: "Veja de quanto em quanto o número de palitos aumenta. Esse número fica grudado no 'n'!"
    },
    
    {
        id: "B4Q18", bloco: 4, aula: 6, tipo: "geometria",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF08MA08", bncc_desc: "Modelagem de Área",
        display: "Um retângulo tem largura (x) e comprimento (x + 5). Qual expressão representa sua ÁREA?",
        res: "x² + 5x",
        alternativas: [
            { valor: "x² + 5x", tipo: "acerto" },
            { valor: "2x + 5", tipo: "erro", categoria: "conceito", erro: "modelagem_perimetro_por_area", descricao: "Somou as dimensões (perímetro parcial) em vez de multiplicar (área).", peso: 3 },
            { valor: "x² + 5", tipo: "erro", categoria: "procedimento", erro: "algebra_distributiva_incompleta", descricao: "Multiplicou x por x, mas esqueceu de multiplicar o x pelo 5.", peso: 2 },
            { valor: "4x + 10", tipo: "erro", categoria: "conceito", erro: "modelagem_perimetro_total", descricao: "Calculou a fórmula do perímetro em vez da área.", peso: 3 }
        ],
        passo: "Área = Largura × Comprimento. Então: x × (x + 5). Fazendo a distributiva: x·x + x·5 = x² + 5x.",
        dica: "A área é o produto dos lados. Use o 'chuveirinho' para multiplicar o x por todo mundo que está no parênteses!"
    }
];
