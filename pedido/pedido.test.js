const realizarPedido = require("./pedido");
 
describe("realizarPedido", () => {
    let consultarEstoque;
    let salvarPedido;
    let enviarEmail;
    let produto;
 
    beforeEach(() => {
        consultarEstoque = jest.fn().mockResolvedValue(10);
        salvarPedido = jest.fn().mockResolvedValue(true);
        enviarEmail = jest.fn();
 
        produto = {
            id: 1,
            quantidade: 2
        };
    });
 

    test("deve retornar 'Pedido realizado' quando há estoque suficiente", async () => {
        const resultado = await realizarPedido(
            produto,
            consultarEstoque,
            salvarPedido,
            enviarEmail
        );
 
        expect(resultado).toBe("Pedido realizado");
    });
 
   
    test("deve chamar consultarEstoque com o id do produto", async () => {
        await realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail);
 
        expect(consultarEstoque).toHaveBeenCalledWith(produto.id);
    });
 
    
    test("deve chamar salvarPedido com o objeto produto", async () => {
        await realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail);
 
        expect(salvarPedido).toHaveBeenCalledWith(produto);
    });
 
    
    test("deve chamar enviarEmail uma única vez com a mensagem correta", async () => {
        await realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail);
 
        expect(enviarEmail).toHaveBeenCalledWith("Pedido realizado com sucesso");
        expect(enviarEmail).toHaveBeenCalledTimes(1);
    });
 

    test("deve lançar 'Estoque insuficiente' quando o estoque for menor que a quantidade pedida", async () => {
        consultarEstoque.mockResolvedValue(1);
 
        await expect(
            realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail)
        ).rejects.toThrow("Estoque insuficiente");
    });
 
    
    test("deve lançar 'Quantidade inválida' quando a quantidade for zero ou negativa", async () => {
        produto.quantidade = 0;
 
        await expect(
            realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail)
        ).rejects.toThrow("Quantidade inválida");
    });
 
   
    test("não deve chamar salvarPedido nem enviarEmail quando houver erro de estoque", async () => {
        consultarEstoque.mockResolvedValue(1);
 
        await expect(
            realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail)
        ).rejects.toThrow("Estoque insuficiente");
 
        expect(salvarPedido).not.toHaveBeenCalled();
        expect(enviarEmail).not.toHaveBeenCalled();
    });
 
    
    test("não deve chamar consultarEstoque quando a quantidade do produto for inválida", async () => {
        produto.quantidade = -1;
 
        await expect(
            realizarPedido(produto, consultarEstoque, salvarPedido, enviarEmail)
        ).rejects.toThrow("Quantidade inválida");
 
        expect(consultarEstoque).not.toHaveBeenCalled();
    });
 

    test("deve aceitar o pedido quando o estoque for exatamente igual à quantidade pedida", async () => {
        consultarEstoque.mockResolvedValue(produto.quantidade);
 
        const resultado = await realizarPedido(
            produto,
            consultarEstoque,
            salvarPedido,
            enviarEmail
        );
 
        expect(resultado).toBe("Pedido realizado");
    });
});