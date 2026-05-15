/**
 * bloco3.js — Grandezas e Medidas
 * Foco: Unidades, Área, Perímetro, Volume e Conversões
 * Clusters: ESTRUTURA_GEOMETRICA, OPERACOES_DECIMAIS, MODELAGEM_SITUACIONAL
 */

export const bloco3 = [

    // ── AULA 1: UNIDADES DE COMPRIMENTO ────────────────────────────────────

    // [NOVA] QUESTÃO DE RECOMPOSIÇÃO (Resgate de Base)
    {
        id: "B3Q00", bloco: 3, aula: 1, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "recomposicao", // A ADA puxa essa se ele errar as de conversão
        bncc: "EF07MA20", bncc_desc: "Conversão de Comprimento",
        display: "Vamos relembrar a régua: Quantos centímetros (cm) cabem em exato 1 metro (m)?",
        res: "100 cm",
        alternativas: [
            { valor: "100 cm", tipo: "acerto" },
            { valor: "10 cm", tipo: "erro", categoria: "conceito", erro: "conversao_base_10_errada", descricao: "Confundiu centímetro com decímetro.", peso: 2 },
            { valor: "1.000 cm", tipo: "erro", categoria: "procedimento", erro: "conversao_base_1000_errada", descricao: "Confundiu a conversão de metro para milímetro.", peso: 2 },
            { valor: "60 cm", tipo: "erro", categoria: "conceito", erro: "confunde_base_tempo", descricao: "Usou a base 60 (do relógio) para medida de comprimento.", peso: 3 }
        ],
        passo: "A palavra 'Centi' significa cem. Portanto, 1 metro é formado por 100 centímetros.",
        dica: "Dica da ADA: Lembre-se da palavra CENTÍMETRO. Ela já te dá a resposta: CENTO!"
    },

    {
        id: "B3Q01", bloco: 3, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA20", bncc_desc: "Conversão de Comprimento",
        display: "Uma distância de 2,5 km equivale a quantos metros?",
        res: "2.500 m",
        alternativas: [
            { valor: "2.500 m", tipo: "acerto" },
            { valor: "250 m", tipo: "erro", categoria: "procedimento", erro: "conversao_fator_cem_inves_mil", descricao: "Multiplicou por 100 em vez de 1.000 (confundiu quilo com hecto/centi).", peso: 2 },
            { valor: "0,25 m", tipo: "erro", categoria: "conceito", erro: "conversao_inverte_operacao_divisao", descricao: "Dividiu em vez de multiplicar (tratou km como unidade menor).", peso: 3 },
            { valor: "25.000 m", tipo: "erro", categoria: "atencao", erro: "conversao_excesso_zeros", descricao: "Deslocou a vírgula casas a mais do que o necessário.", peso: 1 }
        ],
        passo: "1 km = 1.000 m. Então, 2,5 × 1.000 = 2.500 metros.",
        dica: "Dica da ADA: O prefixo 'Quilo' sempre significa 1.000 vezes mais. Multiplique por mil!"
    },
    
    {
        id: "B3Q02", bloco: 3, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA20", bncc_desc: "Conversão de Comprimento",
        display: "A medida de 350 cm equivale a quantos metros?",
        res: "3,5 m",
        alternativas: [
            { valor: "3,5 m", tipo: "acerto" },
            { valor: "35 m", tipo: "erro", categoria: "procedimento", erro: "conversao_fator_dez_inves_cem", descricao: "Dividiu por 10 em vez de 100 (confundiu cm com dm).", peso: 2 },
            { valor: "0,35 m", tipo: "erro", categoria: "procedimento", erro: "conversao_fator_mil_inves_cem", descricao: "Dividiu por 1.000 (confundiu cm com mm).", peso: 2 },
            { valor: "3.500 m", tipo: "erro", categoria: "conceito", erro: "conversao_inverte_operacao_multiplicacao", descricao: "Multiplicou ao passar de unidade menor para maior.", peso: 3 }
        ],
        passo: "1 metro tem 100 cm. Para voltar de cm para m, dividimos: 350 ÷ 100 = 3,5 m.",
        dica: "Pense na fita métrica: 100 cm formam 1 metro. Então 300 cm são 3 metros, e 50 cm é a metade."
    },

    // ── AULA 3: UNIDADES DE TEMPO ──────────────────────────────────────────

    {
        id: "B3Q06", bloco: 3, aula: 3, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA20", bncc_desc: "Conversão de Tempo",
        display: "Uma prova durou 2 horas e 45 minutos. Quantos minutos durou no total?",
        res: "165 min",
        alternativas: [
            { valor: "165 min", tipo: "acerto" },
            { valor: "245 min", tipo: "erro", categoria: "conceito", erro: "tempo_base_cem", descricao: "Assumiu que 1h = 100min (confundiu sistema sexagesimal com decimal).", peso: 3 },
            { valor: "125 min", tipo: "erro", categoria: "calculo", erro: "tempo_ignora_multiplicador", descricao: "Erro na soma de 120 + 45 ou na multiplicação 2x60.", peso: 2 },
            { valor: "145 min", tipo: "erro", categoria: "atencao", erro: "tempo_erro_adicao_horas", descricao: "Somou apenas uma hora (60) com os minutos ou errou o reagrupamento.", peso: 1 }
        ],
        passo: "1h = 60 min. Então 2h = 120 min. Agora somamos a sobra: 120 + 45 = 165 minutos.",
        dica: "Cuidado! O tempo não funciona de 100 em 100. O 'chefe' do tempo é o 60!"
    },

    // ── AULA 4: PERÍMETRO E ÁREA ───────────────────────────────────────────

    {
        id: "B3Q08", bloco: 3, aula: 4, tipo: "geometria",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA20", bncc_desc: "Perímetro de Retângulo",
        display: "Qual é o perímetro de um jardim retangular com 8 m de comprimento e 5 m de largura?",
        res: "26 m",
        alternativas: [
            { valor: "26 m", tipo: "acerto" },
            { valor: "40 m", tipo: "erro", categoria: "conceito", erro: "geometria_confunde_perimetro_area", descricao: "Calculou a área (8x5) em vez do contorno.", peso: 3 },
            { valor: "13 m", tipo: "erro", categoria: "procedimento", erro: "geometria_perimetro_soma_parcial", descricao: "Somou apenas dois lados (8+5), ignorando os outros dois.", peso: 2 },
            { valor: "80 m", tipo: "erro", categoria: "estrategia", erro: "geometria_operacao_superdimensionada", descricao: "Multiplicou os lados e dobrou (lógica híbrida confusa).", peso: 2 }
        ],
        passo: "Perímetro é a soma de TODOS os lados: 8 + 5 + 8 + 5 = 26 metros.",
        dica: "Imagine que você está caminhando sobre o muro do jardim. Você precisa percorrer os quatro lados para voltar ao início!"
    },

    {
        id: "B3Q13", bloco: 3, aula: 5, tipo: "geometria",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF08MA07", bncc_desc: "Área de Triângulo",
        display: "Um triângulo tem base de 10 cm e altura de 6 cm. Qual é a sua área?",
        res: "30 cm²",
        alternativas: [
            { valor: "30 cm²", tipo: "acerto" },
            { valor: "60 cm²", tipo: "erro", categoria: "procedimento", erro: "geometria_triangulo_omite_divisao", descricao: "Esqueceu de dividir por 2 (calculou como se fosse retângulo).", peso: 3 },
            { valor: "16 cm²", tipo: "erro", categoria: "procedimento", erro: "geometria_area_soma_dimensoes", descricao: "Somou base e altura em vez de multiplicar.", peso: 2 },
            { valor: "15 cm²", tipo: "erro", categoria: "calculo", erro: "geometria_triangulo_erro_divisao", descricao: "Dividiu por 4 ou errou a divisão de 60 por 2.", peso: 1 }
        ],
        passo: "Área do triângulo = (Base × Altura) ÷ 2. Então: (10 × 6) = 60. E 60 ÷ 2 = 30 cm².",
        dica: "Todo triângulo é a METADE de um retângulo. Calcule a área total e depois 'corte' ao meio!"
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO (Desafio para quem tem Combo Alto)
    {
        id: "B3Q15", bloco: 3, aula: 5, tipo: "geometria",
        dificuldade: 3, tipoPedagogico: "investigacao", // ADA puxa se o Combo for >= 4
        bncc: "EF08MA07", bncc_desc: "Variação de Área",
        display: "Investigação: Se você DOBRAR a medida dos lados de um quadrado, o que acontece com a área dele?",
        res: "Fica 4 vezes maior",
        alternativas: [
            { valor: "Fica 4 vezes maior", tipo: "acerto" },
            { valor: "Fica o dobro (2x)", tipo: "erro", categoria: "conceito", erro: "proporcionalidade_linear_area", descricao: "Assumiu que a área cresce na mesma proporção do lado.", peso: 3 },
            { valor: "Fica 8 vezes maior", tipo: "erro", categoria: "procedimento", erro: "proporcionalidade_cubica_area", descricao: "Confundiu o aumento de área (2D) com volume (3D).", peso: 2 },
            { valor: "Não se altera", tipo: "erro", categoria: "atencao", erro: "conceito_estatico", descricao: "Ignorou o efeito multiplicativo da geometria.", peso: 1 }
        ],
        passo: "Área = Lado × Lado. Se dobrar (2x), fazemos 2 × 2 = 4. A área cresce ao quadrado!",
        dica: "Desenhe um quadradinho. Agora faça um quadrado com o dobro do lado. Quantos quadradinhos pequenos cabem dentro do novo? São 4!"
    },

    // ── AULA 6: VOLUME E PROBLEMAS INTEGRADORES ────────────────────────────

    {
        id: "B3Q17", bloco: 3, aula: 6, tipo: "geometria",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF08MA07", bncc_desc: "Volume de Cubo",
        display: "Qual é o volume de um cubo cuja aresta (lado) mede 5 cm?",
        res: "125 cm³",
        alternativas: [
            { valor: "125 cm³", tipo: "acerto" },
            { valor: "25 cm²", tipo: "erro", categoria: "conceito", erro: "geometria_confunde_volume_area", descricao: "Calculou apenas a área de uma face (5x5).", peso: 3 },
            { valor: "15 cm³", tipo: "erro", categoria: "procedimento", erro: "geometria_volume_multiplica_tres", descricao: "Multiplicou por 3 (5x3) em vez de elevar ao cubo (5x5x5).", peso: 2 },
            { valor: "75 cm³", tipo: "erro", categoria: "estrategia", erro: "geometria_volume_calculo_hibrido", descricao: "Multiplicou a área da face (25) por 3 (número de dimensões).", peso: 2 }
        ],
        passo: "Volume = Lado × Lado × Lado. V = 5 × 5 × 5 = 125 cm³.",
        dica: "Volume é 3D! Você precisa multiplicar as três dimensões: largura, comprimento e altura."
    },

    {
        id: "B3Q20", bloco: 3, aula: 8, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF08MA07", bncc_desc: "Grandezas — Problema Integrador",
        display: "Vai colocar piso em uma sala de 4,5 m por 3 m. O piso custa R$ 45,00 o m². Qual o custo total?",
        res: "R$ 607,50",
        alternativas: [
            { valor: "R$ 607,50", tipo: "acerto" },
            { valor: "R$ 675,00", tipo: "erro", categoria: "conceito", erro: "problema_custo_usa_perimetro", descricao: "Calculou o custo sobre o perímetro (15m) em vez da área (13,5m²).", peso: 3 },
            { valor: "R$ 337,50", tipo: "erro", categoria: "conceito", erro: "problema_custo_soma_lados", descricao: "Multiplicou apenas a soma dos lados (7,5) pelo preço.", peso: 3 },
            { valor: "R$ 202,50", tipo: "erro", categoria: "calculo", erro: "problema_erro_multiplicacao_decimal", descricao: "Errou a conta de 13,5 × 45.", peso: 1 }
        ],
        passo: "1º: Achar a área (4,5 × 3 = 13,5 m²). 2º: Multiplicar pelo preço (13,5 × 45 = 607,50).",
        dica: "Primeiro veja quantos 'quadradinhos' de piso cabem no chão (Área). Depois veja quanto custa cada quadradinho!"
    }
];
