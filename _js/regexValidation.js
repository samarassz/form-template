/* As funções são chamadas usando onblur() diretamente nos inputs do html
  ou todas de uma vez usando onclick() no botão enviar.
*/

// Garante que ao menos 2 nomes sejam informados e que a primeira letra esteja em maiúsculo
function validarNome() {
  const nome = document.getElementById('nome').value;
  const nomeRegex = /^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/;
  return !nomeRegex.test(nome) ? (alert('Nome Inválido'), false) : true;
}

// Aceita emails terminados em .com ou .br, com letras, números, ponto . e underline _
function validarEmail() {
  const email = document.getElementById('email').value;
  const emailRegex = /^((\w)+(\.)?(\w)+@(\w)+\.com)(\.br)?$/i;
  return !emailRegex.test(email) ? (alert('Email Inválido'), false) : true;
}

// Garante que o formato do CPF seja apenas números ou com pontos e traço tal qual o documento
function validarCPF() {
  const cpf = document.getElementById('cpf').value;
  const cfpRegex = /(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))/;
  return !cfpRegex.test(cpf) ? (alert('CPF Inválido'), false) : true;
}

// Telefone fixo com DDD e 8 dígitos, com ou sem ( ) e -
function validarTel() {
  const telefone = document.getElementById('telefone').value;
  const telefoneRegex =
    /^(\([0-9]{2}\) ?[0-9]{4}\-?[0-9]{4})|([0-9]{2} ?[0-9]{8})$/;
  return !telefoneRegex.test(telefone)
    ? (alert('Telefone Inválido'), false)
    : true;
}

// Celular com DDD, dígito 9 opcional, com ou sem ( ) e -
function validarCel() {
  const celular = document.getElementById('celular').value;
  const celularRegex =
    /^(\([0-9]{2}\) ?[0-9]{4,5}\-?[0-9]{4})|([0-9]{2} ?[0-9]{8,9})$/;
  return !celularRegex.test(celular)
    ? (alert('Celular Inválido'), false)
    : true;
}

// Aceita apenas números para o endereço residencial
function validarNumero() {
  const numero = document.getElementById('numero').value;
  const numeroRegex = /^[0-9]+$/;
  return !numeroRegex.test(numero)
    ? (alert('Digite o número da residência'), false)
    : true;
}

// Esta função pega o nome dos estados e atribui um ID a eles, adicionando-os aos Select
const selectUF = document.getElementById('selectUF');
const selectCidades = document.getElementById('selectCidades');
function popularEstados() {
  fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  )
    .then((res) => res.json())
    .then((estados) => {
      estados.map((estado) => {
        const option = document.createElement('option');
        option.setAttribute('id', estado.id);
        option.textContent = estado.nome; // Substitua .nome por .sigla se preferir
        selectUF.appendChild(option);
      });
    });
}
// Esta popula o nome das cidades de acordo com o Estado
function popularCidades() {
  // Limpa as Cidades ao mudar de Estado
  selectUF.addEventListener('change', () => {
    let nodeselectCidades = selectCidades.childNodes;
    [...nodeselectCidades].map((node) => node.remove());

    let state = selectUF.options[selectUF.selectedIndex].id;
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    )
      .then((res) => res.json())
      .then((cidades) => {
        selectCidades.removeAttribute('disabled');
        cidades.map((cidade) => {
          const option = document.createElement('option');
          option.setAttribute('id', cidade.id);
          option.textContent = cidade.nome;
          selectCidades.appendChild(option);
        });
      });
  });
}
popularEstados();
popularCidades();

// Limpa os campos do Endereço quando o usuário alterar o CEP informado
function limpaCEP() {
  document.getElementById('logradouro').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('cidade').value = '';
  document.getElementById('estado').value = '';
}

// Pesquisa na base de dados da API, retornando o endereço encontrado
// em caso de erro, alerta que CEP não existe
function pesquisaCEP(cep) {
  // caso tenha problemas com acentuações, adicione 'unicode/' ao final da URL
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res) => res.json())
    .then((cepValue) => {
      if (cepValue.erro) {
        alert('CEP inexistente!');
      } else {
        document.getElementById('logradouro').value = cepValue.logradouro;
        document.getElementById('bairro').value = cepValue.bairro;
        document.getElementById('cidade').value = cepValue.localidade;
        document.getElementById('estado').value = cepValue.uf;
      }
    });
}

// Garante que o CEP seja apenas números ou com um - que é retirado pelo .replace posteriormente
function validarCEP() {
  const cep = document.getElementById('cep').value;
  const cepRegex = /[0-9]{5}-?[0-9]{3}/;
  let cepValido = '';

  return !cepRegex.test(cep)
    ? (alert('CEP Inválido'), false)
    : ((cepValido = cep.replace(/\D/g, '')), pesquisaCEP(cepValido), true);
}

// Chama todas as funções de uma vez ao clicar em Enviar
// se a intenção for tratar os dados informados, essa é a hora
function validarTudo() {
  return (
    validarNome() &
    validarEmail() &
    validarCPF() &
    validarTel() &
    validarCel() &
    validarCEP() &
    validarNumero()
  );
}
