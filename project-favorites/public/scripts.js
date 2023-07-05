const ul = document.querySelector('ul') // colocando a lista em uma variavel
const input = document.querySelector('input') // colocando o input em uma variavel
const form = document.querySelector('form') // colocando o form em uma variavel



// Não se preocupem com esse pedaço de código comentado! Vamos descomentá-lo quando tivermos acabado de construir a API.

// Função que carrega o conteúdo da API.
async function load() {
    // fetch está como await para evitar que entre num esquema de promisse e só devolva o conteúdo após a iteração qua acontece em seguida.
    const res = await fetch('http://localhost:3000/')
        .then(data => data.json())
    // Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
    res.urls.map(({name, url}) => addElement({name, url}))
}

load()

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
    
}
// remove o elemento pai do objeto passado como argumento
function removeElement(element) {
    //caixa de dialogo para confirmação
    if (confirm('Tem certeza que deseja deletar?'))
        element.parentNode.remove()
}

//evento de envio do formulário que é capturado pelo metodo
form.addEventListener('submit', (event) => {
    //para evitar comportamento padrão de envio do formulário
    event.preventDefault();

    //colocando valor do input em uma variavel
    let { value } = input

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

})