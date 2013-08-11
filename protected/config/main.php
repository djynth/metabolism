<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'name'=>'Metabolism Fun',

    // preloading 'log' component
    'preload'=>array('log'),

    // autoloading model and component classes
    'import'=>array(
        'application.models.*',
        'application.components.*',
        'ext.yii-mail.YiiMailMessage',
    ),

    'modules'=>array(
        // uncomment the following to enable the Gii tool
        /*
        'gii'=>array(
            'class'=>'system.gii.GiiModule',
            'password'=>'Enter Your Password Here',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters'=>array('127.0.0.1','::1'),
        ),
        */
    ),

    // application components
    'components'=>array(
        'user'=>array(
            'allowAutoLogin'=>true,     // enable cookie-based authentication
        ),
        'urlManager'=>array(
            'urlFormat'=>'path',
            'rules'=>array(
                '<controller:\w+>/<id:\d+>'=>'<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
                '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
            ),
        ),
        'db'=>array(
            'connectionString' => 'mysql:host=localhost;dbname=metabolism',
            'emulatePrepare' => true,
            'username' => 'root',
            'password' => 'domin8or1304',
            'charset' => 'utf8',
        ),
        'errorHandler'=>array(
            'errorAction'=>'site/error',
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'class'=>'CFileLogRoute',
                    'levels'=>'error, warning',
                ),
            ),
        ),
        'mail' => array(
            'class' => 'ext.yii-mail.YiiMail',
            'transportType'=>'smtp',
            'transportOptions'=>array(
                    'host'=>'smtp.gmail.com',
                    'username'=>'metabolismfun@gmail.com',
                    'password'=>'\vU5EM}hhUq7wop[zbUBkj0Y|',
                    'port'=>'465',
                    'encryption'=>'tls',
            ),
            'viewPath' => 'application.views.mail',
            'logging'=>true,
            'dryRun'=>false,
        ),
    ),

    // application-level parameters that can be accessed using Yii::app()->params['paramName']
    'params'=>array(
        'email' => 'metabolismfun@gmail.com',
        //'url' => 'http://www.metabolismfun.com/',
        'url' => 'localhost/'
    ),
);