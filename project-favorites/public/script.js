const ul = document.querySelector('ul')
const input = document.querySelector('input')
const form = document.querySelector('form')

/*

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
*/

function addElement(name, url) {
    // const li = document.createElement('li')
    // const a = document.createElement('a')
    // const trash = document.createElement('span')

    // a.href = url
    // a.innerHTML = name
    // a.target = "_blank" 
    // ul.append(li)
    // li.append(a)
    // trash.append()
    
  }


    
    // const newLocal = document.querySelector('.newlink').innerHTML += `
    //         <div class="lista">
    //             <span id="item_lista">
    //                 ${document.querySelector('.newlink input').value}
    //             </span>
    //             <button class="delete">
    //                 <i class="far fa-trash-alt"></i>
    //             </button>
    //         </div>
    //     `;


function removeElement(element) {
    // criem os códigos
}

form.addEventListener('submit', (event) => {
    
    event.preventDefault();

    let { value } = input

    if (!value)
        return alert('Preencha o campo!')

    const [name, url] = value.split(',')

    if (!url)
        return alert('O texto não está formatado da maneira correta.')

    if (!/^http/.test(url))
        return alert('Digite a url da maneira correta.')

    addElement({ name, url })

    input.value = ''

})