<?php

class m131215_213621_users extends CDbMigration
{
    public function up()
    {
        $this->renameTable('user', 'users');
    }

    public function down()
    {
        $this->renameTable('users', 'user');
    }
}