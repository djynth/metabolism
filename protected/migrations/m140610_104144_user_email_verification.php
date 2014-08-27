<?php

class m140610_104144_user_email_verification extends CDbMigration
{
    public function up()
    {
        $this->dropColumn('users', 'email_verified');
        $this->dropColumn('users', 'email_verification');

        $this->createTable('user_email_verification', array(
            'user_id' => 'int(11) not null primary key',
            'verified' => 'int(1) not null default 0',
            'verification' => 'char(16)',
            'attempts' => 'int(11) default 0',
            'created' => 'timestamp default current_timestamp',
        ), 'engine InnoDB');
    }

    public function down()
    {
        $this->addColumn('users', 'email_verified',     'int(1)');
        $this->addColumn('users', 'email_verification', 'varchar(16)');

        $this->dropTable('user_email_verification');
    }
}