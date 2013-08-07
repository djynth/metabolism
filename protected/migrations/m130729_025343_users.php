<?php

class m130729_025343_users extends CDbMigration
{
    public function up()
    {
        $this->createTable('user', array(
            'id' => 'int primary key auto_increment',
            'username' => 'string not null unique',
            'password' => 'string not null',
            'created' => 'timestamp not null default current_timestamp'
        ));
    }

    public function down()
    {
        $this->dropTable('user');
    }
}