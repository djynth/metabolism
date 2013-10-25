<?php

class m130811_005638_recover_password extends CDbMigration
{
    public function up()
    {
        $this->createTable('recover_password', array(
            'user_id' => 'int',
            'verification' => 'char(16)',
            'attempts' => 'int default 0',
        ), 'ENGINE InnoDB');

        $this->addForeignKey('fk_recover_password_user_user_id', 'recover_password', 'user_id', 'user', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('recover_password');
    }
}