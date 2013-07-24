<?php

class m130710_014626_pathways extends CDbMigration
{
    public function up()
    {
        $this->createTable('pathways', array(
            'id' => 'smallint primary key auto_increment',
            'name' => 'string not null unique',
            'points' => 'smallint',
            'limit' => 'bool',
            'color' => 'char(6)',
            'catabolic' => 'bool'
        ));
    }

    public function down()
    {
        $this->dropTable('pathways');
    }
}