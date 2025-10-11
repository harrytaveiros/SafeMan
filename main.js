// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const navMobile = document.getElementById("navMobile")

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  navMobile.classList.toggle("active")
})

// Close mobile menu when clicking on a link
const mobileLinks = navMobile.querySelectorAll(".nav-link")
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Verificar se o link não é o de Login/Cadastro para fechar o menu
    if (link.id !== 'authButtonMobile') {
      menuToggle.classList.remove("active")
      navMobile.classList.remove("active")
    }
  })
})

// Header scroll effect
const header = document.getElementById("header")
let lastScroll = 0

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.boxShadow = "none"
  }

  lastScroll = currentScroll
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = header.offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

/* -------------------------------------------
   Lógica de Autenticação (Simulação)
   ------------------------------------------- */

const authModalOverlay = document.getElementById('authModalOverlay');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authTitle = document.getElementById('authTitle');
const switchToRegisterBtn = document.getElementById('switchToRegister');
const switchText = document.getElementById('switchText');
const authErrorMessage = document.getElementById('authErrorMessage');

// --- CONTA ADMINISTRADOR HARDCODED ---
const ADMIN_EMAIL = 'admin@safeman.com';
const ADMIN_PASSWORD = 'safemanadmin';
// --- FIM ADMIN ---

// Abrir Modal
function openAuthModal() {
    authModalOverlay.style.display = 'flex';
    showLoginForm();
    authErrorMessage.style.display = 'none';
}

// Fechar Modal
closeAuthModalBtn && closeAuthModalBtn.addEventListener('click', () => {
    authModalOverlay.style.display = 'none';
});

// Fechar modal ao clicar fora
authModalOverlay && authModalOverlay.addEventListener('click', (e) => {
    if (e.target === authModalOverlay) {
        authModalOverlay.style.display = 'none';
    }
});

// Alternar entre Login e Cadastro
function showLoginForm() {
    authTitle.textContent = 'Login';
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    switchText.innerHTML = 'Não tem conta? <a href="#" id="switchToRegister">Cadastre-se</a>';
    const registerLink = document.getElementById('switchToRegister');
    registerLink && registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
}

function showRegisterForm() {
    authTitle.textContent = 'Cadastre-se';
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    switchText.innerHTML = 'Já tem conta? <a href="#" id="switchToLogin">Fazer Login</a>';
    const loginLink = document.getElementById('switchToLogin');
    loginLink && loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
}

// Inicializar o switch no primeiro carregamento
switchToRegisterBtn && switchToRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

// FUNÇÕES DE PERSISTÊNCIA (localStorage)
function getUsers() {
    const users = localStorage.getItem('safemanUsers');
    let userList = users ? JSON.parse(users) : [];

    if (!userList.find(u => u.email === ADMIN_EMAIL)) {
        userList.push({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, isAdmin: true });
    }
    return userList;
}

function setUsers(users) {
    const usersToSave = users.filter(u => u.email !== ADMIN_EMAIL);
    localStorage.setItem('safemanUsers', JSON.stringify(usersToSave));
}

function setLoggedInUser(user) {
    localStorage.setItem('safemanLoggedInUser', JSON.stringify(user));
}

function getLoggedInUser() {
    const user = localStorage.getItem('safemanLoggedInUser');
    return user ? JSON.parse(user) : null;
}

function removeLoggedInUser() {
    localStorage.removeItem('safemanLoggedInUser');
}

function displayError(message) {
    authErrorMessage.textContent = message;
    authErrorMessage.style.display = 'block';
}

// SIMULAÇÃO DE CADASTRO
registerForm && registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    authErrorMessage.style.display = 'none';

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
        displayError('Preencha todos os campos.');
        return;
    }

    const users = getUsers();
    if (users.find(user => user.email === email)) {
        displayError('E-mail já cadastrado.');
        return;
    }

    users.push({ name, email, password, isAdmin: false });
    setUsers(users);
    
    alert('Cadastro realizado com sucesso! Faça o login.');
    showLoginForm();
});

// SIMULAÇÃO DE LOGIN
loginForm && loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    authErrorMessage.style.display = 'none';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        displayError('Preencha todos os campos.');
        return;
    }

    let user = null;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        user = { name: 'Admin', email: ADMIN_EMAIL, isAdmin: true };
    } else {
        const normalUsers = getUsers().filter(u => u.email !== ADMIN_EMAIL);
        user = normalUsers.find(u => u.email === email && u.password === password);
    }
    
    if (user) {
        setLoggedInUser(user);
        alert(`Bem-vindo, ${user.name.split(' ')[0]}!`);
        authModalOverlay.style.display = 'none';
        updateAuthButton();
        
        if (typeof setupPage === 'function') {
             const titleParts = document.title.split(' - ');
             if (titleParts.length > 0) {
                 const pageName = titleParts[0].toLowerCase().replace(/\s/g, '-').replace('infância', 'infancia');
                 setupPage(pageName);
             }
        }
    } else {
        displayError('E-mail ou senha incorretos.');
    }
});

