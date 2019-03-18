<?php

list($uri) = explode("?", $_SERVER['REQUEST_URI']);
preg_match("/^[\/]{0,1}([^\/]+).*/",strtolower( $uri ), $mUri );
$module = $mUri[1]?? null;
\Iesod\Command::$dir = realpath(__DIR__."/../")."/";
if(!empty($module) && \Iesod\Command\Module::isExist($module) ){
  \Iesod\Router::$prefix = "/".$module;
  $module = \Iesod\Command::nameTransform($module);
} else {
  $module = "Main";
}

$app = new \Iesod\Application($module);

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernels serve the
| incoming requests to this application from both the web and CLI.
|
*/
return $app;
