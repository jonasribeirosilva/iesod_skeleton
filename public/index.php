<?php 
error_reporting(E_ALL);

try {
    require __DIR__.'/../bootstrap/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
} catch (\Exception $e) {
    header("Content-type: text/html;charset=utf-8");
    
    $filename = __DIR__."/../resources/errors/default.html";
    $core = new \Dwoo\Core();
    echo $core->get($filename, ['code' => $e->getCode(),'message' => $e->getMessage(),'trace' => $e->getTrace() ]);
    exit;
}
?>