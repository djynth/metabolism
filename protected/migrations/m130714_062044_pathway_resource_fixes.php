<?php

class m130714_062044_pathway_resource_fixes extends CDbMigration
{
    public function up()
    {
        $this->addPrimaryKey('pk_pathway_resources', 'pathway_resources', 'pathway_id,resource_id');
    }

    public function down()
    {
        $this->dropPrimaryKey('pk_pathway_resources', 'pathway_resources');
    }
}