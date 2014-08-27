<?php

class m140817_052529_keyboard_shortcuts_keys extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('keyboard_shortcuts',      'default_key', 'int(8)');
        $this->alterColumn('user_keyboard_shortcuts', 'key',         'int(8) null');
    }

    public function down()
    {
        $this->alterColumn('keyboard_shortcuts',      'default_key', 'char(1)');
        $this->alterColumn('user_keyboard_shortcuts', 'key',         'char(1) null');
    }
}