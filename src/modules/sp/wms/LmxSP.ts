import * as request from 'request-promise-native';
import Util from '../../../helpers/Util';

export default class LmxSP {

  public static getInstance(): LmxSP {
    if (!LmxSP._default) {
      LmxSP._default = new LmxSP();
    }
    return LmxSP._default;
  }
  private static _default: LmxSP;
  private token = 'kr93jgrbv7lw';
  // private wms_url = 'http://ndev02.nuccitms.com.br';
  private wms_url = "http://lmx.nuccierp.com.br";
  private url = `${this.wms_url}/custom/wms/integracao/json`;

  public async getAllOrders(clients) {
    try {
      const options: any = {
        uri: `${this.url}/n_getpedido_json.php`,
        qs: {
          token: this.token,
          qtdereg: 300,
        },
        json: true,
      };

      let data: any = await Promise.all(
        clients.map((cli) => {
          options.qs.codigo = cli.code;
          return request(options);
        }),
      );
      // } catch (e) {
      //   return Promise.reject(e);
      // }

      // try {
      if (data && data.length) {
        data = Util.getInstance().flatten(data, 'pedidos');
        data.forEach((obj: any) => {
          obj.criacaoc =  obj.criacao;
          obj.criacao = obj.criacao
            ? Util.getInstance().createDateFromMysql(obj.criacao)
            : null;

          obj.emissao = obj.emissao
            ? Util.getInstance().createDateFromMysql(obj.emissao)
            : null;

          obj.separacao = obj.separacao
            ? Util.getInstance().createDateFromMysql(obj.separacao)
            : null;

          obj.confirmacao = obj.confirmacao
            ? Util.getInstance().createDateFromMysql(obj.confirmacao)
            : null;

          obj.codigo_cli = clients.find((ele) => ele.code == obj.codigo_cli);

          obj.historico
            ? obj.historico.forEach((h) => {
                h.data_historico = Util.getInstance().createDateFromMysql(
                  h.data_historico,
                );
              })
            : null;
        });
        data = data.sort((a: any, b: any) => {
          return a.criacao - b.criacao;
        });
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error('Não há Pedidos'));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async getOrders(clients) {
    const mapClient = [];

    if (!(clients instanceof Array)) {
      throw new Error('The parameter must be an array of client code');
    }

    const options: any = {
      uri: `${this.url}/n_getpedido_json.php`,
      qs: {
        token: this.token,
        qtdereg: 50,
      },
      json: true,
    };

    try {
      let data: any = await Promise.all(
        clients.map((cli) => {
          options.qs.codigo = cli.code;
          return request(options);
        }),
      );

      clients.forEach((cli) => {
        mapClient[cli.code] = cli;
      });

      if (data) {
        data = Util.getInstance().flatten(data, 'pedidos');
        data.forEach((obj) => {
          obj.criacao = Util.getInstance().createDateFromMysql(obj.criacao);

          obj.emissao = Util.getInstance().createDateFromMysql(obj.emissao);

          obj.codigo_cli = mapClient[obj.codigo_cli];
        });
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error('Não há Pedidos'));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async getClients() {
    const options = {
      uri: `${this.url}/n_getwcli_json.php`,
      qs: {
        token: this.token,
        order: 'codigo',
      },
      json: true,
    };

    try {
      const data = await request(options);
      data.clientes = data.clientes.map((c) => ({
        codigo: parseInt(c.codigo, 10),
        nome: c.nome,
      }));
      return Promise.resolve(data.clientes);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // invoice entry"

  public async getInvoiceEntry() {
    const options = {
      // Alterar DEV
      uri: `${this.url}/n_getnfentrada_json.php`,
      qs: {
        token: this.token,
      },
      json: true,
    };

    try {
      let data: any = await request(options);
      if (!data) { return Promise.reject(new Error('Não há faturas de entrada!')); }
      data = data.nfsentrada ? data.nfsentrada : [];
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   *
   * @param {Number} code Codigo do tipo da avaria
   */
  public async getInvoiceBreakdowns(code: any = 'all') {
    const options = {
      // Alterar DEV
      uri: `${this.url}/n_getnfentrada_json.php`,
      qs: {
        token: this.token,
        bloq: code,
      },
      json: true,
    };

    try {
      let data = await request(options);
      if (!data) {
        return Promise.reject(new Error('Erro ao buscar tipos de avarias'));
      }
      data = data ? data : [];
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
    
  }
  // flatten(array: [], path: string) {}
}
