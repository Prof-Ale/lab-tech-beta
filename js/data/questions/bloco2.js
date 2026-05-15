/**
 * bloco2.js — Números e Operações (Arquivo Unificado)
 * Foco: Inteiros, Frações, Decimais e Proporcionalidade
 * Clusters: SISTEMA_NUMERICO, MODELAGEM_SITUACIONAL, RACIOCINIO_FRACIONARIO, OPERACOES_DECIMAIS
 */

export const bloco2 = [

    // ── AULA 1: INTEIROS E RETA NUMÉRICA ─────────────────────────────────

    // [NOVA] QUESTÃO DE RECOMPOSIÇÃO (Resgate de Base)
    {
        id: "B2Q00", bloco: 2, aula: 1, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "recomposicao", // ADA puxa se errar o sinal na Reta Numérica
        bncc: "EF07MA02", bncc_desc: "Conceito de Negativo (Termômetro)",
        display: "Se a temperatura na cidade estava em 2°C positivos e caiu 5°C durante a noite, quanto o termômetro passou a marcar?",
        res: "-3°C",
        alternativas: [
            { valor: "-3°C", tipo: "acerto" },
            { valor: "3°C", tipo: "erro", categoria: "conceito", erro: "sinais_subtrai_modulos_positivo", descricao: "Fez a diferença absoluta e deixou positivo.", peso: 3 },
            { valor: "7°C", tipo: "erro", categoria: "procedimento", erro: "sinais_soma_ignorando_queda", descricao: "Somou os valores ignorando a palavra 'caiu'.", peso: 2 },
            { valor: "0°C", tipo: "erro", categoria: "estrategia", erro: "sinais_assume_zero_limite", descricao: "Acreditou que a temperatura não pode passar de zero.", peso: 1 }
        ],
        passo: "O termômetro estava no 2. Ao cair 2 graus, ele zera. Como caiu 5 no total, ele precisa descer mais 3 graus abaixo de zero. Logo, -3°C.",
        dica: "Dica da ADA: Desenhe um termômetro em pé! Marque o 2 e desça 5 'degraus'. Onde você parou?"
    },

    {
        id: "B2T1Q01", bloco: 2, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Números Inteiros — Reta Numérica",
        display: "Na reta numérica, qual destes números está posicionado MAIS À ESQUERDA?",
        res: "-8",
        alternativas: [
            { valor: "-8", tipo: "acerto" },
            { valor: "+2", tipo: "erro", categoria: "conceito", erro: "reta_ignora_orientacao_negativa", descricao: "Inverteu a lógica de ordenação, selecionando o maior valor positivo em vez do menor negativo.", peso: 3 },
            { valor: "0", tipo: "erro", categoria: "conceito", erro: "reta_assume_zero_limite", descricao: "Acreditou que o zero é o limite final à esquerda, ignorando a existência dos negativos.", peso: 3 },
            { valor: "-3", tipo: "erro", categoria: "procedimento", erro: "reta_inverte_modulo_negativo", descricao: "Comparou negativos usando a lógica dos naturais (achando que 3 é menor que 8).", peso: 2 }
        ],
        passo: "Na reta numérica, quanto mais à esquerda, menor o valor. O -8 é o menor de todos nesta lista.",
        dica: "Imagine um termômetro deitado: os números mais frios (negativos maiores) ficam bem longe à esquerda!"
    },
    {
        id: "B2T1Q03", bloco: 2, aula: 1, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Valor Absoluto",
        display: "Qual é o valor numérico exato de |-7| (módulo de menos sete)?",
        res: "7",
        alternativas: [
            { valor: "7", tipo: "acerto" },
            { valor: "-7", tipo: "erro", categoria: "conceito", erro: "modulo_mantem_sinal_negativo", descricao: "Manteve o sinal negativo, não compreendendo que módulo representa distância absoluta.", peso: 3 },
            { valor: "0", tipo: "erro", categoria: "estrategia", erro: "modulo_associa_anulacao", descricao: "Interpretou as barras de módulo como uma instrução para zerar o valor.", peso: 2 },
            { valor: "+7", tipo: "erro", categoria: "atencao", erro: "modulo_formaliza_sinal", descricao: "Acertou o valor, mas demonstrou dependência de sinal para representar magnitude.", peso: 1 }
        ],
        passo: "O módulo (||) mede a distância até o zero. Não existe distância negativa! Por isso, |-7| = 7.",
        dica: "O módulo funciona como uma 'limpadora de sinais': ele extrai apenas o tamanho do número, sempre positivo."
    },

    // ── AULA 2 E 3: ADIÇÃO E SUBTRAÇÃO DE INTEIROS ───────────────────────

    {
        id: "B2T1Q08", bloco: 2, aula: 2, tipo: "sinais",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Adição de Inteiros — Sinais Iguais",
        display: "Resolva a operação: (-6) + (-4) = ?",
        a: -6, 
        b: -4, 
        res: "-10",
        alternativas: [
            { valor: "-10", tipo: "acerto" },
            { valor: "+10", tipo: "erro", categoria: "conceito", erro: "adicao_sinais_aplica_regra_multiplicacao", descricao: "Aplicou 'menos com menos dá mais', que só vale para multiplicação/divisão.", peso: 3 },
            { valor: "-2", tipo: "erro", categoria: "procedimento", erro: "adicao_sinais_subtrai_modulos", descricao: "Subtraiu os valores em vez de somar as dívidas acumuladas.", peso: 2 },
            { valor: "+2", tipo: "erro", categoria: "estrategia", erro: "adicao_sinais_erro_total", descricao: "Subtraiu os módulos e ainda inverteu o sinal de forma arbitrária.", peso: 2 }
        ],
        passo: "Sinais iguais? Somamos os valores e mantemos o sinal. Dívida de 6 + Dívida de 4 = Dívida de 10.",
        dica: "Pense em dinheiro: se você deve 6 e pede mais 4 emprestado, sua dívida aumenta para 10!"
    },
    {
        id: "B2T1Q09", bloco: 2, aula: 2, tipo: "sinais",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Adição de Inteiros — Sinais Diferentes",
        display: "Qual o resultado de: (+10) + (-3) = ?",
        a: 10, 
        b: -3, 
        res: "+7",
        alternativas: [
            { valor: "+7", tipo: "acerto" },
            { valor: "-7", tipo: "erro", categoria: "procedimento", erro: "adicao_sinais_sinal_do_menor", descricao: "Subtraiu corretamente, mas deu o sinal do número de menor módulo.", peso: 2 },
            { valor: "+13", tipo: "erro", categoria: "conceito", erro: "adicao_sinais_soma_modulos", descricao: "Ignorou os sinais e somou os valores absolutos como se fossem naturais.", peso: 3 },
            { valor: "-13", tipo: "erro", categoria: "estrategia", erro: "adicao_sinais_regra_mista_falha", descricao: "Somou os valores e aplicou a regra 'mais com menos dá menos' da multiplicação.", peso: 3 }
        ],
        passo: "Sinais diferentes? Subtraímos (10 - 3 = 7) e mantemos o sinal do maior 'peso' (o +10).",
        dica: "Você tem 10 reais e gasta 3. O que sobra no seu bolso?"
    },
    {
        id: "B2T1Q14", bloco: 2, aula: 3, tipo: "sinais",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Subtração — Truque do Oposto",
        display: "Calcule o resultado de: (+6) - (-2) = ?",
        a: 6, 
        b: 2, 
        res: "+8",
        alternativas: [
            { valor: "+8", tipo: "acerto" },
            { valor: "+4", tipo: "erro", categoria: "conceito", erro: "subtracao_ignora_inversao", descricao: "Subtraiu os números diretamente, ignorando que o sinal de 'menos' inverte o próximo número.", peso: 3 },
            { valor: "-8", tipo: "erro", categoria: "procedimento", erro: "subtracao_inverte_sinal_final", descricao: "Fez a inversão correta para soma, mas errou o sinal do resultado final.", peso: 2 },
            { valor: "-4", tipo: "erro", categoria: "estrategia", erro: "subtracao_falha_total", descricao: "Subtraiu os módulos e negativou o resultado sem critério lógico.", peso: 2 }
        ],
        passo: "Subtrair um negativo é o mesmo que somar um positivo! (+6) - (-2) vira 6 + 2 = 8.",
        dica: "Quando ver dois sinais de menos colados (- -), eles se transformam num sinal de MAIS (+)."
    },
    {
        id: "B2T1Q18", bloco: 2, aula: 3, tipo: "sinais",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Diferença e Amplitude",
        display: "Moscou registrou -12°C e São Paulo +28°C. Qual a DIFERENÇA de temperatura entre elas?",
        a: -12, 
        b: 40,  
        res: "40°C",
        alternativas: [
            { valor: "40°C", tipo: "acerto" },
            { valor: "16°C", tipo: "erro", categoria: "conceito", erro: "distancia_subtrai_modulos", descricao: "Subtraiu os valores absolutos (28-12), ignorando que uma cidade está abaixo de zero.", peso: 3 },
            { valor: "-40°C", tipo: "erro", categoria: "procedimento", erro: "distancia_sinal_indevido", descricao: "Calculou a amplitude correta, mas aplicou sinal negativo a uma medida de distância térmica.", peso: 2 },
            { valor: "-16°C", tipo: "erro", categoria: "estrategia", erro: "distancia_erro_misto", descricao: "Errou a amplitude e ainda negativou o resultado.", peso: 3 }
        ],
        passo: "Diferença é a distância na reta. Do -12 até o 0 são 12 graus. Do 0 até o 28 são mais 28 graus. Total: 12 + 28 = 40.",
        dica: "Imagine subir um prédio: você sai do subsolo (-12) e vai até o 28º andar. Quantos andares subiu no total?"
    },
    {
        id: "B2T1Q20", bloco: 2, aula: 3, tipo: "teoria",
        dificuldade: 3, tipoPedagogico: "investigacao",
        bncc: "EF07MA02", bncc_desc: "Investigação Lógica",
        display: "Investigação: É possível que a subtração de dois números NEGATIVOS resulte em um número POSITIVO?",
        res: "Sim. Ex: (-3) - (-8) = +5",
        alternativas: [
            { valor: "Sim. Ex: (-3) - (-8) = +5", tipo: "acerto" },
            { valor: "Não, o resultado é sempre negativo", tipo: "erro", categoria: "conceito", erro: "subtracao_dogma_sinal", descricao: "Acredita que operações com negativos nunca podem cruzar a barreira do zero.", peso: 3 },
            { valor: "Não, o resultado é sempre zero", tipo: "erro", categoria: "procedimento", erro: "subtracao_anulacao_arbitraria", descricao: "Generalizou a ideia de anulação de opostos para qualquer subtração de negativos.", peso: 2 },
            { valor: "Sim, mas só se os números forem iguais", tipo: "erro", categoria: "interpretacao", erro: "subtracao_condicao_restritiva", descricao: "Confundiu o resultado positivo com o resultado nulo de elementos idênticos.", peso: 2 }
        ],
        passo: "Sim! Se você 'retirar' uma dívida grande de uma dívida pequena, você fica no lucro. (-3) + 8 = +5.",
        dica: "Lembre-se: subtrair um negativo grande é como receber um grande presente!"
    },

    // ── AULA 4: MULTIPLICAÇÃO E DIVISÃO DE INTEIROS ──────────────────────

    {
        id: "B2T2Q01", bloco: 2, aula: 4, tipo: "aritmetica", 
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Multiplicação de Inteiros — Regra dos Sinais",
        display: "Qual o resultado da operação: (+6) × (-4)?",
        res: "-24",
        alternativas: [
            { valor: "-24", tipo: "acerto" },
            { valor: "+24", tipo: "erro", categoria: "conceito", erro: "multiplicacao_sinais_positiva_errada", descricao: "Atribuiu sinal positivo ao produto de fatores com sinais opostos.", peso: 3 },
            { valor: "-10", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_confunde_com_adicao", descricao: "Realizou a soma de dívidas (-6-4) em vez de multiplicar os módulos.", peso: 2 },
            { valor: "+10", tipo: "erro", categoria: "estrategia", erro: "multiplicacao_confunde_adicao_sinal_oposto", descricao: "Somou os módulos absolutos e inverteu o sinal arbitrariamente.", peso: 2 }
        ],
        passo: "Sinais diferentes na multiplicação sempre resultam em negativo. 6 × 4 = 24. Logo, -24.",
        dica: "Dica da ADA: Na multiplicação e divisão, sinais diferentes são inimigos... o resultado é sempre negativo!"
    },
    {
        id: "B2T2Q02", bloco: 2, aula: 4, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Multiplicação de Inteiros — Regra dos Sinais",
        display: "Calcule o produto: (-3) × (-9) = ?",
        res: "+27",
        alternativas: [
            { valor: "+27", tipo: "acerto" },
            { valor: "-27", tipo: "erro", categoria: "conceito", erro: "multiplicacao_sinais_mantem_negativo", descricao: "Assumiu que a multiplicação de dois negativos preserva a negatividade (como na soma).", peso: 3 },
            { valor: "-12", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_confunde_com_adicao_negativa", descricao: "Somou as dívidas em vez de multiplicar os fatores.", peso: 2 },
            { valor: "+12", tipo: "erro", categoria: "atencao", erro: "multiplicacao_soma_inverte_sinal", descricao: "Somou os numerais e forçou a positividade por reconhecer o par de sinais.", peso: 1 }
        ],
        passo: "Sinais iguais na multiplicação resultam em positivo. É como 'negar uma dívida': vira um ganho! 3 × 9 = 27.",
        dica: "Menos com Menos na multiplicação vira MAIS. Pense que os dois tracinhos se cruzam e formam uma cruz de positivo!"
    },
    {
        id: "B2T2Q05", bloco: 2, aula: 4, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA02", bncc_desc: "Produto com Três Fatores — Sinal",
        display: "Qual o valor de (-2) × (-3) × (-4)?",
        res: "-24",
        alternativas: [
            { valor: "-24", tipo: "acerto" },
            { valor: "+24", tipo: "erro", categoria: "conceito", erro: "multiplicacao_sinais_generaliza_positivo", descricao: "Assumiu que qualquer cadeia de sinais negativos resulta em positivo.", peso: 3 },
            { valor: "-9", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_soma_cadeia", descricao: "Somou as bases como se fossem parcelas de uma dívida.", peso: 2 },
            { valor: "+9", tipo: "erro", categoria: "estrategia", erro: "multiplicacao_soma_inverte_cadeia", descricao: "Somou os valores e aplicou positividade indevida.", peso: 1 }
        ],
        passo: "Fazemos por partes: (-2) × (-3) = +6. Depois: (+6) × (-4) = -24.",
        dica: "Conte os sinais de menos: se for um número ímpar de sinais (como 3), o resultado final será negativo."
    },

    // ── AULA 5 E 6: FRAÇÕES (CONCEITO E SOMA/SUBTRAÇÃO) ──────────────────

    {
        id: "B2T2Q10", bloco: 2, aula: 5, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Frações — Conceito",
        display: "Uma pizza foi cortada em 8 fatias iguais. Pedro comeu 3. Que fração representa o que ele comeu?",
        res: "3/8",
        alternativas: [
            { valor: "3/8", tipo: "acerto" },
            { valor: "8/3", tipo: "erro", categoria: "conceito", erro: "fracao_inverte_numerador_denominador", descricao: "Inverteu a posição da parte (numerador) com o todo (denominador).", peso: 3 },
            { valor: "3/5", tipo: "erro", categoria: "procedimento", erro: "fracao_usa_sobra_como_denominador", descricao: "Usou a quantidade de fatias restantes como base da fração.", peso: 2 },
            { valor: "5/8", tipo: "erro", categoria: "interpretacao", erro: "fracao_calcula_sobra", descricao: "Identificou a fração do que sobrou, não do que foi comido.", peso: 2 }
        ],
        passo: "O número de baixo (denominador) indica o total de fatias (8). O de cima (numerador) o que foi pego (3).",
        dica: "O denominador 'denomina' em quantas partes o todo foi dividido. Imagine ele no fundo da caixa!"
    },
    {
        id: "B2T2Q11", bloco: 2, aula: 5, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Frações Equivalentes",
        display: "Qual fração abaixo vale o mesmo que (é equivalente a) 1/2?",
        res: "4/8",
        alternativas: [
            { valor: "4/8", tipo: "acerto" },
            { valor: "1/4", tipo: "erro", categoria: "conceito", erro: "fracao_aumenta_apenas_denominador", descricao: "Aumentou o denominador mantendo o numerador, o que diminui o valor da fração.", peso: 3 },
            { valor: "2/8", tipo: "erro", categoria: "procedimento", erro: "fracao_multiplicacao_assimetrica", descricao: "Multiplicou numerador e denominador por números diferentes.", peso: 2 },
            { valor: "3/8", tipo: "erro", categoria: "atencao", erro: "fracao_estimativa_visual_falha", descricao: "Escolheu um valor por semelhança visual sem testar a proporção.", peso: 1 }
        ],
        passo: "Para ser equivalente, multiplique em cima e em baixo pelo mesmo número. 1×4=4 e 2×4=8. Logo, 4/8.",
        dica: "Frações equivalentes são formas diferentes de dizer a mesma quantidade. 1 de 2 é o mesmo que 4 de 8!"
    },
    {
        id: "B2T2Q12", bloco: 2, aula: 5, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Simplificação de Frações",
        display: "Qual é a forma mais simples (irredutível) da fração 12/18?",
        res: "2/3",
        alternativas: [
            { valor: "2/3", tipo: "acerto" },
            { valor: "4/6", tipo: "erro", categoria: "procedimento", erro: "fracao_simplificacao_incompleta", descricao: "Simplificou uma vez, mas não chegou até a forma final irredutível.", peso: 2 },
            { valor: "6/9", tipo: "erro", categoria: "procedimento", erro: "fracao_simplificacao_parcial", descricao: "Iniciou a simplificação mas parou no primeiro divisor encontrado.", peso: 2 },
            { valor: "1/3", tipo: "erro", categoria: "calculo", erro: "fracao_erro_divisao_tabuada", descricao: "Errou a divisão básica durante o processo de simplificação.", peso: 1 }
        ],
        passo: "Dividimos ambos por 6 (MDC): 12÷6=2 e 18÷6=3. Resultado: 2/3.",
        dica: "Simplificar é 'enxugar' a fração. Continue dividindo até que não exista mais nenhum número que divida os dois ao mesmo tempo."
    },
    {
        id: "B2T3Q01", bloco: 2, aula: 6, tipo: "aritmetica",
        dificuldade: 1, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Adição de Frações — Mesmo Denominador",
        display: "Calcule a soma: 3/8 + 2/8 = ?",
        res: "5/8",
        alternativas: [
            { valor: "5/8", tipo: "acerto" },
            { valor: "5/16", tipo: "erro", categoria: "conceito", erro: "fracao_soma_denominadores", descricao: "Somou os denominadores indevidamente em vez de conservá-los.", peso: 3 },
            { valor: "6/16", tipo: "erro", categoria: "procedimento", erro: "fracao_multiplica_numerador_soma_denominador", descricao: "Misturou regras: multiplicou no numerador e somou no denominador.", peso: 2 },
            { valor: "1/8", tipo: "erro", categoria: "atencao", erro: "fracao_subtrai_em_vez_de_somar", descricao: "Executou subtração ignorando o operador de adição.", peso: 1 }
        ],
        passo: "Bases iguais? Repetimos o denominador (8) e somamos apenas o topo: 3 + 2 = 5. Resultado: 5/8.",
        dica: "Pense em fatias: 3 fatias de uma pizza de 8 pedaços mais 2 fatias da mesma pizza continuam sendo fatias de oitavos!"
    },
    {
        id: "B2T3Q03", bloco: 2, aula: 6, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Adição de Frações — Denominadores Diferentes",
        display: "Qual o resultado de 1/2 + 1/3?",
        res: "5/6",
        alternativas: [
            { valor: "5/6", tipo: "acerto" },
            { valor: "2/5", tipo: "erro", categoria: "conceito", erro: "fracao_soma_direta_bases_diferentes", descricao: "Somou numeradores e denominadores linearmente, ignorando a necessidade de base comum (MMC).", peso: 3 },
            { valor: "2/6", tipo: "erro", categoria: "procedimento", erro: "fracao_aplica_mmc_esquece_numerador", descricao: "Encontrou o MMC (6), mas não realizou a conversão proporcional dos numeradores.", peso: 2 },
            { valor: "4/6", tipo: "erro", categoria: "calculo", erro: "fracao_erro_proporcao_numerador", descricao: "Falhou na multiplicação escalar ao converter a fração para a nova base.", peso: 2 }
        ],
        passo: "MMC(2,3) = 6. Convertendo: 1/2 vira 3/6 e 1/3 vira 2/6. Agora somamos: 3/6 + 2/6 = 5/6.",
        dica: "Você não pode somar 'bananas com maçãs'. Use o MMC para deixar os números de baixo iguais antes de somar!"
    },

    // ── AULA 7: MULTIPLICAÇÃO E DIVISÃO DE FRAÇÕES ───────────────────────

    {
        id: "B2T3Q08", bloco: 2, aula: 7, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Multiplicação de Frações",
        display: "Resolva: 2/3 × 3/4 = ?",
        res: "1/2",
        alternativas: [
            { valor: "1/2", tipo: "acerto" },
            { valor: "6/12", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_omite_simplificacao", descricao: "Efetuou a multiplicação correta, mas não reduziu a fração à forma irredutível.", peso: 1 },
            { valor: "5/7", tipo: "erro", categoria: "conceito", erro: "multiplicacao_confunde_com_adicao_direta", descricao: "Somou os termos em vez de multiplicá-los.", peso: 3 },
            { valor: "2/4", tipo: "erro", categoria: "procedimento", erro: "multiplicacao_simplificacao_parcial", descricao: "Simplificou um fator, mas não concluiu a redução final.", peso: 1 }
        ],
        passo: "Multiplicação é direta: 2×3 = 6 (topo) e 3×4 = 12 (baixo). 6/12 simplificado por 6 dá 1/2.",
        dica: "Na multiplicação é 'frente com frente'! O de cima vezes o de cima, o de baixo vezes o de baixo."
    },
    {
        id: "B2T3Q09", bloco: 2, aula: 7, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Divisão de Frações",
        display: "Calcule: 3/4 ÷ 1/2 = ?",
        res: "3/2",
        alternativas: [
            { valor: "3/2", tipo: "acerto" },
            { valor: "3/8", tipo: "erro", categoria: "conceito", erro: "divisao_multiplica_direto_sem_inverter", descricao: "Tratou como multiplicação direta, esquecendo de inverter o segundo termo.", peso: 3 },
            { valor: "6/4", tipo: "erro", categoria: "procedimento", erro: "divisao_omite_simplificacao_resultado", descricao: "Aplicou a inversão corretamente, mas não simplificou a fração resultante.", peso: 1 },
            { valor: "1/2", tipo: "erro", categoria: "estrategia", erro: "divisao_inversao_caotica", descricao: "Tentou inverter termos mas perdeu a lógica do algoritmo de divisão.", peso: 2 }
        ],
        passo: "Repete a primeira (3/4) e multiplica pelo inverso da segunda (2/1). Fica 6/4, que simplificado é 3/2.",
        dica: "Regra da Ginástica: A segunda fração 'planta uma bananeira' (inverte) e a conta vira de vezes!"
    },
    {
        id: "B2T3Q14", bloco: 2, aula: 7, tipo: "investigacao",
        dificuldade: 3, tipoPedagogico: "investigacao",
        bncc: "EF07MA04", bncc_desc: "Multiplicação de Frações Próprias",
        display: "Investigação: Se multiplicarmos uma fração menor que 1 (ex: 1/2) por outra menor que 1, o resultado será:",
        res: "Menor que as frações originais",
        alternativas: [
            { valor: "Menor que as frações originais", tipo: "acerto" },
            { valor: "Maior que as frações originais", tipo: "erro", categoria: "conceito", erro: "multiplicacao_pressupoe_aumento_absoluto", descricao: "Presumiu que 'vezes' sempre aumenta o valor, ignorando o comportamento das frações próprias.", peso: 3 },
            { valor: "Igual a uma das frações", tipo: "erro", categoria: "estrategia", erro: "multiplicacao_confunde_elemento_neutro", descricao: "Acreditou que a operação não alteraria a magnitude.", peso: 1 },
            { valor: "Sempre um número inteiro", tipo: "erro", categoria: "atencao", erro: "multiplicacao_expectativa_inteira", descricao: "Esperou que o produto de frações gerasse um número sem vírgula.", peso: 2 }
        ],
        passo: "Exemplo: 1/2 × 1/2 = 1/4. Note que 1/4 é menor que 1/2. Multiplicar por algo menor que 1 'encolhe' o número.",
        dica: "Pense: você quer a 'metade da metade'. Isso vai ser um pedaço maior ou menor do que você já tinha?"
    },

    // ── AULA 8 E 9: RACIONAIS E DECIMAIS ─────────────────────────────────

    {
        id: "B2T3Q15", bloco: 2, aula: 8, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Fração para Decimal",
        display: "Como escrevemos a fração 1/4 na forma decimal?",
        res: "0,25",
        alternativas: [
            { valor: "0,25", tipo: "acerto" },
            { valor: "0,14", tipo: "erro", categoria: "conceito", erro: "conversao_justapoe_numeros_virgula", descricao: "Uniu graficamente o numerador e denominador após a vírgula, sem dividir.", peso: 3 },
            { valor: "0,4", tipo: "erro", categoria: "procedimento", erro: "conversao_usa_denominador_como_decimal", descricao: "Usou apenas o denominador como casa decimal.", peso: 2 },
            { valor: "1,4", tipo: "erro", categoria: "atencao", erro: "conversao_justapoe_inteiro_decimal", descricao: "Montou um número misto gráfico sem fundamentação matemática.", peso: 2 }
        ],
        passo: "Fração é divisão: 1 ÷ 4 = 0,25. Pense em 1 Real dividido para 4 pessoas: cada uma ganha 0,25.",
        dica: "Divida o número de cima pelo de baixo no rascunho para achar o decimal."
    },
    {
        id: "B2T3Q16", bloco: 2, aula: 8, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Decimal para Fração",
        display: "O número 0,35 na forma de fração simplificada é:",
        res: "7/20",
        alternativas: [
            { valor: "7/20", tipo: "acerto" },
            { valor: "35/100", tipo: "erro", categoria: "procedimento", erro: "conversao_omite_simplificacao_decimal", descricao: "Converteu corretamente para base 100, mas não simplificou.", peso: 1 },
            { valor: "35/10", tipo: "erro", categoria: "conceito", erro: "conversao_erro_ordem_grandeza_decimos", descricao: "Usou base 10 para um número com duas casas decimais (centésimos).", peso: 3 },
            { valor: "7/10", tipo: "erro", categoria: "calculo", erro: "conversao_simplifica_base_errada", descricao: "Simplificou o numerador por 5, mas errou a base de origem.", peso: 2 }
        ],
        passo: "0,35 tem duas casas → 35/100. Simplificando por 5 (MDC): 35÷5=7 e 100÷5=20. Resultado: 7/20.",
        dica: "Duas casas depois da vírgula? Coloque sobre o 100 e depois simplifique na tabuada do 5."
    },
    {
        id: "B2T4Q01", bloco: 2, aula: 9, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Adição de Decimais",
        display: "Calcule a soma: 3,7 + 2,45 = ?",
        res: "6,15",
        alternativas: [
            { valor: "6,15", tipo: "acerto" },
            { valor: "5,75", tipo: "erro", categoria: "procedimento", erro: "decimal_soma_desalinha_virgula", descricao: "Alinhou os números pela direita (como inteiros), ignorando a posição das vírgulas.", peso: 3 },
            { valor: "6,05", tipo: "erro", categoria: "calculo", erro: "decimal_soma_falha_reagrupamento", descricao: "Alinhou corretamente, mas falhou no transporte (vai um) nos décimos.", peso: 2 },
            { valor: "6,1", tipo: "erro", categoria: "atencao", erro: "decimal_omite_casa_centesimal", descricao: "Ignorou o dígito da casa centesimal do segundo fator durante a soma.", peso: 1 }
        ],
        passo: "Regra de ouro: vírgula embaixo de vírgula! Complete com zero: 3,70 + 2,45. Somando, temos 6,15.",
        dica: "Para não errar, complete o 3,7 com um zero (3,70) para ele ficar com o mesmo tamanho do 2,45!"
    },
    {
        id: "B2T4Q03", bloco: 2, aula: 9, tipo: "aritmetica",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Multiplicação de Decimais",
        display: "Qual o resultado de 1,5 × 2,4?",
        res: "3,6",
        alternativas: [
            { valor: "3,6", tipo: "acerto" },
            { valor: "36", tipo: "erro", categoria: "conceito", erro: "decimal_multiplicacao_ignora_casas_totais", descricao: "Multiplicou como inteiros e não devolveu as casas decimais ao resultado final.", peso: 3 },
            { valor: "0,36", tipo: "erro", categoria: "procedimento", erro: "decimal_multiplicacao_excesso_casas", descricao: "Aplicou mais casas decimais do que a soma das casas dos fatores exigia.", peso: 2 },
            { valor: "3,06", tipo: "erro", categoria: "calculo", erro: "decimal_multiplicacao_erro_tabuada", descricao: "Erro aritmético básico durante o algoritmo de multiplicação.", peso: 1 }
        ],
        passo: "Multiplique 15 × 24 = 360. Como cada fator tem 1 casa (total 2), recue 2 casas no resultado: 3,60 (ou 3,6).",
        dica: "Faça a conta de vezes normal. No final, conte os 'pulos' da vírgula e devolva eles no resultado!"
    },
    {
        id: "B2T4Q08", bloco: 2, aula: 9, tipo: "investigacao",
        dificuldade: 3, tipoPedagogico: "investigacao",
        bncc: "EF07MA04", bncc_desc: "Decimais — Investigação",
        display: "Investigação: Qual valor é MAIOR, a soma (0,1 + 0,1) ou o produto (0,1 × 0,1)?",
        res: "A soma (0,2 > 0,01)",
        alternativas: [
            { valor: "A soma (0,2 > 0,01)", tipo: "acerto" },
            { valor: "O produto (0,01 > 0,2)", tipo: "erro", categoria: "conceito", erro: "decimal_investigacao_multiplicacao_maior", descricao: "Presumiu que o operador de multiplicação sempre amplia o valor, ignorando o efeito em decimais próprios.", peso: 3 },
            { valor: "São iguais", tipo: "erro", categoria: "estrategia", erro: "decimal_investigacao_neutralidade_falsa", descricao: "Assumiu que o dígito 1 anula diferenças operacionais entre soma e produto.", peso: 2 },
            { valor: "0,11", tipo: "erro", categoria: "calculo", erro: "decimal_soma_justaposta", descricao: "Justapôs os números na soma em vez de realizar a operação posicional.", peso: 2 }
        ],
        passo: "0,1 + 0,1 = 0,2. Mas 0,1 × 0,1 = 0,01. Multiplicar fatias menores que 1 faz o resultado encolher!",
        dica: "Atenção: no mundo dos decimais menores que 1, multiplicar pode ser o mesmo que 'dividir' o seu pedaço!"
    },

    // ── AULA 10: PROPORCIONALIDADE ───────────────────────────────────────

    {
        id: "B2T4Q11", bloco: 2, aula: 10, tipo: "aritmetica",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Proporção — Produto Cruzado",
        display: "As frações 2/3 e 8/12 formam uma proporção válida?",
        res: "Sim (2×12 = 3×8)",
        alternativas: [
            { valor: "Sim (2×12 = 3×8)", tipo: "acerto" },
            { valor: "Não (2×12 ≠ 3×8)", tipo: "erro", categoria: "calculo", erro: "proporcao_erro_multiplicacao_cruzada", descricao: "Errou o cálculo dos produtos cruzados (extremos e meios).", peso: 2 },
            { valor: "Sim, mas só por serem pares", tipo: "erro", categoria: "conceito", erro: "proporcao_justificativa_pseudo_matematica", descricao: "Atribuiu a proporção a uma característica isolada (paridade) e não à razão constante.", peso: 3 },
            { valor: "Não, pois o 12 é maior que o 3", tipo: "erro", categoria: "interpretacao", erro: "proporcao_foco_na_magnitude_isolada", descricao: "Negou a proporção por observar apenas o crescimento dos números de baixo.", peso: 2 }
        ],
        passo: "O produto cruzado deve ser igual: 2 × 12 = 24 e 3 × 8 = 24. Como 24 = 24, elas são proporcionais.",
        dica: "Desenhe um 'X' multiplicando o de cima de uma pelo de baixo da outra. Se der o mesmo valor, é proporção!"
    },
    {
        id: "B2T4Q14", bloco: 2, aula: 10, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Proporcionalidade Inversa",
        display: "Um tanque é cheio por 4 torneiras em 6 horas. Quantas horas levaria se fossem 8 torneiras idênticas?",
        res: "3 horas",
        alternativas: [
            { valor: "3 horas", tipo: "acerto" },
            { valor: "12 horas", tipo: "erro", categoria: "conceito", erro: "regra3_trata_inversa_como_direta", descricao: "Calculou como se dobrar as torneiras dobrasse o tempo necessário (proporção direta).", peso: 3 },
            { valor: "48 horas", tipo: "erro", categoria: "procedimento", erro: "regra3_multiplicacao_sem_sentido", descricao: "Multiplicou os fatores sem estabelecer a relação divisional inversa.", peso: 2 },
            { valor: "2 horas", tipo: "erro", categoria: "calculo", erro: "regra3_divisao_imprecisa", descricao: "Percebeu que o tempo diminuía, mas errou a conta de divisão final.", peso: 2 }
        ],
        passo: "Proporção Inversa: se dobramos as torneiras (vazão), o tempo cai pela metade. 6h ÷ 2 = 3h.",
        dica: "Pense com a ADA: se você ligar MAIS torneiras, a piscina vai encher MAIS RÁPIDO. O tempo tem que diminuir!"
    },
    {
        id: "B2T4Q18", bloco: 2, aula: 10, tipo: "conceito",
        dificuldade: 2, tipoPedagogico: "base",
        bncc: "EF07MA04", bncc_desc: "Tipo de Proporcionalidade",
        display: "Na economia, quando a cotação do dólar SOBE, com os mesmos 100 Reais você compra:",
        res: "Menos dólares (Inversa)",
        alternativas: [
            { valor: "Menos dólares (Inversa)", tipo: "acerto" },
            { valor: "Mais dólares (Direta)", tipo: "erro", categoria: "conceito", erro: "proporcao_confunde_sentido_mercado", descricao: "Assumiu que cotações altas geram maior volume de compra.", peso: 3 },
            { valor: "A mesma quantidade", tipo: "erro", categoria: "estrategia", erro: "proporcao_estatica_ilusoria", descricao: "Ignorou o efeito da taxa de câmbio sobre o poder de compra.", peso: 2 },
            { valor: "Depende da nota usada", tipo: "erro", categoria: "interpretacao", erro: "proporcao_variavel_social_irrelevante", descricao: "Substituiu a lei matemática por uma variável de logística cotidiana.", peso: 1 }
        ],
        passo: "Se o preço (cotação) aumenta, a quantidade que você consegue comprar diminui. Isso é Proporcionalidade Inversa.",
        dica: "É como o preço do pão: se o pão ficar mais caro, com a sua mesma moedinha você leva menos pães para casa."
    },

    // [NOVA] QUESTÃO DE INVESTIGAÇÃO LÓGICA (Combo Alto)
    {
        id: "B2Q99", bloco: 2, aula: 10, tipo: "contexto",
        dificuldade: 3, tipoPedagogico: "investigacao",
        bncc: "EF07MA04", bncc_desc: "Lógica de Proporção Composta",
        display: "Investigação: Se 3 gatos caçam 3 ratos em exatamente 3 minutos. Em quanto tempo 100 gatos caçarão 100 ratos?",
        res: "3 minutos",
        alternativas: [
            { valor: "3 minutos", tipo: "acerto" },
            { valor: "100 minutos", tipo: "erro", categoria: "conceito", erro: "logica_proporcao_linear_falsa", descricao: "Aumentou o tempo linearmente junto com a quantidade de gatos e ratos.", peso: 3 },
            { valor: "1 minuto", tipo: "erro", categoria: "estrategia", erro: "logica_divisao_direta", descricao: "Assumiu que mais gatos fariam o trabalho mais rápido sem analisar que a demanda de ratos subiu igual.", peso: 2 },
            { valor: "300 minutos", tipo: "erro", categoria: "procedimento", erro: "logica_multiplicacao_total", descricao: "Multiplicou todas as grandezas indiscriminadamente.", peso: 2 }
        ],
        passo: "Se 3 gatos caçam 3 ratos em 3 min, significa que cada gato leva 3 minutos para caçar o SEU próprio rato. Logo, 100 gatos caçando seus respectivos 100 ratos ao mesmo tempo também levarão 3 minutos!",
        dica: "Pense na ação individual: quanto tempo UM único gato leva para caçar UM rato? Se todos trabalharem juntos na mesma hora, o tempo não muda!"
    }
];
