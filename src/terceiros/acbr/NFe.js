// {******************************************************************************}
// { Projeto: Componentes ACBr                                                    }
// {  Biblioteca multiplataforma de componentes Delphi para interaÃ§Ã£o com equipa- }
// { mentos de AutomaÃ§Ã£o Comercial utilizados no Brasil                           }
// {                                                                              }
// { Direitos Autorais Reservados (c) 2022 Daniel Simoes de Almeida               }
// {                                                                              }
// { Colaboradores nesse arquivo: FÃ¡bio Francisco - Centrodata Sistemas,          }
// {   Filipe Natividade - Centrodata Sistemas,                                   }
//     Fernanda de Souza Alves - C E S Consultoria e Sistemas,                    }
//     DÃ©bora Bonfim Guedes - C E S Consultoria e Sistemas	                      }
// {                                                                              }
// {  VocÃª pode obter a Ãºltima versÃ£o desse arquivo na pagina do  Projeto ACBr    }
// { Componentes localizado em      http://www.sourceforge.net/projects/acbr      }
// {                                                                              }
// {  Esta biblioteca Ã© software livre; vocÃª pode redistribuÃ­-la e/ou modificÃ¡-la }
// { sob os termos da LicenÃ§a PÃºblica Geral Menor do GNU conforme publicada pela  }
// { Free Software Foundation; tanto a versÃ£o 2.1 da LicenÃ§a, ou (a seu critÃ©rio) }
// { qualquer versÃ£o posterior.                                                   }
// {                                                                              }
// {  Esta biblioteca Ã© distribuÃ­da na expectativa de que seja Ãºtil, porÃ©m, SEM   }
// { NENHUMA GARANTIA; nem mesmo a garantia implÃ­cita de COMERCIABILIDADE OU      }
// { ADEQUAÃ‡ÃƒO A UMA FINALIDADE ESPECÃFICA. Consulte a LicenÃ§a PÃºblica Geral Menor}
// { do GNU para mais detalhes. (Arquivo LICENÃ‡A.TXT ou LICENSE.TXT)              }
// {                                                                              }
// {  VocÃª deve ter recebido uma cÃ³pia da LicenÃ§a PÃºblica Geral Menor do GNU junto}
// { com esta biblioteca; se nÃ£o, escreva para a Free Software Foundation, Inc.,  }
// { no endereÃ§o 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.          }
// { VocÃª tambÃ©m pode obter uma copia da licenÃ§a em:                              }
// { http://www.opensource.org/licenses/lgpl-license.php                          }
// {                                                                              }
// { Daniel SimÃµes de Almeida - daniel@projetoacbr.com.br - www.projetoacbr.com.br}
// {       Rua Coronel Aureliano de Camargo, 963 - TatuÃ­ - SP - 18270-170         }
// {******************************************************************************}

const path = require('path');

const ffi = require('ffi-napi');
const ref = require('ref-napi');

var pathDllACBrLibNFe = path.join(__dirname, 'ACBrNFe64.dll');
var pathXML = path.join(__dirname, 'chave-nfe.xml');

var eArqConfig = path.join(__dirname, 'acbrlib.ini');
var eChaveCrypt = '';

