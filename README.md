# apiSuperAr

 Dependencias adicionadas ao projeto: 
### Nodemon 
    2. Swagger  --- npm i swagger-ui-express -S
### Swagger 
    1. npm i swagger-ui-express -S

## Comandos para rodar no terminarl
    1. npm run dev    --- roda a api no local host

## Tutorial para instalar debugger - EXCELENTE!!!
   https://sureshmauryanotes.wordpress.com/2021/07/20/debug-nodejs-typescript-using-visual-studio-code/

   Atalhos Debugger:
      - F5  - Executar/Continuar
      - F10 - Executa sem entrar na função - Step Over 
      - F11 - Executa Entrando na Função - Step Into 
      - Shift + F11 - Executa até o término da função - Step Out
      - Ctrl+Shift+F5 - Reinicia - Restart
      - Shift+F5 - Cancela Execução - Stop

## Para nova requisição:
    1- Definir os parâmetros de Request e Response dentro da pasta types [modulo]Types.ts  no formato:
        Request: export interface I[Servico]Request extends IGRequest
        Response: export interface I[Servico]Response extends IGResponse

        Obs: Caso Request seja padrão pode-se utilizar IGRequest (sem token) e IGRequestAut (com token)
        Obs: Caso Response seja padrão pode-se utilizar IGResponse

    2- Definir a função que responderá pela rota dentro da pasta controllers\[modulo]Controller.ts tipando Request e Response com os tipos acima:
        async [servico](req: TypedRequestBody<I[Servico]Request>, res: TypedResponse<I[Servico]Response>)

    3- Incluir a rota em routes\[Modulo]Routes.ts
    

# GitHub
  ### Enviar atualizações
     1. $ git add .
     2. $ git commit -m "mensagem com alterações"
     3. $ git push origin master

  ### Para atualizar versão local
     1. $ git pull

  ### Para baixar em nova pasta
     1. $ git clone <<< link do git >>>
     2. após clonar, executar dentro do terminal do projeto
        2.1 $ npm install
        
  ### Sobre as BRANCHS
    1. Branch principal (master) 
    2. Branch de trabalho (versao4) 
    3. Branch (minha-branch-local) base da primeira versao da api. 




 ### Build para producao:  
    ### Adicionar o seguinte codigo no package.json
   
            "scripts": {
                    "start": "ts-node build/server.js",
                    "dev": "nodemon --exec ts-node src/server.ts",
                    "build": "tsc"
                    }
### Para rodar os codigos:
     npm run build  ( cria pasta buld) 

     npm start: ( inicia o servidor apartir do server.TS)


### SUBINDO BUILD EM PRODUCAO
    1 - Instalar o node no servidor
        1.1 - Caso já aberto o Prompt de Comando, lembrar de reiniciar após instalar o Node

    2 - Acessar o servidor de destino
        2.1 - Criar pasta Logidados (caso não exista)
        2.2 - Criar pasta do WebService (pex: WSSuperar)
        2.3 - Salvar a pasta Build Dentro
        2.4 - Salvar os arquivos JSON (todos) na pasta do WebService (não dentro de build)
        2.5 - Executar o npm install na pasta do WebService
        2.6 - Testar o WebService executando $ node build\server.js
    

    

######


######
# Para estudarmos
######

  ### typeORM    
    $ npm install typeorm --save

  ### MySQL or MariaDB
        $ npm install mysql2 --save  
      
        ou

        $ npm install mysql2 --save

## PostgreSQL or CockroachDB

    $ npm install pg --save

## for SQLite

    $ npm install sqlite3 --save

## for Microsoft SQL Server

    $ npm install mssql --save