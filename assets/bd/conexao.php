<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'bd_gffa';
$username = 'root';
$password = '';


try {
    // Conecta ao banco de dados
    $conexaoBanco = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Exibe erro caso a conexão falhe
    echo "Falha na conexão com o banco de dados: " . $e->getMessage();
    exit();
}
?>
