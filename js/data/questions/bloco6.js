/**
 * bloco6.js — Geometria: Ângulos, Triângulos e Polígonos
 * Foco: Classificação, Dedução, Polígonos e Pitágoras
 * Clusters: CLASSIFICACAO_GEOMETRICA, DEDUCAO_ANGULAR, GENERALIZACAO_POLIGONAL, RACIOCINIO_PITAGORICO
 */

export const bloco6 = [

    // ── AULA 1: ÂNGULOS (DEDUCAO_ANGULAR) ────────────────────────────────

    // [NOVA] QUESTÃO DE RECOMPOSIÇÃO (Resgate de Base)
    {
        id: "B6Q00", bloco: 6, aula: 1, tipo: "conceito",
        dificuldade: 1, tipoPedagogico: "recomposicao", // ADA puxa se errar B6Q01 ou B6Q02
        bncc: "EF07MA21", bncc_desc: "Conceito de Giro e Ângulo Raso",
        display: "Se você der uma volta completa no próprio eixo, girou 360°. Se der apenas MEIA volta, quantos graus você girou?",
        res: "180°",
        alternativas: [
            { valor: "180°", tipo: "acerto" },
            { valor: "90°", tipo: "erro", categoria: "conceito", erro: "angulo_confunde_quarto_volta", descricao: "Confundiu meia volta com um quarto de volta (ângulo reto).", peso: 3 },
            { valor: "360°", tipo: "erro", categoria: "atencao", erro: "angulo_repeticao_volta_inteira", descricao: "Repetiu o valor da volta inteira sem dividir.", peso: 1 },
            { valor: "100°", tipo: "erro", categoria: "estrategia", erro: "angulo_usa_base_decimal", descricao: "Usou a base 100 (porcentagem/decimal) em vez da base de 360 graus.", peso: 2 }
        ],
        passo: "Uma volta inteira mede 360°. A metade de 360 é 180°, que forma uma linha reta perfeita (ângulo raso).",
        dica: "Dica da ADA: Pense numa pizza cortada exatamente ao meio. Se a pizza inteira tem 360 fatias, quantas tem a metade?"
    },

    {
        id: "B6Q01", bloco: 6, aula: 1, tipo: "conceito",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA21", bncc_desc: "Classificação de Ângulos",
        display: "Um ângulo que mede exatos 120° é classificado como:",
        res: "Obtuso",
        alternativas: [
            { valor: "Obtuso", tipo: "acerto" },
            { valor: "Agudo", tipo: "erro", categoria: "conceito", erro: "angulo_classificacao_abaixo_90", descricao: "Confundiu a definição de ângulo obtuso (>90°) com a de agudo (<90°).", peso: 3 },
            { valor: "Raso", tipo: "erro", categoria: "conceito", erro: "angulo_confunde_meia_volta", descricao: "Atribuiu a nomenclatura de 180° a um ângulo de 120°.", peso: 2 },
            { valor: "Reto", tipo: "erro", categoria: "atencao", erro: "angulo_ignora_valor_90", descricao: "Não associou o ângulo reto exclusivamente à medida de 90°.", peso: 1 }
        ],
        passo: "Ângulos maiores que 90° e menores que 180° são obtusos.",
        dica: "Pense na abertura: se ele for mais 'aberto' que o canto de um quadrado (90°), ele é obtuso."
    },
    
    {
        id: "B6Q02", bloco: 6, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA21", bncc_desc: "Ângulos Complementares e Suplementares",
        display: "Qual é o valor do ângulo suplementar de 70°?",
        res: "110°",
        alternativas: [
            { valor: "110°", tipo: "acerto" },
            { valor: "20°", tipo: "erro", categoria: "conceito", erro: "angulo_calcula_complemento_inves_suplemento", descricao: "Calculou a diferença para 90° em vez de calcular para 180°.", peso: 3 },
            { valor: "290°", tipo: "erro", categoria: "procedimento", erro: "angulo_calculo_explementar", descricao: "Subtraiu de 360° (volta completa) ignorando o conceito de suplementar.", peso: 2 },
            { valor: "70°", tipo: "erro", categoria: "atencao", erro: "angulo_repeticao_dado", descricao: "Não realizou operação aritmética, apenas repetiu o valor de entrada.", peso: 1 }
        ],
        passo: "Ângulos suplementares somam 180°. Cálculo: 180° - 70° = 110°.",
        dica: "Suplementar é o que falta para completar uma linha reta (180°)."
    },

    // ── AULA 2: PARALELAS E TRANSVERSAL ──────────────────────────────────

    {
        id: "B6Q03", bloco: 6, aula: 2, tipo: "conceito",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA21", bncc_desc: "Retas Paralelas Cortadas por Transversal",
        display: "Em retas paralelas cortadas por uma transversal, os ângulos ALTERNOS INTERNOS são sempre:",
        res: "Iguais",
        alternativas: [
            { valor: "Iguais", tipo: "acerto" },
            { valor: "Somam 180°", tipo: "erro", categoria: "conceito", erro: "paralelas_confunde_alterno_colateral", descricao: "Atribuiu a propriedade de soma 180° (colaterais) aos ângulos alternos.", peso: 3 },
            { valor: "Somam 90°", tipo: "erro", categoria: "procedimento", erro: "paralelas_soma_90_indevida", descricao: "Tentou aplicar a regra de 90° em um sistema de paralelas.", peso: 2 },
            { valor: "Diferentes", tipo: "erro", categoria: "interpretacao", erro: "paralelas_nao_identifica_congruencia", descricao: "Não reconheceu a igualdade de medidas entre os pares de ângulos alternos.", peso: 2 }
        ],
        passo: "Ângulos alternos internos ficam em lados opostos da linha transversal, entre as paralelas, e têm a mesma medida.",
        dica: "Imagine a letra 'Z'. Os ângulos que ficam 'dentro' das curvas da letra Z são sempre iguais."
    },

    // ── AULA 3 e 4: TRIÂNGULOS ───────────────────────────────────────────

    {
        id: "B6Q04", bloco: 6, aula: 3, tipo: "conceito",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF07MA22", bncc_desc: "Classificação de Triângulos",
        display: "Um triângulo que possui todos os três lados com medidas DIFERENTES é chamado de:",
        res: "Escaleno",
        alternativas: [
            { valor: "Escaleno", tipo: "acerto" },
            { valor: "Isósceles", tipo: "erro", categoria: "conceito", erro: "triangulo_confunde_escaleno_isosceles", descricao: "Confundiu a ausência de igualdade com a presença de dois lados iguais.", peso: 3 },
            { valor: "Equilátero", tipo: "erro", categoria: "conceito", erro: "triangulo_confunde_escaleno_equilatero", descricao: "Confundiu lados diferentes com a igualdade total de lados.", peso: 3 },
            { valor: "Retângulo", tipo: "erro", categoria: "interpretacao", erro: "triangulo_confunde_lado_angulo", descricao: "Classificou pelo ângulo (90°) em vez de utilizar o critério de medidas dos lados.", peso: 2 }
        ],
        passo: "Lados diferentes = Escaleno. Dois iguais = Isósceles. Três iguais = Equilátero.",
        dica: "Escaleno rima com 'pleno de diferenças'. Nenhum lado é igual ao outro."
    },
    
    {
        id: "B6Q05", bloco: 6, aula: 4, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA22", bncc_desc: "Soma dos Ângulos Internos do Triângulo",
        display: "Dois ângulos de um triângulo medem 50° e 70°. Quanto mede o terceiro ângulo?",
        res: "60°",
        alternativas: [
            { valor: "60°", tipo: "acerto" },
            { valor: "180°", tipo: "erro", categoria: "conceito", erro: "triangulo_soma_confunde_total_valor", descricao: "Indicou a soma total interna (180°) como sendo o valor do ângulo faltante.", peso: 3 },
            { valor: "120°", tipo: "erro", categoria: "procedimento", erro: "triangulo_soma_omite_abate_180", descricao: "Somou os ângulos dados (50+70), mas não subtraiu o resultado do total de 180°.", peso: 2 },
            { valor: "80°", tipo: "erro", categoria: "calculo", erro: "triangulo_subtracao_aritmetica_errada", descricao: "Errou a conta de subtrair ao tentar encontrar a diferença para 180°.", peso: 1 }
        ],
        passo: "A soma dos ângulos internos é 180°. 50 + 70 = 120. Então: 180 - 120 = 60°.",
        dica: "Pense: os três juntos devem formar uma linha reta (180°). Quanto falta para chegar lá?"
    },

    // ── AULA 5 e 6: QUADRILÁTEROS E POLÍGONOS ────────────────────────────

    {
        id: "B6Q06", bloco: 6, aula: 5, tipo: "conceito",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA23", bncc_desc: "Propriedades dos Quadriláteros",
        display: "Qual quadrilátero possui os 4 lados iguais, mas NÃO exige ângulos retos (90°)?",
        res: "Losango",
        alternativas: [
            { valor: "Losango", tipo: "acerto" },
            { valor: "Quadrado", tipo: "erro", categoria: "conceito", erro: "quadrilatero_exige_angulo_reto", descricao: "Selecionou a figura que, além de lados iguais, exige obrigatoriamente ângulos de 90°.", peso: 2 },
            { valor: "Retângulo", tipo: "erro", categoria: "conceito", erro: "quadrilatero_lados_opostos_apenas", descricao: "Confundiu com a figura que tem apenas lados opostos iguais e ângulos retos.", peso: 3 },
            { valor: "Trapézio", tipo: "erro", categoria: "interpretacao", erro: "quadrilatero_falha_definicao_paralelas", descricao: "Selecionou uma figura com apenas um par de lados paralelos e lados geralmente desiguais.", peso: 3 }
        ],
        passo: "O Losango é o quadrilátero com 4 lados iguais. O quadrado é um tipo especial de losango.",
        dica: "Lembre da forma amarela na nossa bandeira do Brasil: lados iguais, mas os cantos não são retos."
    },
    
    {
        id: "B6Q07", bloco: 6, aula: 6, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA23", bncc_desc: "Soma dos Ângulos Internos de Polígonos",
        display: "Qual é a soma dos ângulos internos de um Pentágono (polígono de 5 lados)?",
        res: "540°",
        alternativas: [
            { valor: "540°", tipo: "acerto" },
            { valor: "360°", tipo: "erro", categoria: "conceito", erro: "poligono_generaliza_quadrilatero", descricao: "Aplicou a soma de 360° (quadriláteros) para um polígono de 5 lados.", peso: 3 },
            { valor: "180°", tipo: "erro", categoria: "conceito", erro: "poligono_generaliza_triangulo", descricao: "Aplicou a soma de 180° (triângulos) para um polígono de 5 lados.", peso: 3 },
            { valor: "720°", tipo: "erro", categoria: "procedimento", erro: "poligono_erro_n_formula", descricao: "Aplicou a fórmula (n-2)x180 utilizando o número errado de lados (n=6).", peso: 2 }
        ],
        passo: "Fórmula: (lados - 2) × 180. Para 5 lados: (5 - 2) × 180 = 3 × 180 = 540°.",
        dica: "Imagine dividir o pentágono em triângulos: se você traçar linhas a partir de um canto, consegue formar 3 triângulos lá dentro."
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO (Combo Alto - Soma Externa)
    {
        id: "B6Q10", bloco: 6, aula: 6, tipo: "critica",
        dificuldade: 3, tipoPedagogico: "investigacao", // ADA puxa se Combo >= 4
        bncc: "EF07MA23", bncc_desc: "Ângulos Externos de Polígonos",
        display: "Investigação: A soma dos ângulos INTERNOS aumenta com os lados. Mas qual é a soma dos ângulos EXTERNOS de qualquer polígono?",
        res: "Sempre 360°",
        alternativas: [
            { valor: "Sempre 360°", tipo: "acerto" },
            { valor: "Aumenta com os lados", tipo: "erro", categoria: "conceito", erro: "poligono_confunde_externo_com_interno", descricao: "Assumiu que os ângulos externos seguem a mesma regra de expansão dos internos.", peso: 3 },
            { valor: "Sempre 180°", tipo: "erro", categoria: "atencao", erro: "poligono_angulo_externo_linha_reta", descricao: "Confundiu a soma total externa com o ângulo de uma linha reta.", peso: 2 },
            { valor: "540°", tipo: "erro", categoria: "estrategia", erro: "poligono_chute_medida_interna", descricao: "Utilizou um valor interno de pentágono como regra universal.", peso: 1 }
        ],
        passo: "Imagine que você está caminhando em volta do polígono. Quando você terminar de contornar e voltar para a mesma posição de início, você deu uma volta completa no próprio eixo (360°).",
        dica: "Não importa o formato da pista. Se você der uma volta completa nela e retornar à mesma direção, você girou exatamente uma volta inteira!"
    },

    // ── AULA 9: TEOREMA DE PITÁGORAS E CONDIÇÕES ─────────────────────────

    {
        id: "B6Q08", bloco: 6, aula: 9, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA24", bncc_desc: "Teorema de Pitágoras — Aplicação",
        display: "Em um triângulo retângulo, os catetos medem 3 e 4. Quanto mede a hipotenusa?",
        res: "5",
        alternativas: [
            { valor: "5", tipo: "acerto" },
            { valor: "7", tipo: "erro", categoria: "conceito", erro: "pitagoras_soma_linear_catetos", descricao: "Somou os catetos diretamente (3+4) ignorando a relação de quadrados.", peso: 3 },
            { valor: "25", tipo: "erro", categoria: "procedimento", erro: "pitagoras_omite_raiz_final", descricao: "Calculou a soma dos quadrados (9+16=25), mas não extraiu a raiz quadrada final.", peso: 2 },
            { valor: "12", tipo: "erro", categoria: "interpretacao", erro: "pitagoras_multiplica_catetos", descricao: "Multiplicou os valores dos catetos entre si (3x4).", peso: 2 }
        ],
        passo: "a² + b² = c². Então: 3² + 4² = 9 + 16 = 25. A raiz quadrada de 25 é 5.",
        dica: "Lembre-se da fórmula mágica! Você precisa elevar ao quadrado, somar e depois tirar a raiz quadrada do final."
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO (Combo Alto - Lógica de Existência)
    {
        id: "B6Q12", bloco: 6, aula: 9, tipo: "critica",
        dificuldade: 3, tipoPedagogico: "investigacao",
        bncc: "EF07MA24", bncc_desc: "Condição de Existência do Triângulo",
        display: "Investigação: Se você tentar montar um triângulo usando palitos de medidas 3 cm, 4 cm e 8 cm, o que acontecerá?",
        res: "Não formará um triângulo",
        alternativas: [
            { valor: "Não formará um triângulo", tipo: "acerto" },
            { valor: "Forma triângulo retângulo", tipo: "erro", categoria: "conceito", erro: "existencia_assume_triangulo_impossivel", descricao: "Acha que quaisquer 3 medidas fecham um triângulo.", peso: 3 },
            { valor: "A hipotenusa será 8", tipo: "erro", categoria: "procedimento", erro: "existencia_forca_hipotenusa", descricao: "Assumiu o maior lado como hipotenusa ignorando que a forma nem fecha.", peso: 2 },
            { valor: "Forma triângulo escaleno", tipo: "erro", categoria: "atencao", erro: "existencia_classifica_impossivel", descricao: "Classificou os lados diferentes como escaleno, ignorando a física da forma.", peso: 2 }
        ],
        passo: "Condição de Existência: o maior lado (8) DEVE ser menor que a soma dos outros dois (3 + 4 = 7). Como 8 é maior que 7, a figura fica aberta.",
        dica: "Imagine os dois palitos menores (3 e 4) deitados no chão. Se você tentar encostar as pontas deles, eles conseguem alcançar o tamanho do palito de 8?"
    }
];
