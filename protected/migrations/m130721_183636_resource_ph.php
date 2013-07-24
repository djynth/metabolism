<?php

class m130721_183636_resource_ph extends CDbMigration
{
    public function up()
    {
        $this->addColumn('resources', 'ph', 'float(11, 4)');
    }

    public function down()
    {
        $this->dropColumn('resources', 'ph');
    }
}