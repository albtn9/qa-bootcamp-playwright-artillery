# 🧪 QA Bootcamp – Playwright & Artillery

Projeto desenvolvido durante o Bootcamp com foco em testes funcionais e não funcionais.  
O objetivo foi criar uma aplicação API Restful para encurtamento de links, automatizar testes com **Playwright**, validar endpoints com **Bruno**, subir o ambiente de forma isolada usando **Podman** e executar testes de performance com **Artillery**.

---

## ⚙️ Tecnologias Utilizadas

- **Playwright** – Automação de testes funcionais e de API  
- **Bruno** – Execução de testes manuais e automáticos de API  
- **Artillery** – Testes de performance, carga e stress  
- **Podman** – Containerização e orquestração do ambiente  
- **PostgreSQL** – Banco de dados relacional  
- **Swagger** – Documentação e visualização dos endpoints  

---

## 🧩 Estrutura dos Testes

### 🔹 Testes de API (Bruno)
- CRUD completo de links encurtados  
- Validação de status code, corpo da resposta e mensagens de erro  
- Testes de integração entre endpoints  

### 🔹 Testes Automatizados (Playwright)
- Automação do fluxo de encurtamento de link via API  
- Validação de respostas, redirecionamento e persistência no banco  
- Execução integrada ao ambiente containerizado (Podman)

### 🔹 Testes de Performance (Artillery)
- **Health Test:** verificação da disponibilidade e estabilidade da API  
- **Teste de Pico:** simulação de alta demanda simultânea  
- **Teste de Cadastro:** análise de tempo de resposta e throughput  

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gustavoalbertine/qa-bootcamp-playwright-artillery.git
   cd qa-bootcamp-playwright-artillery
  ```

2. **Suba o ambiente com Podman**
 ```
podman-compose up -d
 ```

3. **Execute os testes automatizados**
 ```
npx playwright test
 ```

4. **Execute os testes de performance**
 ```
npx artillery run tests/performance.yml
 ```
