CREATE TYPE usuario_tipo_enum AS ENUM ('USUARIO', 'ADMIN', 'MOTORISTA');

CREATE TABLE tipo_usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo INT NOT NULL REFERENCES tipo_usuario(id),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE estado (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    sigla_estado VARCHAR(2) NOT NULL
);

CREATE TABLE cidade (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    estado_id INT NOT NULL REFERENCES estado(id)
);


CREATE TABLE rota (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255),
    tempo_medio INT
);

CREATE TABLE veiculo (
    id SERIAL PRIMARY KEY,
    status_veiculo BOOLEAN,
    capacidade_veiculo INT,
    placa VARCHAR(10),
    numero_veiculo VARCHAR(10),
    rota_id INT REFERENCES rota(id) ON DELETE SET NULL

);

CREATE TABLE ponto (
    id SERIAL PRIMARY KEY,
    localizacao VARCHAR(200),
    descricao VARCHAR(200),
    latitude FLOAT,
    longitude FLOAT,
    cidade_id INT REFERENCES cidade(id) 
);

CREATE TABLE ponto_rota (
    id SERIAL PRIMARY KEY,
    ponto_id INT REFERENCES ponto(id),
    rota_id INT REFERENCES rota(id)
);

CREATE TABLE localizacao_veiculo (
    id SERIAL PRIMARY KEY,
    latitude FLOAT,
    longitude FLOAT,
    data_hora TIMESTAMP DEFAULT NOW(),
    veiculo_id INT REFERENCES veiculo(id) ON DELETE CASCADE
);

CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50),
    mensagem TEXT,
    data_criacao TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20),
    localizacao_id INT REFERENCES localizacao_veiculo(id) ON DELETE CASCADE
);

CREATE TABLE escala (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100),
    turno VARCHAR(50)
);

CREATE TABLE motorista (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE REFERENCES usuario(id),
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE escala_motorista (
    id SERIAL PRIMARY KEY,
    horario_inicio TIMESTAMP,
    horario_fim TIMESTAMP,
    motorista_id INT REFERENCES motorista(id),
    veiculo_id INT REFERENCES veiculo(id) ON DELETE CASCADE,
    escala_id INT REFERENCES escala(id)
);

INSERT INTO tipo_usuario (nome, descricao)
VALUES
('USUARIO', 'Usuário comum'),
('ADMIN', 'Administrador do sistema'),
('MOTORISTA', 'Motorista');

INSERT INTO usuario (nome, email, senha, tipo)
VALUES
('Mateus', 'mah55@gmail.com', '1234', 1),
('Ellen', 'ellen23@gmail.com', '1234', 2),
('Marcos', 'aurelio3@gmail.com', '1234', 3);

INSERT INTO estado (nome, sigla_estado)
VALUES
('São Paulo', 'SP');


INSERT INTO cidade (nome, cep, estado_id)
VALUES
('Santa Fé do Sul', '15775-000', 1),
('Três Fronteiras', '15770-000', 1),
('Rubinéia', '15790-000', 1);




INSERT INTO ponto
(localizacao, descricao, latitude, longitude, cidade_id)
VALUES


(
    'Centro - Santa Fé do Sul',
    'Terminal Central de Santa Fé do Sul',
    -20.208500,
    -50.925500,
    1
),

(
    'Avenida Navarro de Andrade',
    'Parada Avenida Navarro de Andrade',
    -20.209800,
    -50.927000,
    1
),

(
    'Região da Praça Central',
    'Parada Praça Central',
    -20.210500,
    -50.926200,
    1
),

(
    'Bairro Jardim Europa',
    'Parada Jardim Europa',
    -20.202500,
    -50.919500,
    1
),

(
    'Bairro Beira Rio',
    'Parada Beira Rio',
    -20.215500,
    -50.918000,
    1
),

(
    'Região da Estação',
    'Parada Estação',
    -20.205000,
    -50.932000,
    1
),

(
    'Bairro Vila Mariana',
    'Parada Vila Mariana',
    -20.218000,
    -50.929000,
    1
),

(
    'Centro - Três Fronteiras',
    'Terminal Central de Três Fronteiras',
    -20.235000,
    -50.890000,
    2
),

(
    'Praça Central',
    'Parada Praça Central de Três Fronteiras',
    -20.236000,
    -50.889000,
    2
),

(
    'Bairro Residencial',
    'Parada Bairro Residencial',
    -20.229500,
    -50.884500,
    2
),

(
    'Avenida Principal',
    'Parada Avenida Principal',
    -20.232000,
    -50.895000,
    2
),



(
    'Centro - Rubinéia',
    'Terminal Central de Rubinéia',
    -20.175000,
    -51.000000,
    3
),

(
    'Praça Central',
    'Parada Praça Central de Rubinéia',
    -20.174000,
    -51.001000,
    3
),

(
    'Bairro Residencial',
    'Parada Bairro Residencial Rubinéia',
    -20.169000,
    -50.994000,
    3
),

(
    'Região da Entrada da Cidade',
    'Parada Entrada de Rubinéia',
    -20.180000,
    -51.005000,
    3
);

INSERT INTO rota (descricao, tempo_medio)
VALUES
('Santa Fé do Sul - Três Fronteiras', 30),
('Santa Fé do Sul - Rubinéia', 40),
('Circuito Urbano Santa Fé do Sul', 25),
('Três Fronteiras - Rubinéia', 35),
('Circuito Urbano Santa Fé do Sul - Alternativo', 30),
('Santa Fé do Sul - Área Rural', 50);

INSERT INTO veiculo
(status_veiculo, capacidade_veiculo, placa, numero_veiculo, rota_id)
VALUES
(TRUE, 45, 'FIC1A01', 'SFS-001', 1),
(TRUE, 45, 'FIC2B02', 'SFS-002', 2),
(TRUE, 40, 'FIC3C03', 'SFS-003', 3),
(TRUE, 50, 'FIC4D04', 'SFS-004', 4),
(TRUE, 45, 'FIC5E05', 'SFS-005', 5),
(FALSE, 40, 'FIC6F06', 'SFS-006', 6);



INSERT INTO ponto_rota (ponto_id, rota_id)
VALUES

-- Rota 1
-- Santa Fé do Sul -> Três Fronteiras
(1, 1),
(2, 1),
(8, 1),
(9, 1),

-- Rota 2
-- Santa Fé do Sul -> Rubinéia
(1, 2),
(5, 2),
(12, 2),
(13, 2),

-- Rota 3
-- Circuito urbano Santa Fé do Sul
(1, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),

-- Rota 4
-- Três Fronteiras -> Rubinéia
(8, 4),
(10, 4),
(12, 4),
(14, 4),

-- Rota 5
-- Circuito urbano Santa Fé do Sul
(1, 5),
(2, 4),
(4, 5),
(6, 5),
(7, 5),

-- Rota 6
-- Santa Fé do Sul -> Área rural
(1, 6),
(5, 6),
(6, 6);




INSERT INTO escala (descricao, turno)
VALUES
('5x3', 'MANHÃ'),
('5x2', 'TARDE'),
('4x3', 'NOITE'),
('6x1', 'INTEGRAL');