async function getNFe() {
  var libm = ffi.Library(pathDllACBrLibNFe, {

    //MÃ©todos da Biblioteca

    // NFE_Inicializar([eArqConfig, eChaveCrypt]);
    NFE_Inicializar: ['int', ['string', 'string']],
    // NFE_Finalizar();
    NFE_Finalizar: ['int', []],
    // NFE_UltimoRetorno(sMensagem, ref esTamanho);
    NFE_UltimoRetorno: ['int', ['string', 'string']],
    // NFE_Nome(sNome, ref esTamanho);
    NFE_Nome: ['int',['string','string']],
    // NFE_Versao(sVersao, ref esTamanho);
    NFE_Versao: ['int', ['string','string']],

    //MÃ©todos de ConfiguraÃ§Ã£o

    // NFE_ConfigLer([eArqConfig]);
    NFE_ConfigLer: ['int', ['string']],
    // NFE_ConfigGravar([eArqConfig]);
    NFE_ConfigGravar: ['int', ['string']],
    // NFE_ConfigLerValor(eSessao, eChave, sValor, esTamanho);
    NFE_ConfigLerValor: ['int',['string','string','string','string']],
    // NFE_ConfigGravarValor(eSessao, eChave, sValor);
    NFE_ConfigGravarValor: ['int', ['string', 'string', 'string']],
    // NFE_ConfigImportar([eArqConfig]);
    NFE_ConfigImportar: ['int',['string']],
    // NFE_ConfigExportar(sMensagem, ref esTamanho);
    NFE_ConfigExportar: ['int',['string','string']],

    //MÃ©todos NFe

    // NFE_CarregarXML(eArquivoOuXML);
    NFE_CarregarXML: ['int', ['string']], 
    // NFE_CarregarINI(eArquivoOuINI);
    NFE_CarregarINI: ['int', ['string']],
    // NFE_ObterXml(AIndex, sResposta, esTamanho);
    NFE_ObterXml: ['int',['int', 'string', 'string']],
    // NFE_GravarXml(AIndex, [eNomeArquivo], [ePathArquivo]);
    NFE_GravarXml: ['int', ['int','string','string']],
    // NFE_ObterIni(AIndex, sResposta, esTamanho);
    NFE_ObterIni: ['int', ['int','string','string']],
    // NFE_GravarIni(AIndex, eNomeArquivo, [ePathArquivo]);
    NFE_GravarIni: ['int',['int', 'string', 'string']],
    // NFE_CarregarEventoXML(eArquivoOuXML);
    NFE_CarregarEventoXML: ['int',['string']],
    // NFE_CarregarEventoINI(eArquivoOuINI);
    NFE_CarregarEventoINI: ['int',['string']],
    // NFE_LimparLista();
    NFE_LimparLista: ['int',[]],
    // NFE_LimparListaEventos();
    NFE_LimparListaEventos: ['int',[]],
    // NFE_Assinar();
    NFE_Assinar: ['int', []],
    // NFE_Validar();
    NFE_Validar: ['int', []],
    // NFE_ValidarRegrasdeNegocios(sResposta, esTamanho);
    NFE_ValidarRegrasdeNegocios: ['int',['string','string']],
    // NFE_VerificarAssinatura(sResposta, esTamanho);
    NFE_VerificarAssinatura: ['int',['string','string']],
    // NFE_GerarChave(ACodigoUF, ACodigoNumerico, AModelo, ASerie, ANumero, ATpEmi, AEmissao, ACNPJCPF, sResposta, esTamanho);
    NFE_GerarChave: ['int',['int','int','int','int','int','int','string','string','string','string']],
    // NFE_ObterCertificados(sResposta, esTamanho);
    NFE_ObterCertificados: ['int',['string','string']],
    // NFE_GetPath(ATipo, sResposta, esTamanho);
    NFE_GetPath: ['int',['int','string','string']],
    // NFE_GetPathEvento(ACodEvento, sResposta, esTamanho);
    NFE_GetPathEvento: ['int',['int','string','string']],
    // NFE_StatusServico(sResposta, esTamanho);
    NFE_StatusServico: ['int', ['status','string']],
    // NFE_Consultar( eChaveOuNFe, AExtrairEventos, sResposta, esTamanho);
    NFE_Consultar: ['int',['string','bool','string','string']],
    // NFE_ConsultarRecibo(ARecibo, sResposta, esTamanho);
    NFE_ConsultarRecibo: ['int',['string','string','string']],
    // NFE_ConsultaCadastro(cUF, nDocumento, nIE, sResposta, esTamanho);
    NFE_ConsultaCadastro: ['int',['string','string','bool','string','string']],
    // NFE_Inutilizar(ACNPJ, AJustificativa, Ano, Modelo, Serie, NumeroInicial, NumeroFinal, sResposta, esTamanho);
    NFE_Inutilizar: ['int',['string','string','int','int','int','int','int','string','string']],
    // NFE_Enviar( (ALote, AImprimir, ASincrono, AZipado, sResposta, esTamanho);
    NFE_Enviar: ['int', ['int','bool','bool','bool','string','string']],
    // NFE_Cancelar(eChave, eJustificativa, eCNPJ, ALote, sResposta, esTamanho);
    NFE_Cancelar: ['int',['string','string','string','int','string','string']],
    // NFE_EnviarEvento(idLote, sResposta, esTamanho);
    NFE_EnviarEvento: ['int',['int','string','string']],
    // NFE_DistribuicaoDFePorUltNSU(AcUFAutor, eCNPJCPF, eultNSU, sResposta, esTamanho);
    NFE_DistribuicaoDFePorUltNSU: ['int',['int','string','string','string','string']],
    // NFE_DistribuicaoDFePorNSU(AcUFAutor, eCNPJCPF, eNSU, sResposta, esTamanho);
    NFE_DistribuicaoDFePorNSU: ['int',['int','string','string','string','string']],
    // NFE_DistribuicaoDFePorChave(AcUFAutor, eCNPJCPF, eChave, sResposta, esTamanho);
    NFE_DistribuicaoDFePorChave: ['int',['int','string','string','string','string']],
    // NFE_EnviarEmail(ePara, eXMLNFe, AEnviaPDF, eAssunto, eCC, eAnexos, eMensagem);
    NFE_EnviarEmail: ['int',['string','string','bool','string','string','string','string']],
    // NFE_EnviarEmailEvento(ePara, eChaveEvento, eChaveNFe, AEnviaPDF, eAssunto, eCC, eAnexos, eMensagem);
    NFE_EnviarEmailEvento: ['int',['string','string','string','bool','string','string','string','string']],
    // NFE_Imprimir([cImpressora], [nNumCopias], [cProtocolo], [bMostrarPreview], [cMarcaDagua], [bViaConsumidor], [bSimplificado]);
    NFE_Imprimir: ['int',['string','int','string','string','string','string','string',]],
    // NFE_ImprimirPDF();
    NFE_ImprimirPDF: ['int', []],
    // NFE_SalvarPDF(sResposta, esTamanho);
    NFE_SalvarPDF: ['int',['string','string']],
    // NFE_ImprimirEvento(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_ImprimirEvento: ['int',['string','string']],
    // NFE_ImprimirEventoPDF(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_ImprimirEventoPDF: ['int',['string','string']],
    // NFE_SalvarEventoPDF(eArquivoXmlNFe, eArquivoXmlEvento);
    NFE_SalvarEventoPDF: ['int',['string','string']],
    // NFE_ImprimirInutilizacao(eArquivoXml);
    NFE_ImprimirInutilizacao: ['int', ['string']],
    // NFE_ImprimirInutilizacaoPDF(eArquivoXml);
    NFE_ImprimirInutilizacaoPDF: ['int',['string']],
    // NFE_SalvarInutilizacaoPDF(eArquivoXml);
    NFE_SalvarInutilizacaoPDF: ['int',['string']],     
  });

  var inicio = 2;
  const buflength = 256;

  let aloc_sResposta = Buffer.alloc(buflength);
  let aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_Inicializar(eArqConfig, eChaveCrypt);
  console.log(`iniciou >>>>>>> ${inicio}`);

  inicio = libm.NFE_ConfigGravarValor('DFe', 'ArquivoPFX', path.join(path.resolve(__dirname, 'certificado'), 'nome_do_certificado.pfx'));
  inicio = libm.NFE_ConfigGravarValor('DFe', 'Senha', '1234');
  inicio = libm.NFE_ConfigGravarValor('NFe', 'PathSchemas', path.resolve(__dirname, 'Schemas', 'NFe'));
  console.log(`Set ConfiguraÃ§Ãµes ${inicio}`);

  inicio = libm.NFE_CarregarXML(pathXML);
  console.log(`carregar xml >>>>>>> ${inicio}`);

  inicio = libm.NFE_UltimoRetorno(aloc_sResposta, aloc_esTamanho);
  console.log(`ultmio retorno >>>>>>>> ${inicio}`);
  console.log(`Mensagem Ultimo Retorno: `, aloc_sResposta.toString());

  inicio = libm.NFE_Assinar();
  console.log(`assinar xml >>>>>>> ${inicio}`);

  aloc_sResposta = Buffer.alloc(buflength);
  aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_UltimoRetorno(aloc_sResposta, aloc_esTamanho);
  console.log(`ultimo retorno apos assinar >>>>>>>> ${inicio}`);
  console.log(`Mensagem: `, aloc_sResposta.toString('ascii'));

  inicio = libm.NFE_Validar();
  console.log(`validar xml >>>>>>> ${inicio}`);


  aloc_sResposta = Buffer.alloc(buflength);
  aloc_esTamanho = ref.alloc('int', buflength);

  inicio = libm.NFE_UltimoRetorno(aloc_sResposta, aloc_esTamanho);
  console.log(`ultmio retorno apos validar >>>>>>>> ${inicio}`);
  console.log(`Mensagem: `, aloc_sResposta.toString());

  inicio = libm.NFE_Finalizar();
  console.log(`finalizar >>>>>>>> ${inicio}`);
}

getNFe();