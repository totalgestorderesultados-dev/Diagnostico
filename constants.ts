import { TravaCategory } from './types';

export const TRAVAS_DATA: TravaCategory[] = [
  {
    id: 'autoconfianca',
    title: 'Trava da Autoconfiança',
    description: 'Relacionada à insegurança, comparação com outros e medo de falhar.',
    questions: [
      { id: 'auto_1', text: 'Você sente insegurança ou dificuldade constante em tomar decisões, mesmo as simples?' },
      { id: 'auto_2', text: 'Com que frequência você se compara com outras pessoas sentindo-se inferior?' },
      { id: 'auto_3', text: 'Você deixa de expressar suas opiniões por medo do julgamento alheio?' },
      { id: 'auto_4', text: 'Você evita novos desafios ou oportunidades por medo de fracassar?' },
      { id: 'auto_5', text: 'Você costuma se criticar severamente e focar mais nos seus defeitos do que qualidades?' },
    ],
  },
  {
    id: 'escassez',
    title: 'Trava da Escassez',
    description: 'Sentimento de que não há recursos suficientes (dinheiro, amor, tempo) e apego excessivo.',
    questions: [
      { id: 'esc_1', text: 'Você sente que nunca há dinheiro, tempo ou oportunidades suficientes para você?' },
      { id: 'esc_2', text: 'Você tem dificuldade em receber elogios, ajuda ou presentes, achando que não merece?' },
      { id: 'esc_3', text: 'Você evita mudanças ou riscos por medo de perder o pouco que já conquistou?' },
      { id: 'esc_4', text: 'Você sente inveja ou incômodo com o sucesso e conquistas de outras pessoas?' },
      { id: 'esc_5', text: 'Você vive preocupado constantemente com a falta de algo no futuro?' },
    ],
  },
  {
    id: 'aprovacao',
    title: 'Trava da Aprovação',
    description: 'Necessidade constante de validação externa e dificuldade em dizer não.',
    questions: [
      { id: 'aprov_1', text: 'Você busca constantemente elogios e reconhecimento para se sentir bem consigo mesmo?' },
      { id: 'aprov_2', text: 'Sua autoestima muda drasticamente dependendo da opinião dos outros?' },
      { id: 'aprov_3', text: 'Você tem dificuldade em dizer "não" por medo de desagradar?' },
      { id: 'aprov_4', text: 'Você deixa de fazer o que quer por medo de ser criticado ou rejeitado?' },
      { id: 'aprov_5', text: 'Você fica imaginando o que as pessoas estão pensando sobre você com frequência?' },
    ],
  },
  {
    id: 'paterna',
    title: 'Trava Paterna',
    description: 'Questões não resolvidas com a figura paterna, afetando segurança e relacionamentos.',
    questions: [
      { id: 'pat_1', text: 'Você sente ansiedade ou desconforto ao pensar na sua relação com seu pai?' },
      { id: 'pat_2', text: 'Você sente que carrega um vazio emocional ou sensação de rejeição paterna?' },
      { id: 'pat_3', text: 'Você tem dificuldade em confiar em figuras de autoridade ou parceiros?' },
      { id: 'pat_4', text: 'Você sente que precisa provar seu valor o tempo todo para ser amado?' },
      { id: 'pat_5', text: 'Você tende a se envolver em relacionamentos complicados ou destrutivos ("dedo podre")?' },
    ],
  },
  {
    id: 'competencia',
    title: 'Trava da Competência',
    description: 'Medo de não ser capaz de aprender, "não sou bom o suficiente".',
    questions: [
      { id: 'comp_1', text: 'Você sente desânimo ou falta de motivação para aprender coisas novas?' },
      { id: 'comp_2', text: 'Você acredita que "não é inteligente o suficiente" para certas atividades?' },
      { id: 'comp_3', text: 'Você procrastina estudos ou cursos por medo de não entender o conteúdo?' },
      { id: 'comp_4', text: 'Você tem dificuldade de concentração e foco ao tentar estudar?' },
      { id: 'comp_5', text: 'Você resiste a novas tecnologias ou métodos por preferir o que já sabe?' },
    ],
  },
  {
    id: 'vitima',
    title: 'Trava da Vítima',
    description: 'Passividade e tendência a culpar fatores externos ou outros pelos problemas.',
    questions: [
      { id: 'vit_1', text: 'Você costuma culpar os outros ou as circunstâncias pelos seus insucessos?' },
      { id: 'vit_2', text: 'Você guarda ressentimentos e mágoas, sentindo que a vida é injusta com você?' },
      { id: 'vit_3', text: 'Você espera que os outros resolvam seus problemas ou tomem a iniciativa?' },
      { id: 'vit_4', text: 'Você tem dificuldade em expressar suas necessidades e depois se sente frustrado?' },
      { id: 'vit_5', text: 'Você usa frases como "por que isso sempre acontece comigo"?' },
    ],
  },
  {
    id: 'perfeicao',
    title: 'Trava da Perfeição',
    description: 'Paralisia por análise, nunca estar satisfeito, medo extremo de errar.',
    questions: [
      { id: 'perf_1', text: 'Você nunca está satisfeito com seus resultados, achando que poderiam ser melhores?' },
      { id: 'perf_2', text: 'Você deixa de concluir ou entregar tarefas por achar que ainda não estão perfeitas?' },
      { id: 'perf_3', text: 'Você tem dificuldade em delegar tarefas porque "ninguém fará tão bem quanto você"?' },
      { id: 'perf_4', text: 'Você se pune severamente quando comete um pequeno erro?' },
      { id: 'perf_5', text: 'Você acredita que só terá valor se fizer tudo impecavelmente?' },
    ],
  },
  {
    id: 'servidor',
    title: 'Trava do Servidor',
    description: 'Viver para resolver os problemas dos outros, esquecendo de si mesmo.',
    questions: [
      { id: 'serv_1', text: 'Você se sente exausto física e mentalmente por cuidar demais da vida dos outros?' },
      { id: 'serv_2', text: 'Você prioriza as necessidades de todos à sua volta e ignora as suas?' },
      { id: 'serv_3', text: 'Você sente culpa se não estiver ajudando ou sendo útil para alguém?' },
      { id: 'serv_4', text: 'Você busca ativamente problemas dos outros para resolver?' },
      { id: 'serv_5', text: 'Você tem medo de deixar de ser "necessário" na vida das pessoas?' },
    ],
  },
  {
    id: 'procrastinacao',
    title: 'Trava da Procrastinação',
    description: 'Adiar constantemente, culpa e busca pelo "momento ideal".',
    questions: [
      { id: 'proc_1', text: 'Você deixa tarefas importantes para a última hora com frequência?' },
      { id: 'proc_2', text: 'Você sente culpa e ansiedade enquanto não está fazendo o que deveria?' },
      { id: 'proc_3', text: 'Você se distrai facilmente com coisas triviais para fugir das obrigações?' },
      { id: 'proc_4', text: 'Você sempre espera o "humor certo" ou a "inspiração" para começar?' },
      { id: 'proc_5', text: 'Você acredita que trabalha melhor sob a pressão do prazo final?' },
    ],
  },
  {
    id: 'ambiente',
    title: 'Trava do Ambiente',
    description: ' Influência negativa do meio, pessoas tóxicas e zona de conforto ruim.',
    questions: [
      { id: 'amb_1', text: 'Você sente que o ambiente onde vive/trabalha drena sua energia?' },
      { id: 'amb_2', text: 'Você convive com pessoas negativas que desencorajam seus sonhos?' },
      { id: 'amb_3', text: 'Você se sente "preso" ao seu ambiente atual mas tem medo de sair?' },
      { id: 'amb_4', text: 'Você acredita que seu insucesso é culpa exclusiva do lugar onde está?' },
      { id: 'amb_5', text: 'Você mantém relações tóxicas por medo da solidão ou do desconhecido?' },
    ],
  },
];