// FUNÇÃO PARA ATUALIZAR O BOTÃO DE AUTENTICAÇÃO
function updateAuthButton() {
    const loggedInUser = getLoggedInUser();
    const navDesktop = document.querySelector('.nav-desktop');
    const navMobile = document.getElementById('navMobile');
    
    const existingDesktopBtn = document.getElementById('authButtonDesktop');
    const existingMobileLink = document.getElementById('authButtonMobile');
    
    if (existingDesktopBtn) existingDesktopBtn.remove();
    if (existingMobileLink) existingMobileLink.remove();

    if (loggedInUser) {
        const displayName = loggedInUser.isAdmin ? 'Admin' : loggedInUser.name.split(' ')[0];

        // Desktop
        const logoutDesktopBtn = document.createElement('button');
        logoutDesktopBtn.className = 'btn btn-outline';
        logoutDesktopBtn.id = 'authButtonDesktop';
        logoutDesktopBtn.innerHTML = `Olá, ${displayName} (Sair)`;
        logoutDesktopBtn.addEventListener('click', () => {
            removeLoggedInUser();
            window.location.reload();
        });
        const refElementDesktop = navDesktop && navDesktop.querySelector('.btn-primary');
        refElementDesktop && navDesktop.insertBefore(logoutDesktopBtn, refElementDesktop);

        // Mobile
        const logoutMobileLink = document.createElement('a');
        logoutMobileLink.href = '#';
        logoutMobileLink.className = 'nav-link';
        logoutMobileLink.id = 'authButtonMobile';
        logoutMobileLink.textContent = `Olá, ${displayName} (Sair)`;
        logoutMobileLink.addEventListener('click', (e) => {
            e.preventDefault();
            removeLoggedInUser();
            window.location.reload();
        });
        const refElementMobile = navMobile && navMobile.querySelector('.btn-primary').parentNode;
        refElementMobile && navMobile.insertBefore(logoutMobileLink, refElementMobile);

    } else {
        // Desktop
        const openDesktopBtn = document.createElement('button');
        openDesktopBtn.className = 'btn btn-outline';
        openDesktopBtn.id = 'authButtonDesktop';
        openDesktopBtn.textContent = 'Login / Cadastro';
        openDesktopBtn.addEventListener('click', openAuthModal);
        const refElementDesktop = navDesktop && navDesktop.querySelector('.btn-primary');
        refElementDesktop && navDesktop.insertBefore(openDesktopBtn, refElementDesktop);
        
        // Mobile
        const openMobileLink = document.createElement('a');
        openMobileLink.href = '#';
        openMobileLink.className = 'nav-link';
        openMobileLink.id = 'authButtonMobile';
        openMobileLink.textContent = 'Login / Cadastro';
        openMobileLink.addEventListener('click', (e) => {
            e.preventDefault();
            menuToggle.classList.remove("active");
            navMobile.classList.remove("active");
            openAuthModal();
        });
        const refElementMobile = navMobile && navMobile.querySelector('.btn-primary').parentNode;
        refElementMobile && navMobile.insertBefore(openMobileLink, refElementMobile);
    }
}


/* -------------------------------------------
   Lógica de Comentários (Simulação)
   ------------------------------------------- */
   
// --- LISTA DE PALAVRAS OFENSIVAS (Simulação de Filtro) ---
const OFFENSIVE_WORDS = ['ofensivo', 'xingamento', 'agressivo', 'palavrão', 'spam', 'idiota', 'lixo', 'odeio', 'burro'];

function filterComment(text) {
    const lowerCaseText = text.toLowerCase();
    for (const word of OFFENSIVE_WORDS) {
        const regex = new RegExp('\\b' + word + '\\b', 'g');
        if (regex.test(lowerCaseText)) {
            return false; // Conteúdo bloqueado
        }
    }
    return true; // Conteúdo aceito
}
// --- FIM FILTRO ---


function getComments(pageId) {
    const comments = localStorage.getItem('safemanComments');
    const allComments = comments ? JSON.parse(comments) : {};
    return allComments[pageId] || [];
}

function saveAllComments(allComments) {
    localStorage.setItem('safemanComments', JSON.stringify(allComments));
}

function saveComment(pageId, comment) {
    const comments = localStorage.getItem('safemanComments');
    let allComments = comments ? JSON.parse(comments) : {};

    if (!allComments[pageId]) {
        allComments[pageId] = [];
    }

    allComments[pageId].unshift(comment); // Adiciona no início (mais novo)
    saveAllComments(allComments);
}

