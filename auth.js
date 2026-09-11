import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const config = window.SUPABASE_CONFIG;
const hasConfig = config?.url && config?.anonKey && !config.url.includes('seu-projeto') && !config.anonKey.includes('sua-chave');
const supabase = hasConfig ? createClient(config.url, config.anonKey) : null;

const showFeedback = (element, message, type = 'error') => {
    element.textContent = message;
    element.className = `feedback ${type}`;
};

const getErrorMessage = (error) => {
    if (error.message?.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (error.message?.includes('User already registered')) return 'Este e-mail já possui uma conta.';
    return error.message || 'Não foi possível concluir a ação.';
};

const requireConfig = (feedback) => {
    if (hasConfig) return true;
    showFeedback(feedback, 'Configure a URL e a chave anon em config.js para conectar ao Supabase.');
    return false;
};

const loginForm = document.querySelector('#login-form');
if (loginForm) {
    const feedback = document.querySelector('#login-feedback');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const modeButton = document.querySelector('#mode-button');
    const formTitle = document.querySelector('#form-title');
    const formSubtitle = document.querySelector('#form-subtitle');
    const submitLabel = document.querySelector('#submit-label');
    const password = document.querySelector('#password');
    let isSignUp = false;

    modeButton.addEventListener('click', () => {
        isSignUp = !isSignUp;
        formTitle.textContent = isSignUp ? 'Crie seu acesso.' : 'Entre no seu espaço.';
        formSubtitle.textContent = isSignUp ? 'Comece a construir uma rotina mais consciente.' : 'Um espaço simples para você seguir em movimento.';
        submitLabel.textContent = isSignUp ? 'Criar minha conta' : 'Entrar';
        modeButton.textContent = isSignUp ? 'Já tenho uma conta' : 'Criar uma conta';
        password.setAttribute('autocomplete', isSignUp ? 'new-password' : 'current-password');
        showFeedback(feedback, '');
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!requireConfig(feedback)) return;

        const email = document.querySelector('#email').value.trim();
        const passwordValue = password.value;
        submitButton.disabled = true;
        submitLabel.textContent = isSignUp ? 'Criando...' : 'Entrando...';
        showFeedback(feedback, '');

        const result = isSignUp
            ? await supabase.auth.signUp({ email, password: passwordValue })
            : await supabase.auth.signInWithPassword({ email, password: passwordValue });

        submitButton.disabled = false;
        submitLabel.textContent = isSignUp ? 'Criar minha conta' : 'Entrar';

        if (result.error) {
            showFeedback(feedback, getErrorMessage(result.error));
            return;
        }

        if (isSignUp && !result.data.session) {
            showFeedback(feedback, 'Conta criada. Confira seu e-mail para confirmar o acesso.', 'success');
            return;
        }

        window.location.href = 'home.html';
    });

    if (hasConfig) {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) window.location.href = 'home.html';
        });
    }
}

const logoutButton = document.querySelector('#logout-button');
if (logoutButton) {
    const accountEmail = document.querySelector('#account-email');
    const sessionFeedback = document.querySelector('#session-feedback');

    if (!requireConfig(sessionFeedback)) {
        accountEmail.textContent = 'Configure o Supabase para carregar sua conta.';
    } else {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                window.location.href = 'login.html';
                return;
            }
            accountEmail.textContent = data.session.user.email;
        });

        logoutButton.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }
}
