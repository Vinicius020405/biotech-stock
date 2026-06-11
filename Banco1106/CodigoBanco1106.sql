-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
SHOW WARNINGS;
-- -----------------------------------------------------
-- Schema estoque_sensores
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema estoque_sensores
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `estoque_sensores` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
SHOW WARNINGS;
USE `estoque_sensores` ;

-- -----------------------------------------------------
-- Table `localizacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `localizacao` (
  `id_localizacao` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `setor` VARCHAR(100) NULL DEFAULT NULL,
  `corredor` VARCHAR(50) NULL DEFAULT NULL,
  `prateleira` VARCHAR(50) NULL DEFAULT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id_localizacao`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `unidade_medida` VARCHAR(20) NOT NULL,
  `estoque_minimo` DECIMAL(10,2) NULL DEFAULT '0.00',
  `estoque_maximo` DECIMAL(10,2) NULL DEFAULT '0.00',
  `status` VARCHAR(20) NULL DEFAULT 'ativo',
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `imagem_tipo` TEXT NULL DEFAULT NULL,
  `imagem_nome` VARCHAR(255) NULL DEFAULT NULL,
  `imagem_blob` LONGBLOB NULL DEFAULT NULL,
  `teste` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `cadastro_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cadastro_sensor` (
  `id_sensor` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `tipo_sensor` VARCHAR(50) NOT NULL,
  `codigo_sensor` VARCHAR(50) NOT NULL,
  `id_localizacao` INT NOT NULL,
  `id_produto` INT NULL DEFAULT NULL,
  `status` VARCHAR(20) NULL DEFAULT 'ativo',
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_sensor`),
  UNIQUE INDEX `codigo_sensor` (`codigo_sensor` ASC) VISIBLE,
  CONSTRAINT `cadastro_sensor_ibfk_1`
    FOREIGN KEY (`id_localizacao`)
    REFERENCES `localizacao` (`id_localizacao`),
  CONSTRAINT `cadastro_sensor_ibfk_2`
    FOREIGN KEY (`id_produto`)
    REFERENCES `produto` (`id_produto`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `caminhao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `caminhao` (
  `id_caminhao` INT NOT NULL AUTO_INCREMENT,
  `placa` VARCHAR(8) NOT NULL,
  `modelo` VARCHAR(45) NOT NULL,
  `cor` VARCHAR(20) NOT NULL,
  `marca` VARCHAR(45) NOT NULL,
  `chassi` VARCHAR(17) NOT NULL,
  `imagem_nome` VARCHAR(255) NULL DEFAULT NULL,
  `imagem_tipo` VARCHAR(100) NULL DEFAULT NULL,
  `imagem_blob` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`id_caminhao`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `dados_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dados_sensor` (
  `id_dado_sensor` INT NOT NULL AUTO_INCREMENT,
  `id_sensor` INT NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `unidade` VARCHAR(20) NULL DEFAULT NULL,
  `data_leitura` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dado_sensor`),
  CONSTRAINT `dados_sensor_ibfk_1`
    FOREIGN KEY (`id_sensor`)
    REFERENCES `cadastro_sensor` (`id_sensor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `estoque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estoque` (
  `id_estoque` INT NOT NULL AUTO_INCREMENT,
  `id_produto` INT NOT NULL,
  `id_localizacao` INT NOT NULL,
  `quantidade_atual` DECIMAL(10,2) NULL DEFAULT '0.00',
  `atualizado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estoque`),
  CONSTRAINT `estoque_ibfk_1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `produto` (`id_produto`),
  CONSTRAINT `estoque_ibfk_2`
    FOREIGN KEY (`id_localizacao`)
    REFERENCES `localizacao` (`id_localizacao`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fornecedor` (
  `id_fornecedor` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cnpj` VARCHAR(14) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `endereco` VARCHAR(200) NULL DEFAULT NULL,
  `cep` VARCHAR(10) NULL DEFAULT NULL,
  `contato_responsavel` VARCHAR(80) NULL DEFAULT NULL,
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  `observacoes` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id_fornecedor`),
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `perfil` VARCHAR(30) NOT NULL,
  `status` VARCHAR(20) NULL DEFAULT 'ativo',
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `pedido_entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido_entrada` (
  `id_pedido_entrada` INT NOT NULL AUTO_INCREMENT,
  `numero_documento` VARCHAR(50) NULL DEFAULT NULL,
  `fornecedor` VARCHAR(100) NULL DEFAULT NULL,
  `data_entrada` DATE NOT NULL,
  `id_usuario` INT NOT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  `status` VARCHAR(30) NULL DEFAULT 'aberto',
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `id_fornecedor` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido_entrada`),
  CONSTRAINT `fk_pedido_entrada_fornecedor`
    FOREIGN KEY (`id_fornecedor`)
    REFERENCES `fornecedor` (`id_fornecedor`),
  CONSTRAINT `pedido_entrada_ibfk_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `item_pedido_entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `item_pedido_entrada` (
  `id_item_entrada` INT NOT NULL AUTO_INCREMENT,
  `id_pedido_entrada` INT NOT NULL,
  `id_produto` INT NOT NULL,
  `id_localizacao` INT NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  `valor_unitario` DECIMAL(10,2) NULL DEFAULT '0.00',
  `valor_total` DECIMAL(10,2) NULL DEFAULT '0.00',
  PRIMARY KEY (`id_item_entrada`),
  CONSTRAINT `item_pedido_entrada_ibfk_1`
    FOREIGN KEY (`id_pedido_entrada`)
    REFERENCES `pedido_entrada` (`id_pedido_entrada`),
  CONSTRAINT `item_pedido_entrada_ibfk_2`
    FOREIGN KEY (`id_produto`)
    REFERENCES `produto` (`id_produto`),
  CONSTRAINT `item_pedido_entrada_ibfk_3`
    FOREIGN KEY (`id_localizacao`)
    REFERENCES `localizacao` (`id_localizacao`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `pedido_saida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido_saida` (
  `id_pedido_saida` INT NOT NULL AUTO_INCREMENT,
  `numero_documento` VARCHAR(50) NULL DEFAULT NULL,
  `solicitante` VARCHAR(100) NULL DEFAULT NULL,
  `data_saida` DATE NOT NULL,
  `id_usuario` INT NOT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  `status` VARCHAR(30) NULL DEFAULT 'aberto',
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `id_caminhao` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido_saida`),
  CONSTRAINT `fk_pedido_saida_caminhao`
    FOREIGN KEY (`id_caminhao`)
    REFERENCES `caminhao` (`id_caminhao`),
  CONSTRAINT `pedido_saida_ibfk_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `item_pedido_saida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `item_pedido_saida` (
  `id_item_saida` INT NOT NULL AUTO_INCREMENT,
  `id_pedido_saida` INT NOT NULL,
  `id_produto` INT NOT NULL,
  `id_localizacao` INT NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_item_saida`),
  CONSTRAINT `item_pedido_saida_ibfk_1`
    FOREIGN KEY (`id_pedido_saida`)
    REFERENCES `pedido_saida` (`id_pedido_saida`),
  CONSTRAINT `item_pedido_saida_ibfk_2`
    FOREIGN KEY (`id_produto`)
    REFERENCES `produto` (`id_produto`),
  CONSTRAINT `item_pedido_saida_ibfk_3`
    FOREIGN KEY (`id_localizacao`)
    REFERENCES `localizacao` (`id_localizacao`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
