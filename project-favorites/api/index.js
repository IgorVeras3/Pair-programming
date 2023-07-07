//O módulo url é usado para fazer o parsing da URL da requisição. 
//O módulo fs é usado para ler e escrever em arquivos. O módulo path é usado para manipular caminhos de arquivos.
const http = require('http');
const URL = require('url');
const fs = require('fs');
const path = require('path');

//Aqui, estamos criando um servidor HTTP usando o método createServer do módulo http. 
http.createServer((req, res) => {
  //Estamos passando uma função callback que será executada cada vez que uma requisição for feita ao servidor. 
  const data = require('./urls.json');
  const { name, url, del } = URL.parse(req.url, true).query;
  //Estamos também carregando os dados de um arquivo chamado urls.json usando require e obtendo os parâmetros da URL da requisição, como name, url e del, usando URL.parse.


  //Aqui temos uma função chamada writeFile, que recebe um callback como parâmetro.  
  function writeFile(cb) {
    fs.writeFile(
      //Essa função é responsável por escrever os dados atualizados no arquivo urls.json.
      path.join(__dirname, 'urls.json'),
      JSON.stringify(data, null, 2),
      (err) => {                                    //Ela usa o método writeFile do módulo fs para escrever os dados em formato JSON no arquivo.
        if (err) throw err;
        cb('Operação realizada com sucesso!');
      }
    );
  }

  if (!name || !url) {
    return res.end(JSON.stringify(data));
  }                                 //verificamos se os parâmetros name e url estão presentes na requisição.
                                    //Se algum deles estiver faltando, retornamos os dados existentes em data como uma resposta JSON. 


  if (del) {
    const filteredData = data.urls.filter((item) => item.url !== url);   //o parâmetro del estiver presente na requisição
                                                                         //filtramos os dados existentes em data.urls, removendo o objeto cuja propriedade url corresponda ao valor do parâmetro url.
    data.urls = filteredData;
    return writeFile((message) => res.end(message));
  }
   // Verificar se a URL já existe na lista
   const existingURL = data.urls.find((item) => item.url === url);
   if (existingURL) {
     return res.end('URL já existe na lista.');
   }

  data.urls.push({ name, url });
  return writeFile((message) => res.end(message));

}).listen(3000, () => console.log('API rodando...'));
