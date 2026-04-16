-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `sensores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sensores` (
  `id_sensores` INT NOT NULL,
  `localizacao_sensor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_sensores`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `dados_sensores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dados_sensores` (
  `id_dados_sensores` INT NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(100) NOT NULL,
  `sensores_id_sensores` INT NOT NULL,
  PRIMARY KEY (`id_dados_sensores`),
    CONSTRAINT `fk_dados_sensores_sensores1`
    FOREIGN KEY (`sensores_id_sensores`)
    REFERENCES `sensores` (`id_sensores`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `estoque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estoque` (
  `id_estoque` INT NOT NULL,
  `dados_sensores_id_dados_sensores` INT NOT NULL,
  `quantidade_atual` INT NOT NULL,
  `quantidade_minima` INT NOT NULL,
  `quantidade_maxima` INT NOT NULL,
  PRIMARY KEY (`id_estoque`),
   CONSTRAINT `fk_estoque_dados_sensores1`
    FOREIGN KEY (`dados_sensores_id_dados_sensores`)
    REFERENCES `dados_sensores` (`id_dados_sensores`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `Item_pedido_entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Item_pedido_entrada` (
  `idItem_pedido_entrada` INT NOT NULL,
  `qtd` INT NOT NULL,
  `estoque_id_estoque` INT NOT NULL,
  PRIMARY KEY (`idItem_pedido_entrada`),
   CONSTRAINT `fk_Item_pedido_entrada_estoque1`
    FOREIGN KEY (`estoque_id_estoque`)
    REFERENCES `estoque` (`id_estoque`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `senha` VARCHAR(10) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `cargo` VARCHAR(45) NOT NULL,
  `admin` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `cabecalho_ped_entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cabecalho_ped_entrada` (
  `idcabecalho_ped_entrada` INT NOT NULL,
  `Item_pedido_entrada_idItem_pedido_entrada` INT NOT NULL,
  `criacao_pedido` DATE NOT NULL,
  `cliente` VARCHAR(45) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `qntd` INT NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  `data_entrada` DATE NOT NULL,
  PRIMARY KEY (`idcabecalho_ped_entrada`),
   CONSTRAINT `fk_cabecalho_ped_entrada_Item_pedido_entrada1`
    FOREIGN KEY (`Item_pedido_entrada_idItem_pedido_entrada`)
    REFERENCES `Item_pedido_entrada` (`idItem_pedido_entrada`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cabecalho_ped_entrada_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fornecedor` (
  `id_fornecedor` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `cnpj` VARCHAR(14) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(8) NOT NULL,
  `cabecalho_ped_entrada_idcabecalho_ped_entrada` INT NOT NULL,
  PRIMARY KEY (`id_fornecedor`),
   CONSTRAINT `fk_fornecedor_cabecalho_ped_entrada1`
    FOREIGN KEY (`cabecalho_ped_entrada_idcabecalho_ped_entrada`)
    REFERENCES `cabecalho_ped_entrada` (`idcabecalho_ped_entrada`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `produto` (
  `idproduto` INT NOT NULL,
  `nome_produto` VARCHAR(25) NOT NULL,
  `categoria` VARCHAR(10) NOT NULL,
  `preco_custo` FLOAT NOT NULL,
  `preco_venda` FLOAT NOT NULL,
  `tipo` VARCHAR(60) NOT NULL,
  `data_validade` DATE NOT NULL,
  `estoque_id_estoque` INT NOT NULL,
  `Descrição` VARCHAR(100) NOT NULL,
  `Unidade_de_Medida` INT NOT NULL,
  PRIMARY KEY (`idproduto`),
   CONSTRAINT `fk_produto_estoque1`
    FOREIGN KEY (`estoque_id_estoque`)
    REFERENCES `estoque` (`id_estoque`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `caminhao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `caminhao` (
  `id_caminhao` INT NOT NULL,
  `placa` VARCHAR(8) NOT NULL,
  `modelo` VARCHAR(45) NOT NULL,
  `cor` VARCHAR(20) NOT NULL,
  `marca` VARCHAR(45) NOT NULL,
  `chassi` VARCHAR(17) NOT NULL,
  PRIMARY KEY (`id_caminhao`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `item_pedido_saida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `item_pedido_saida` (
  `id_item_pedido_saida` INT NOT NULL,
  `data` DATE NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `estoque_id_estoque` INT NOT NULL,
  PRIMARY KEY (`id_item_pedido_saida`),
    CONSTRAINT `fk_item_pedido_saida_estoque1`
    FOREIGN KEY (`estoque_id_estoque`)
    REFERENCES `estoque` (`id_estoque`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `cliente`
-- -----------------------------------------------------
CREATE TABLE cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  produto_idproduto INT NOT NULL,
  cabecalho_ped_entrada_idcabecalho_ped_entrada INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  senha VARCHAR(50) NOT NULL,

  CONSTRAINT fk_usuario_produto1
    FOREIGN KEY (produto_idproduto)
    REFERENCES produto (idproduto),

  CONSTRAINT fk_usuario_cabecalho_ped_entrada1
    FOREIGN KEY (cabecalho_ped_entrada_idcabecalho_ped_entrada)
    REFERENCES cabecalho_ped_entrada (idcabecalho_ped_entrada)
);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `pedido_saida_cabecalho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido_saida_cabecalho` (
  `id_pedido_saida_cabecalho` INT NOT NULL,
  `data` DATE NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `caminhao_id_caminhao` INT NOT NULL,
  `item_pedido_saida_id_item_pedido_saida` INT NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  `cliente_id_cliente` INT NOT NULL,
  PRIMARY KEY (`id_pedido_saida_cabecalho`),
    CONSTRAINT `fk_pedido_saida_cabecalho_caminhao`
    FOREIGN KEY (`caminhao_id_caminhao`)
    REFERENCES `caminhao` (`id_caminhao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_saida_cabecalho_item_pedido_saida1`
    FOREIGN KEY (`item_pedido_saida_id_item_pedido_saida`)
    REFERENCES `item_pedido_saida` (`id_item_pedido_saida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_saida_cabecalho_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_saida_cabecalho_cliente1`
    FOREIGN KEY (`cliente_id_cliente`)
    REFERENCES `cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `movimentacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimentacao` (
  `id_movimentacao` INT NOT NULL,
  `tipo` VARCHAR(45) NOT NULL,
  `quantidade` INT NOT NULL,
  `observacao` VARCHAR(45) NOT NULL,
  `data_movimentacao` DATE NOT NULL,
  `Item_pedido_entrada_idItem_pedido_entrada` INT NOT NULL,
  `item_pedido_saida_id_item_pedido_saida` INT NOT NULL,
  PRIMARY KEY (`id_movimentacao`),
   CONSTRAINT `fk_movimentacao_Item_pedido_entrada1`
    FOREIGN KEY (`Item_pedido_entrada_idItem_pedido_entrada`)
    REFERENCES `Item_pedido_entrada` (`idItem_pedido_entrada`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_movimentacao_item_pedido_saida1`
    FOREIGN KEY (`item_pedido_saida_id_item_pedido_saida`)
    REFERENCES `item_pedido_saida` (`id_item_pedido_saida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

