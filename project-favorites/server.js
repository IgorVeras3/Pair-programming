const http = require('http')//importando para criar o servidor
const fs = require('fs') // usado para ler arquivos do sistema
const path = require('path') // serve para manipular caminhos de arquivos

//função que cria o servidor e é chamada sempre que feita a chamada do servidor
http.createServer((req,res)=>{
	//virifica a URL da requisição, se file for diferente da index, vai receber o valor da URL
    const file = (req.url === '/') ? 'index.html' : req.url 

    //criando variavel que concatena o diretorio atual com a pasta public
    const pathFile = path.join(__dirname,'public',file)

    //pega extenção extraida usando o metodo path.extname
    const extname = path.extname(pathFile)

    //cria vetor com finais que o servidor aceita
    const allowedFileTypes = ['.html','.css','.js']

    //verifica se a extensão do arquivo esta presente no vetor
    const allowed = allowedFileTypes.find(item => item == extname)

    //se a variavel for indefinida, significa que o arquivo não é permitido pelo servidor entçao o códo para
    //e não termina a leitura do arquivo
    if(!allowed) return

    //le o conteudo do arquivo especificado pela pathFile
    fs.readFile(pathFile , (err,content)=>{
        //se acontecer algum erro durante a chamada  um erro é lançada
        if(err) throw err
        // retornando objeto de resposta HTTP
        res.end(content)
    })

    
}).listen(5000,()=>{//escutando a porta 5000 para receber requisições
    console.log('Servidor rodando...')
})
