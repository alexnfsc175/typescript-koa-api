import * as request from "request-promise-native";

export default class LmxSP {
  private token = "kr93jgrbv7lw";
  // private wms_url = 'http://ndev02.nuccitms.com.br';
  private wms_url = "http://lmx.nuccierp.com.br";
  private url = `${this.wms_url}/custom/wms/integracao/json`;
  private static _default: LmxSP;

  static getInstance(): LmxSP {
    if (!LmxSP._default) {
      LmxSP._default = new LmxSP();
    }
    return LmxSP._default;
  }
  ////////////////////////////////////
  async getAllOrders(clients) {
    try {
      const options: any = {
        uri: `${this.url}/n_getpedido_json.php`,
        qs: {
          token: this.token,
          qtdereg: 300
        },
        json: true
      };

      let data: any = await Promise.all(
        clients.map(cli => {
          options.qs.codigo = cli.code;
          return request(options);
        })
      );
      // } catch (e) {
      //   return Promise.reject(e);
      // }

      // try {
      if (data && data.length) {
        data = this.flatten(data, "pedidos");
        data.forEach((obj: any) => {
          obj.criacao = obj.criacao ? this.convertToDate(obj.criacao) : null;

          obj.emissao = obj.emissao ? this.convertToDate(obj.emissao) : null;

          obj.separacao = obj.separacao
            ? this.convertToDate(obj.separacao)
            : null;

          obj.confirmacao = obj.confirmacao
            ? this.convertToDate(obj.confirmacao)
            : null;

          obj.codigo_cli = clients.find(ele => ele.code == obj.codigo_cli);

          obj.historico
            ? obj.historico.forEach(h => {
                h.data_historico = this.convertToDate(h.data_historico);
              })
            : null;
        });
        data = data.sort((a: any, b: any) => {
          return a.criacao - b.criacao;
        });
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error("Não há Pedidos"));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getOrders(clients) {
    let mapClient = [];

    if (!(clients instanceof Array)) {
      throw new Error("The parameter must be an array of client code");
    }

    let options: any = {
      uri: `${this.url}/n_getpedido_json.php`,
      qs: {
        token: this.token,
        qtdereg: 50
      },
      json: true
    };

    try {
      let data: any = await Promise.all(
        clients.map(cli => {
          options.qs.codigo = cli.code;
          return request(options);
        })
      );

      clients.forEach(cli => {
        mapClient[cli.code] = cli;
      });

      if (data) {
        data = this.flatten(data, "pedidos");
        data.forEach(obj => {
          obj.criacao = this.convertToDate(obj.criacao);

          obj.emissao = this.convertToDate(obj.emissao);

          obj.codigo_cli = mapClient[obj.codigo_cli];
        });
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error("Não há Pedidos"));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getClients() {
    const options = {
      uri: `${this.url}/n_getwcli_json.php`,
      qs: {
        token: this.token,
        order: "codigo"
      },
      json: true
    };

    try {
      return request(options);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // invoice entry"

  async getInvoiceEntry() {
    const options = {
      // Alterar DEV
      uri: `${this.url}/n_getnfentrada_json.php`,
      qs: {
        token: this.token
      },
      json: true
    };

    try {
      let data: any = await request(options);
      if (!data) return Promise.reject(new Error("Não há faturas de entrada!"));
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
  async getInvoiceBreakdowns(code: any = "all") {
    const options = {
      // Alterar DEV
      uri: `${this.url}/n_getnfentrada_json.php`,
      qs: {
        token: this.token,
        bloq: code
      },
      json: true
    };

    try {
      let data = await request(options);
      if (!data)
        return Promise.reject(new Error("Erro ao buscar tipos de avarias"));
      data = data ? data : [];
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
    ////////////////////////////////////
  }

  convertToDate(date: string) {}

  flatten(array: [], path: string) {}
}