function renderComments(pageId) {
    const commentListContainer = document.getElementById('commentList');
    if (!commentListContainer) return;

    commentListContainer.innerHTML = '';
    const comments = getComments(pageId); 
    const loggedInUser = getLoggedInUser();
    const isAdmin = loggedInUser && loggedInUser.isAdmin;

    if (comments.length === 0) {
        commentListContainer.innerHTML = '<p class="comment-text" style="text-align: center; color: var(--color-muted-foreground);">Seja o primeiro a comentar!</p>';
        return;
    }

    comments.forEach((comment, index) => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const commentHeader = document.createElement('div');
        commentHeader.className = 'comment-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'comment-author';
        authorSpan.textContent = `${comment.author} ${comment.author === 'Admin' ? '(Admin)' : ''}`;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.style.display = 'flex';
        actionsDiv.style.alignItems = 'center';
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'comment-date';
        dateSpan.textContent = comment.date;
        
        actionsDiv.appendChild(dateSpan);
        
        if (isAdmin) {
            // FIX DEFINITIVO DO BOTÃO: Usando setAttribute('onclick')
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'btn btn-outline';
            deleteButton.style.cssText = 'padding: 0.25rem 0.5rem; font-size: 0.75rem; color: #ff4d4f; border-color: #ff4d4f; margin-left: 1rem;';
            
            // O uso de setAttribute('onclick') garante a execução em conteúdo injetado.
            deleteButton.setAttribute('onclick', `deleteComment('${pageId}', ${index})`);
            
            actionsDiv.appendChild(deleteButton);
        }
        
        commentHeader.appendChild(authorSpan);
        commentHeader.appendChild(actionsDiv);
        
        const commentText = document.createElement('p');
        commentText.className = 'comment-text';
        commentText.textContent = comment.text;

        commentItem.appendChild(commentHeader);
        commentItem.appendChild(commentText);
        
        commentListContainer.appendChild(commentItem);
    });
}

// --- FUNÇÃO GLOBAL PARA DELETAR COMENTÁRIO (FINAL) ---
window.deleteComment = function(pageId, renderedIndex) {
    if (!confirm('Tem certeza que deseja apagar este comentário?')) return;

    const allComments = JSON.parse(localStorage.getItem('safemanComments'));
    
    if (allComments && allComments[pageId]) {
        const commentsArray = allComments[pageId];
        
        // Remove o comentário no índice recebido.
        commentsArray.splice(renderedIndex, 1); 
        
        saveAllComments(allComments);
        renderComments(pageId); // Re-renderiza a lista
        alert('Comentário excluído com sucesso.');
    }
};
// --- FIM FUNÇÃO GLOBAL ---

function setupCommentForm(pageId) {
    const form = document.getElementById('newCommentForm');
    const textArea = document.getElementById('commentText');
    const formContainer = document.getElementById('commentFormContainer');

    if (!formContainer) return;

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        formContainer.innerHTML = `
            <div class="comment-form" style="text-align: center;">
                <p class="article-text" style="color: var(--color-primary); font-weight: 600; margin-bottom: 1rem;">Faça login para comentar e compartilhar sua experiência.</p>
                <button class="btn btn-outline" onclick="openAuthModal()">Acessar Conta</button>
            </div>
        `;
        return;
    }
    
    // Configura o formulário para submissão
    if (formContainer.querySelector('button.btn-outline')) {
        // Se estava deslogado, injeta o formulário de volta
        formContainer.innerHTML = `
            <form class="comment-form" id="newCommentForm">
                <h3 class="article-subheading" style="margin-top: 0; color: var(--color-primary);">Adicionar Comentário</h3>
                <textarea id="commentText" placeholder="Escreva seu comentário sobre o tema (mínimo 5 caracteres)..." required></textarea>
                <button type="submit" class="btn btn-primary">Enviar Comentário</button>
            </form>
        `;
        const newForm = document.getElementById('newCommentForm');
        const newTextArea = document.getElementById('commentText');
        setupFormSubmission(newForm, newTextArea, pageId, loggedInUser);
    } else {
        // Usa o formulário já existente
        setupFormSubmission(form, textArea, pageId, loggedInUser);
    }
}

function setupFormSubmission(form, textArea, pageId, loggedInUser) {
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();
        const commentText = textArea.value.trim();

        if (commentText.length < 5) {
            alert('Seu comentário deve ter pelo menos 5 caracteres.');
            return;
        }

        // VALIDAÇÃO DE CONTEÚDO
        if (!filterComment(commentText)) {
            alert('Comentário bloqueado. O uso de termos ofensivos não é permitido. Por favor, mantenha o respeito.');
            textArea.value = ''; // Limpa o campo
            return;
        }
        
        const newComment = {
            author: loggedInUser.name.split(' ')[0], 
            text: commentText,
            date: new Date().toLocaleDateString('pt-BR'),
        };

        saveComment(pageId, newComment);
        textArea.value = ''; // Limpa o campo
        renderComments(pageId); // Re-renderiza a lista
    };
}


// A função setupPage é chamada em cada página de conteúdo no HTML
window.setupPage = function(pageId) {
    renderComments(pageId);
    setupCommentForm(pageId);
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', updateAuthButton);