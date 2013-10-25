<?php

class m130807_171105_remove_ph extends CDbMigration
{
    public function up()
    {
        $this->dropColumn('resources', 'ph');
    }

    public function down()
    {
        $this->addColumn('resources', 'ph', 'float(11,4)');
    }
}