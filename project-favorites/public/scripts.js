const ul = document.querySelector('ul') // colocando a lista em uma variavel
const input = document.querySelector('input') // colocando o input em uma variavel
const form = document.querySelector('form') // colocando o form em uma variavel

// Função que carrega o conteúdo da API.
async function load() {
    // fetch está como await para evitar que entre num esquema de promisse e só devolva o conteúdo após a iteração qua acontece em seguida.
    const res = await fetch('http://localhost:3000/').then((data) => data.json());
    // Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
    res.urls.map(({ name, url }) => addElement({ name, url }));
}

load();

// função que recebe objeto desestruturado com duas propriedades
function addElement({ name, url }) {
    const li = document.createElement('li') // criando o elemento html de lista
    const a = document.createElement("a") // criando o elemento html de link
    const trash = document.createElement("span") // criando o elemento html de span

    a.href = url //atribuindo url para o elemento link 
    a.innerHTML = name // valor da propriedade name é atribuido ao conteúdo do elemento de link 
    a.target = "_blank" //para abrir o link em uma nova aba

    //criando elemento span de exclusão
    trash.innerHTML = "x" 

    // atribuindo um evento ao botão passando oproprio "X" como argumento
    trash.onclick = () => removeElement(trash) 
    
    // elemento sendo anexados a estrutura da lista
    ul.append(li) 
    li.append(a)
    li.append(trash)

    // Enviar dados para a API
    saveDataToAPI({ name, url });
}

// remove o elemento pai do objeto passado como argumento
function removeElement(element) {
    if (confirm('Tem certeza que deseja deletar?')) {
        element.parentNode.remove();

        // Extrair URL do elemento pai (link) do elemento removido
        const url = element.parentNode.querySelector('a').href;

        // Enviar solicitação de exclusão para a API
        deleteDataFromAPI(url);
    }
}

// Função para enviar os dados do novo elemento para a API
function saveDataToAPI({ name, url }) {
    //passando valores para url com encodeURIComponent garante que sejam corretamente codificados
    fetch(`http://localhost:3000/?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}`, {
        method: 'POST',//para criação de dados na API
    })
        .then((response) => response.text())//recebe a resposta da solicitação
        .then((message) => console.log(message)) //imprime a mensagem usando console
        .catch((error) => console.error(error)); // recebe objeto de erro
}

// Função para enviar solicitação de exclusão para a API
function deleteDataFromAPI(url) {
    fetch(`http://localhost:3000/?del=true&url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
    })
        .then((response) => response.text())
        .then((message) => console.log(message))
        .catch((error) => console.error(error));
}

form.addEventListener('submit', (event) => {
    //para evitar comportamento padrão de envio do formulário
    event.preventDefault();

    //colocando valor do input em uma variavel
    let { value } = input;

     //verificando se o campo esta vazio
     if (!value)
     return alert('Preencha o campo!')

    //o campo é dividito em duas partes usando o split colocando as respectivas variaveis de cada parte
    const [name, url] = value.split(',')

    //verifica se a url está ausente
    if (!url)
        return alert('O texto não está formatado da maneira correta.')

        //verificado se começa com http
    if (!/^http/.test(url))
        return alert('Digite a url da maneira correta.')
    
    //chamando a função com os objetos como argumento
    addElement({ name, url })

    //limpando campo de entrada input
    input.value = ''
});
