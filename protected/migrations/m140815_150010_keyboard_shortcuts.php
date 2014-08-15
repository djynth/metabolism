<?php

class m140815_150010_keyboard_shortcuts extends CDbMigration
{
    public function up()
    {
        $this->createTable('keyboard_shortcuts', array(
            'key' => 'varchar(32)',
            'action' => 'varchar(32)',
        ), 'engine InnoDB');
    }

    public function down()
    {
        $this->dropTable('keyboard_shortcuts');
    }
}
