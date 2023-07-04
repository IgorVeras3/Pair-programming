const http = require('http')
const fs = require('fs')
const path = require('path')

http.createServer((req,res)=>{
    const file = (req.url === '/') ? 'index.html' : req.url
    const pathFile = path.join(__dirname,'public',file)
    //pega extenção do caminho
    const extname = path.extname(pathFile)
    //cria vetor com finais q a gente aceita
    const allowedFileTypes = ['.html', '.css', '.js']
    //comprou com quem vem na requisição
    const allowed = allowedFileTypes.find(item=> item == extname)
    //se não for igual aos itens, não quebra o códogo pois não cai na leitura de arquivos
    if (!allowed) return

    fs.readFile(pathFile, 
        (err,content)=>{
            if(err) throw err

            res.end(content)
        })
    

}).listen(5000,()=>{
   console.log('servidor rodando.......')
})  
