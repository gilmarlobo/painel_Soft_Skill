# SoftSkill

Site estático com duas páginas e autenticação pelo Supabase.

## Configuração

1. Crie um projeto no Supabase.
2. Copie a URL do projeto e a chave pública `anon`.
3. Preencha os valores em `config.js`:

```js
window.SUPABASE_CONFIG = {
  url: 'https://seu-projeto.supabase.co',
  anonKey: 'sua-chave-anon'
};
```

4. Em **Authentication > URL Configuration** no Supabase, adicione a URL usada para abrir o projeto.

## Executar localmente

Como o JavaScript usa módulos ES, abra o projeto por um servidor local. No VS Code, use a extensão **Live Server** e abra `login.html`, ou use qualquer servidor estático na pasta:

```bash
npx serve .
```

As páginas são `login.html` e `home.html`.
