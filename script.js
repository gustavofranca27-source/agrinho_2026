document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("btn-acessibilidade-toggle");
    const menuAcessibilidade = document.getElementById("menu-acessibilidade");
    const btnAumentarFonte = document.getElementById("btn-aumentar-fonte");
    const btnDiminuirFonte = document.getElementById("btn-diminuir-fonte");
    const btnTema = document.getElementById("btn-tema");
    const btnLerVoz = document.getElementById("btn-ler-voz");
    const btnPararVoz = document.getElementById("btn-parar-voz");
    
    let fontSizeAtual = 100; // percentual base para o body/html
    
    // Abrir/Fechar painel flutuante
    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", !isExpanded);
        menuAcessibilidade.setAttribute("aria-hidden", isExpanded);
        menuAcessibilidade.classList.toggle("active");
    });

    // Controle de tamanho de fontes via multiplicador adaptável
    btnAumentarFonte.addEventListener("click", () => {
        if(fontSizeAtual < 140) {
            fontSizeAtual += 10;
            document.documentElement.style.fontSize = fontSizeAtual + "%";
        }
    });

    btnDiminuirFonte.addEventListener("click", () => {
        if(fontSizeAtual > 80) {
            fontSizeAtual -= 10;
            document.documentElement.style.fontSize = fontSizeAtual + "%";
        }
    });

    // Alternador de Modo Claro / Escuro
    btnTema.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        btnTema.textContent = isDark ? "Alternar Modo Claro" : "Alternar Modo Escuro";
    });
    let sinteseVoz = window.speechSynthesis;
    let atualUtterance = null;

    btnLerVoz.addEventListener("click", () => {
        // Interrompe leitura prévia se houver
        if (sinteseVoz.speaking) {
            sinteseVoz.cancel();
        }

        // Obtém apenas os elementos textuais limpos dentro do escopo do conteúdo principal
        const conteudoPrincipal = document.getElementById("conteudo-principal");
        
        // Coleta textos de parágrafos, cabeçalhos de conteúdo e blockquotes de forma linear
        // Ignora botões, formulários e áreas de navegação da barra de acessibilidade
        const elementosTexto = conteudoPrincipal.querySelectorAll("p, h2, h3, li, strong, em");
        let textoParaLer = "";
        
        elementosTexto.forEach(el => {
            // Verifica se o elemento não pertence à área de formulários e botões interativos
            if(!el.closest("form") && !el.closest("button")) {
                textoParaLer += el.textContent + ". ";
            }
        });

        if (textoParaLer.trim() !== "") {
            atualUtterance = new SpeechSynthesisUtterance(textoParaLer);
            atualUtterance.lang = "pt-BR";
            atualUtterance.rate = 1.0; // velocidade natural

            atualUtterance.onstart = () => {
                btnLerVoz.disabled = true;
                btnPararVoz.disabled = false;
                btnLerVoz.textContent = "Lendo... 🔊";
            };

            atualUtterance.onend = () => {
                btnLerVoz.disabled = false;
                btnPararVoz.disabled = true;
                btnLerVoz.textContent = "Ouvir Texto 🔊";
            };

            atualUtterance.onerror = () => {
                btnLerVoz.disabled = false;
                btnPararVoz.disabled = true;
                btnLerVoz.textContent = "Ouvir Texto 🔊";
            };

            sinteseVoz.speak(atualUtterance);
        }
    });

    btnPararVoz.addEventListener("click", () => {
        if (sinteseVoz.speaking) {
            sinteseVoz.cancel();
            btnLerVoz.disabled = false;
            btnPararVoz.disabled = true;
            btnLerVoz.textContent = "Ouvir Texto 🔊";
        }
    });

    // Cancela a voz se o usuário fechar ou mudar de página repentinamente
    window.addEventListener("beforeunload", () => {
        if (sinteseVoz.speaking) {
            sinteseVoz.cancel();
        }
    });
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const isExpanded = header.getAttribute("aria-expanded") === "true";
            const panel = header.nextElementSibling;
            
            // Fecha todos os outros antes de abrir o atual (comportamento exclusivo moderno)
            accordionHeaders.forEach(otherHeader => {
                if(otherHeader !== header) {
                    otherHeader.setAttribute("aria-expanded", "false");
                    otherHeader.nextElementSibling.style.maxHeight = null;
                    otherHeader.nextElementSibling.setAttribute("aria-hidden", "true");
                }
            });

            // Alterna o estado do item clicado
            header.setAttribute("aria-expanded", !isExpanded);
            panel.setAttribute("aria-hidden", isExpanded);

            if (!isExpanded) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
    const formSeminario = document.getElementById("form-seminario");
    const formFeedback = document.getElementById("form-feedback");

    formSeminario.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simulação de captura de dados limpos do formulário
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        
        // Feedback visual moderno e acessível imediato
        formFeedback.className = "form-feedback success";
        formFeedback.textContent = `Inscrição realizada com sucesso! Parabéns, ${nome}. Enviamos o link de acesso exclusivo para o e-mail: ${email}.`;
        
        // Reseta o formulário mantendo as diretrizes de usabilidade limpa
        formSeminario.reset();
        
        // Remove feedback após tempo determinado
        setTimeout(() => {
            formFeedback.textContent = "";
            formFeedback.className = "form-feedback";
        }, 8000);
    });
    const formComentario = document.getElementById("form-comentario");
    const txtComentario = document.getElementById("txt-comentario");
    const listaComentarios = document.getElementById("comentarios-lista");

    formComentario.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const texto = txtComentario.value.trim();
        if(texto === "") return;

        // Criação de elemento de comentário estruturado com tags semânticas e acessíveis
        const cardComentario = document.createElement("div");
        cardComentario.className = "comentario-item";
        
        const metaComentario = document.createElement("div");
        metaComentario.className = "comentario-meta";
        metaComentario.textContent = `Leitor Anônimo • Há poucos segundos`;
        
        const corpoComentario = document.createElement("p");
        corpoComentario.textContent = texto;
        corpoComentario.style.marginBottom = "0";
        corpoComentario.style.marginTop = "4px";

        cardComentario.appendChild(metaComentario);
        cardComentario.appendChild(corpoComentario);
        
        // Insere o novo comentário no topo da lista dinâmica
        listaComentarios.insertBefore(cardComentario, listaComentarios.firstChild);
        
        // Reseta campo de texto de forma limpa
        txtComentario.value = "";
    });

});