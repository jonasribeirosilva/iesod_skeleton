<?php namespace Apps\Main\Controllers;

use Iesod\Controller;
use Iesod\View;

class mainController extends Controller{
    public function index(){
        return view::get('default',[]);
    }
}