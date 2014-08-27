<?php

class m140610_104805_user_reset_password extends CDbMigration
{
    public function up()
    {
        $this->dropTable('recover_password');

        $this->createTable('user_reset_password', array(
            'user_id' => 'int(11) not null primary key',
            'verification' => 'char(16)',
            'attempts' => 'int(11) default 0',
            'created' => 'timestamp default current_timestamp',
        ), 'engine InnoDB');
    }

    public function down()
    {
        $this->createTable('recover_password', array(
            'user_id' => 'int(11) not null',
            'verification' => 'char(16) not null',
            'attempts' => 'int(11) not null default 0',
        ), 'engine InnoDB');

        $this->dropTable('user_reset_password');
    }
}