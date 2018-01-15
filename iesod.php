<?php
require "vendor/autoload.php";

use Iesod\Command;

if(!defined('DIR_ROOT'))
  define('DIR_ROOT', getcwd());
try{

  $CMD = new Command($argv,$argc);

  /*
  $desejo = $CMD->read("Qual é seu desejo?",['a','b','c']);
  fwrite(STDOUT, ($desejo??"Nenhum desejo") );
  */

  //Pasta atual
  $CMD->cmd("createController {controller?} {module?}","controller@create");
  $CMD->cmd("createResource {controller?} {module?} {model?}","controller@createResource");
  $CMD->cmd("createModule {module}","module@create");
  $CMD->cmd("config createClient {idClient?}","Config@createEnvClient");
  $CMD->cmd("config updateClient {idClient?}","Config@updateEnvClient");

  $CMD->help();
} catch (\Error $e){
  echo "ERROR ".$e->getCode().": ".$e->getMessage();
} catch (\Exception $e){
  echo "ERROR ".$e->getCode().": ".$e->getMessage();
}
exit;