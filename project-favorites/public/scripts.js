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
  const a = document.createElement('a');
  const trash = document.createElement('span');
  const edit = document.createElement('span'); // Elemento de edição
  edit.className = 'editar'

  li.classList.add('elemento-li');
  a.classList.add('elemento-a');
  trash.classList.add('elemento-trash');
  edit.classList.add('elemento-edit');

  a.href = url;
  a.innerHTML = name;
  a.target = '_blank';

  trash.innerHTML = 'Excluir';
  trash.onclick = () => removeElement(li, { name, url });

  edit.innerHTML = 'Editar'; // Texto do elemento de edição
  edit.onclick = () => editElement({ name, url }); // Chamar a função de edição

  ul.append(li);
  li.append(a);
  li.append(edit); // Adicionar o elemento de edição ao item
  li.append(trash);
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
