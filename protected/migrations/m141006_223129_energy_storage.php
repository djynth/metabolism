<?php

class m141006_223129_energy_storage extends CDbMigration
{
    public function up()
    {
        $this->addColumn('organs', 'storage_resource_id', 'smallint(6)');

        $this->addForeignKey('fk_organs_resources_storage_resource_id', 'organs', 'storage_resource_id', 'resources', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropColumn('organs', 'storage_resource_id');
    }
}