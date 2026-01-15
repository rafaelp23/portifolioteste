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
/* 3. ENVIO DO FORMULÁRIO (LÓGICA DO SUPABASE)       */
/* ================================================= */

const formContratar = document.getElementById('form-contratar');

if (formContratar) {
  formContratar.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;
    const btn = formContratar.querySelector('button');
    
    // Feedback visual
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    // Envia para o Supabase
    const { data, error } = await supabase
      .from('contatos') 
      .insert([
        { nome: nome, email: email, mensagem: mensagem }
      ]);

    if (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar: ' + error.message);
    } else {
      alert('Mensagem enviada com sucesso! 🚀');
      formContratar.reset(); 
      window.fecharContratar(); // Chama a função que criamos no window
    }

    btn.innerHTML = textoOriginal;
    btn.disabled = false;
  });
}


//TESTANDO
 // let estilo = document.body.style.display="flex";



//if (document.getElementById("projects-list")==)