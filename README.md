# Infinite Monitor Live
![Texto_alternativo_imagem](https://i.ibb.co/CWTsnyH/Captura-de-tela-2024-07-18-220143.png)

## Visão Geral

Infinite Monitor Live é um projeto de monitoramento baseado no [Infinite Flight](https://infiniteflight.com/), desenvolvido como uma base de estudo e aprendizado em React. Este projeto foi inspirado pelo site [IVAO Webeye](https://webeye.ivao.aero/), e visa fornecer uma interface amigável para monitorar sessões de voo em tempo real.

## Funcionalidades

- **Visualização em Mapa**: Monitoramento em tempo real de voos e ATCs em um mapa interativo.
- **Informações Detalhadas**: Detalhes de cada voo e ATC com popups informativos.
- **Atualização Automática**: Dados atualizados automaticamente a cada 2 minutos.
- **Filtros de Visualização**: Diferenciação de tipos de ATC e voos com diferentes cores e marcadores.

## Estado do Projeto

Este projeto está atualmente na versão alpha. Estamos continuamente adicionando novas funcionalidades e melhorias. 

### Funcionalidades Planejadas

- **Login para Usuários**: Autenticação e personalização de experiência para usuários registrados.
- **Cores Diferenciadas**: Diferenciação visual para desenvolvedores, moderadores e streamers do Twitch e YouTube.
- **Marcadores Personalizados**: Implementação de marcadores personalizados para diferenciar tipos específicos de usuários e atividades.

## Como Funciona

1. **Mapa Interativo**: O mapa utiliza a biblioteca `react-leaflet` para exibir voos e ATCs em tempo real.
2. **API do Infinite Flight**: Dados são obtidos via chamadas à API pública do Infinite Flight.
3. **Atualização Dinâmica**: A aplicação faz requisições periódicas para atualizar as informações de voo e ATC.

## Tecnologias Utilizadas

- **React**: Biblioteca principal para a construção da interface.
- **Leaflet**: Biblioteca JavaScript para mapas interativos.
- **Axios**: Utilizado para fazer requisições HTTP à API do Infinite Flight.
- **CSS**: Estilização da interface.

## Instalação e Execução

Para executar o projeto localmente, siga as instruções abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/infinite-monitor-liv.git
