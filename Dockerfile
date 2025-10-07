# Usa uma imagem oficial do Node
FROM node:20

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas arquivos de dependências primeiro (melhor cache)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
