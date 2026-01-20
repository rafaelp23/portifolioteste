/* ================================================= */
/* 1. IMPORTAÇÃO DIRETA (SEM TAG NO HTML)            */
/* ================================================= */
// Importa o Supabase direto da nuvem para o JS
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Seus dados
const SUPABASE_URL = 'https://zavidiffwkvhttjfnlmq.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_h2uqRttVKq87Ba4w6XImHw_p5KhNhJ1'; 

// Cria a conexão
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
/* ================================================= */
/* 2. FUNÇÕES DE MODAL (COM FIX PARA O HTML)         */
/* ================================================= */

// Função para fechar tudo
function fecharTodosModais() {
  document.getElementById("modalSobre").style.display = "none";
  document.getElementById("modalTeste").style.display = "none";
  document.getElementById("modalContratar").style.display = "none";
}

// Para o HTML enxergar as funções, usamos "window.nomeDaFuncao"
window.abrirModal = function() {
  fecharTodosModais();
  document.getElementById("modalSobre").style.display = "flex";
}
window.fecharModal = function() {
  document.getElementById("modalSobre").style.display = "none";
}

window.abrirTeste = function() {
  fecharTodosModais();
  document.getElementById("modalTeste").style.display = "flex";
}
window.fecharTeste = function() {
  document.getElementById("modalTeste").style.display = "none";
}

window.abrirContratar = function() {
  fecharTodosModais();
  document.getElementById("modalContratar").style.display = "flex";
}
window.fecharContratar = function() {
  document.getElementById("modalContratar").style.display = "none";
}

// Fechar ao clicar fora (Este funciona normal)
window.onclick = function(event) {
  const modalSobre = document.getElementById("modalSobre");
  const modalTeste = document.getElementById("modalTeste");
  const modalContratar = document.getElementById("modalContratar");

  if (event.target == modalSobre) modalSobre.style.display = "none";
  if (event.target == modalTeste) modalTeste.style.display = "none";
  if (event.target == modalContratar) modalContratar.style.display = "none";
}




/* ================================================= */
/* 3. ENVIO DO FORMULÁRIO (SUPABASE + EMAILJS)       */
/* ================================================= */

const formContratar = document.getElementById('form-contratar');

// Função extra para validar e-mail (Formato)
function emailValido(email) {
  // Regex simples para garantir que tem @, texto antes e depois, e termina com .com ou .br, etc.
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

if (formContratar) {
  formContratar.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;
    const btn = formContratar.querySelector('button');
    
    // 1. VERIFICAÇÃO SIMPLES
    if (!emailValido(email)) {
        alert("Por favor, digite um e-mail válido!");
        return;
    }

    // Feedback visual
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    try {
        // 2. ENVIA PARA O SUPABASE (Seu Banco de Dados)
        // Ajuste de hora (GMT-3) que fizemos antes
        const agora = new Date();
        agora.setHours(agora.getHours() - 3);

        const { data, error } = await supabase
          .from('contatos') 
          .insert([
            { 
                nome: nome, 
                email: email, 
                mensagem: mensagem,
                created_at: agora 
            }
          ]);

        if (error) throw error; // Se der erro no banco, para tudo.

        // 3. ENVIA O E-MAIL AUTOMÁTICO (O Robozinho)
       
        const serviceID = "service_u5entdh";
        const templateID = "template_xvxwgvh";

        const emailParams = {
            nome: nome,
            email: email,
            mensagem: mensagem
        };

        // Envia o e-mail sem travar o usuário (assíncrono)
        await emailjs.send(serviceID, templateID, emailParams);

        // Sucesso Total
        alert('Tudo certo! Recebi sua mensagem e te enviei um e-mail de confirmação. 🚀');
        formContratar.reset(); 
        window.fecharContratar();

    } catch (erro) {
        console.error('Erro:', erro);
        alert('Ops! Algo deu errado: ' + (erro.message || erro.text));
    } finally {
        // Restaura o botão
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
  });
}


