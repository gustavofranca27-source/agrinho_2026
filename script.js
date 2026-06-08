// ==========================================================================
// ACORDEON INTERATIVO (GESTÃO DE CONTEÚDO EXPANSÍVEL)
// ==========================================================================
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const contentId = trigger.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const icon = trigger.querySelector('.accordion-icon');

        // Fechar todos os outros itens para manter o visual limpo
        document.querySelectorAll('.accordion-trigger').forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                const otherContentId = otherTrigger.getAttribute('aria-controls');
                document.getElementById(otherContentId).setAttribute('hidden', '');
                otherTrigger.querySelector('.accordion-icon').textContent = '+';
            }
        });

        // Alternar o estado do item atual
        trigger.setAttribute('aria-expanded', !expanded);
        if (!expanded) {
            content.removeAttribute('hidden');
            icon.textContent = '−';
        } else {
            content.setAttribute('hidden', '');
            icon.textContent = '+';
        }
    });
});

// ==========================================================================
// FORMULÁRIO DE INSCRIÇÃO COM VALIDAÇÃO ROBUSTA
// ==========================================================================
const formSeminario = document.getElementById('form-seminario');
const formSuccess = document.getElementById('form-success');

formSeminario.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');

    // Validação do Nome
    if (nome.value.trim().length < 3) {
        document.getElementById('error-nome').textContent = 'Por favor, insira seu nome completo.';
        isValid = false;
    } else {
        document.getElementById('error-nome').textContent = '';
    }

    // Validação de E-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        document.getElementById('error-email').textContent = 'Insira um e-mail válido.';
        isValid = false;
    } else {
        document.getElementById('error-email').textContent = '';
    }

    // Validação de Cidade
    if (cidade.value.trim() === '') {
        document.getElementById('error-cidade').textContent = 'A cidade é obrigatória.';
        isValid = false;
    } else {
        document.getElementById('error-cidade').textContent = '';
    }

    // Validação de Estado
    if (estado.value.trim().length !== 2) {
        document.getElementById('error-estado').textContent = 'Use a sigla com 2 letras (Ex: SP).';
        isValid = false;
    } else {
        document.getElementById('error-estado').textContent = '';
    }

    if (isValid) {
        formSeminario.reset();
        formSuccess.removeAttribute('hidden');
        setTimeout(() => formSuccess.setAttribute('hidden', ''), 5000);
    }
});

// ==========================================================================
// ÁREA DE INTERAÇÃO (COMENTÁRIOS DO LEITOR)
// ==========================================================================
const formComentario = document.getElementById('form-comentario');
const listaComentarios = document.getElementById('lista-comentarios');

formComentario.addEventListener('submit', (e) => {
    e.preventDefault();
    const txtComentario = document.getElementById('comentario');

    if (txtComentario.value.trim() !== '') {
        const novoComentario = document.createElement('div');
        novoComentario.className = 'comment-item';
        novoComentario.innerHTML = `<strong>Leitor Anônimo:</strong> <p>${escapeHTML(txtComentario.value)}</p>`;
        
        listaComentarios.prepend(novoComentario);
        txtComentario.value = '';
    }
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ==========================================================================
// ACESSIBILIDADE PANEL & SPEECH SYNTHESIS API (LEITURA POR VOZ)
// ==========================================================================
const toggleAcc = document.querySelector('.accessibility-toggle');
const menuAcc = document.querySelector('.accessibility-menu');

toggleAcc.addEventListener('click', () => {
    const isVisible = !menuAcc.hasAttribute('hidden');
    toggleAcc.setAttribute('aria-expanded', isVisible);
    if (isVisible) menuAcc.setAttribute('hidden', '');
    else menuAcc.removeAttribute('hidden');
});

// Controle de tamanho de fonte
let currentFontSize = 100;
document.getElementById('btn-aumentar-fonte').addEventListener('click', () => {
    currentFontSize += 10;
    document.documentElement.style.fontSize = `${currentFontSize}%`;
});
document.getElementById('btn-diminuir-fonte').addEventListener('click', () => {
    if (currentFontSize > 70) {
        currentFontSize -= 10;
        document.documentElement.style.fontSize = `${currentFontSize}%`;
    }
});

// Alternador de Modo Escuro
document.getElementById('btn-modo-escuro').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Leitura de Voz Nativa (Apenas conteúdo principal solicitado)
let speechUtterance = null;
const btnLer = document.getElementById('btn-ler-voz');
const btnParar = document.getElementById('btn-parar-voz');

btnLer.addEventListener('click', () => {
    // Captura apenas o texto dos blocos legíveis principais (ignora menus/botões)
    const blocks = document.querySelectorAll('.readable-content');
    let textToRead = "";
    blocks.forEach(block => {
        textToRead += block.innerText + " ";
    });

    if (textToRead.trim() !== "") {
        window.speechSynthesis.cancel(); // Para qualquer leitura em andamento
        
        speechUtterance = new SpeechSynthesisUtterance(textToRead);
        speechUtterance.lang = 'pt-BR';
        
        speechUtterance.onstart = () => {
            btnLer.disabled = true;
            btnParar.disabled = false;
        };
        
        speechUtterance.onend = () => {
            btnLer.disabled = false;
            btnParar.disabled = true;
        };

        window.speechSynthesis.speak(speechUtterance);
    }
});

btnParar.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    btnLer.disabled = false;
    btnParar.disabled = true;
});