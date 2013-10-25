<?php

class m130802_185743_organ_descriptions extends CDbMigration
{
    public function up()
    {
        $this->addColumn('organs', 'description', 'text');
    }

    public function down()
    {
        $this->dropColumn('organs', 'description');
    }
}