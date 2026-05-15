// js/engine/question-validator.js
import { CATEGORIAS, PESOS } from './constants.js';

export function validarQuestao(q) {
    const erros = [];
    if (!q.id) erros.push("ID ausente");
    if (!q.display) erros.push("Display (enunciado) ausente");
    if (!q.res) erros.push("Resposta correta (res) não definida");
    if (!q.passo) erros.push("Passo-a-passo para ADA ausente");

    // Validação de Alternativas
    if (!q.alternativas || q.alternativas.length === 0) {
        erros.push("A questão não possui alternativas.");
    } else {
        const corretas = q.alternativas.filter(a => a.tipo === 'acerto');
        if (corretas.length !== 1) erros.push(`Quantidade de respostas corretas inválida: ${corretas.length}`);

        q.alternativas.forEach((alt, index) => {
            if (alt.tipo === 'erro') {
                if (!Object.values(CATEGORIAS).includes(alt.categoria)) 
                    erros.push(`Alt[${index}]: Categoria inválida (${alt.categoria})`);
               // if (!alt.erro) 
                 //   erros.push(`Alt[${index}]: Slug de erro ausente`);
                if (alt.peso && !Object.values(PESOS).includes(alt.peso))
                    erros.push(`Alt[${index}]: Peso inválido (${alt.peso})`);
            }
        });
    }

    if (erros.length > 0) {
        console.error(`[VALIDADOR] Questão ${q.id || 'SEM ID'} inválida:`, erros);
        return false;
    }
    return true;
}
