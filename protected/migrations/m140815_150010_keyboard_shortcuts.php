<?php

class m140815_150010_keyboard_shortcuts extends CDbMigration
{
    public function up()
    {
        $this->createTable('keyboard_shortcuts', array(
            'action' => 'varchar(32) unique not null primary key',
            'name' => 'varchar(32) not null',
            'description' => 'text not null',
            'default_key' => 'char(1)',
        ), 'engine InnoDB');

        $this->createTable('user_keyboard_shortcuts', array(
            'user_id' => 'int(11) not null',
            'action' => 'varchar(32) not null',
            'key' => 'char(1) not null',
        ), 'engine InnoDB');

        $this->addForeignKey('fk_user_keyboard_shortcuts_users_user_id',             'user_keyboard_shortcuts', 'user_id', 'users',              'id',     'cascade', 'cascade');
        $this->addForeignKey('fk_user_keyboard_shortcuts_keyboard_shortcuts_action', 'user_keyboard_shortcuts', 'action',  'keyboard_shortcuts', 'action', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('keyboard_shortcuts');
        $this->dropTable('user_keyboard_shortcuts');
    }
}
