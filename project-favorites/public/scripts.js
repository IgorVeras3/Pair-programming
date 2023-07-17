const ul = document.querySelector('ul');
const input = document.querySelector('input');
const form = document.querySelector('form');
let editingItem = null; // Variável para armazenar o item em edição

// Função que carrega o conteúdo da API.
async function load() {
  const res = await fetch('http://localhost:3000/').then((data) => data.json());
  res.urls.map(({ name, url }) => addElement({ name, url }));
}
load();

//recebe um objeto contendo o nome e a URL e cria os elementos HTML dinamicamente.
function addElement({ name, url }) {
  const li = document.createElement('li');
  const ul = document.getElementById("lista");
  const a = document.createElement('a');
  const trash = document.createElement('span');
  const edit = document.createElement('span'); // Elemento de edição
  const icon_nome = document.createElement('div');
  const botoes = document.createElement('div'); 
  const icon = document.createElement('a')

  botoes.className = 'botoes';
  edit.className = 'editar';
    icon_nome.className = 'icon_nome';
//   li.classList.add('elemento-li');
//   a.classList.add('elemento-a');
//   trash.classList.add('elemento-trash');
//   edit.classList.add('elemento-edit');

  a.href = url;
  a.innerHTML = name;
  a.target = '_blank';
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 31.95"><defs><style>.cls-1{fill:#009fe3;}.cls-2{fill:#1d71b8;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M25.46,18.14c-.26-1.56-.51-3-.71-4.44a1.14,1.14,0,0,1,.27-.81c.57-.64,1.21-1.21,1.8-1.84a4,4,0,0,0-.11-5.78,4,4,0,0,0-5.85-.1c-2.25,2.21-4.47,4.46-6.71,6.69A4.2,4.2,0,0,0,15.31,19l.58.26c-.57.53-1.07,1-1.54,1.44s-.92,1-1.36,1.46A8,8,0,0,1,10.8,9.69c2.46-2.63,5-5.17,7.65-7.64a7.86,7.86,0,0,1,10.38-.18C32.09,4.59,33,9,30.72,12.34A60.59,60.59,0,0,1,25.46,18.14Z"/><path class="cls-2" d="M16.19,12.8,19.09,10a7.91,7.91,0,0,1,3.34,10.39,8.47,8.47,0,0,1-1.58,2.22c-2.29,2.38-4.64,4.71-7,7a8,8,0,0,1-11.43-.15,7.93,7.93,0,0,1-.06-11.36C3.75,16.68,5.15,15.3,6.49,14c.26,1.49.53,3,.75,4.46a1,1,0,0,1-.31.66c-.61.65-1.26,1.24-1.87,1.89a4,4,0,0,0,.18,5.72,3.94,3.94,0,0,0,5.71.22q3.66-3.54,7.2-7.2A4.1,4.1,0,0,0,17,13.18C16.73,13.05,16.49,13,16.19,12.8Z"/></g></g></svg>';
  

  trash.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>';
  trash.onclick = () => removeElement(li, { name, url });

  edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>'; // Texto do elemento de edição
  edit.onclick = () => editElement({ name, url }); // Chamar a função de edição

  ul.append(li);
  icon_nome.append(icon, a);
  li.append(icon_nome, botoes);
  
  botoes.append(edit); // Adicionar o elemento de edição ao item
  botoes.append(trash);
}

// recebe um objeto contendo o nome e a URL 
async function addElementAndSendToApi({ name, url }) {
    //adicionar os elementos no frontend
    addElement({ name, url });
    // faz uma requisição para a API para enviar os dados inseridos.
    const response = await fetch(`http://localhost:3000/?name=${name}&url=${url}`);
    if (!response.ok) {
        console.error(`Erro ao enviar os dados para a API: ${response.statusText}`);
    }
}

//chamada quando o usuário clica no botão de excluir
async function removeElement(element, { name, url }) {
    if (confirm('Tem certeza que deseja deletar?')) {
        // remove o elemento HTML correspondente do frontend
        element.remove();

        //faz uma requisição para a API para remover os dados correspondentes.
        const response = await fetch(`http://localhost:3000/?name=${name}&url=${url}&del=1`);
        if (!response.ok) {
        console.error(`Erro ao enviar os dados para a API: ${response.statusText}`);
        }
    }
}

//chamada quando o usuário clica no botão de editar.
function editElement({ name, url }) {

    // recebe o nome e a URL do item a ser editado e preenche o campo de entrada
    input.value = `${name},${url}`;
    //variável editingItem é atualizada com os dados do item em edição
    editingItem = { name, url };
    //Os eventos de submit são removidos e adicionados para lidar com a edição e a adição de elementos.
    form.removeEventListener('submit', handleAddSubmit);
    form.addEventListener('submit', handleEditSubmit);
}
//é chamada quando o formulário é submetido durante a edição de um item.
async function handleEditSubmit(event) {

    //impede o comportamento padrão do formulário
    event.preventDefault();
    const { value } = input;

    if (!value) {
        return alert('Preencha o campo!');
    }
    const [name, url] = value.split(',');
    if (!url) {
        return alert('O texto não está formatado da maneira correta.');
    }
    //obtém o valor do campo de entrada, valida-o e extrai o nome e a URL.
    if (!/^http/.test(url)) {
        return alert('Digite a URL da maneira correta.');
    }
    // Atualizar o item na lista
    updateElement(editingItem, { name, url });
    // Enviar os dados atualizados para a API
    const response = await fetch(`http://localhost:3000/?name=${name}&url=${url}`);
    if (!response.ok) {
        console.error(`Erro ao enviar os dados para a API: ${response.statusText}`);
    }
    // Limpar o campo de entrada e redefinir a variável de edição
    input.value = '';
    editingItem = null;
    // Voltar a utilizar a função handleAddSubmit para futuros envios do formulário
    form.removeEventListener('submit', handleEditSubmit);
    form.addEventListener('submit', handleAddSubmit);
}

// recebe o elemento antigo e o novo elemento para atualizar o item na lista do frontend. 
function updateElement(oldElement, newElement) {
    const li = document.querySelector('.elemento-li');
    const a = document.querySelector('.elemento-a');
    const trash = document.querySelector('.elemento-trash');
    const edit = document.querySelector('.elemento-edit');

    //Se os elementos são encontrados, atualiza os atributos e conteúdos com base nos dados do novo elemento.
    if (a && trash && edit) {
      const { name, url } = newElement;
      a.href = url;
      a.innerHTML = name;
      edit.onclick = () => editElement({ name, url });
    } else {
      console.error('Erro ao atualizar o elemento na lista.');
    }
}

//é chamada quando o formulário é submetido para adicionar um novo item.
function handleAddSubmit(event) {

    //Ela impede o comportamento padrão do formulário, obtém o valor do campo de entrada
    event.preventDefault();
    const { value } = input;
    if (!value) {
        return alert('Preencha o campo!');
    }
    const [name, url] = value.split(',');
    if (!url) {
        return alert('O texto não está formatado da maneira correta.');
    }
    //valida-o e extrai o nome e a URL
    if (!/^http/.test(url)) {
        return alert('Digite a URL da maneira correta.');
    }
    //adicionar o novo item no frontend e fazer uma requisição para a API para enviar os dados.
    addElementAndSendToApi({ name, url });
    input.value = '';
}
//O evento de submit é adicionado ao formulário para chamar a função handleAddSubmit() quando o formulário for submetido.
form.addEventListener('submit', handleAddSubmit);
