<?php

class m130710_021359_organs extends CDbMigration
{
    public function up()
    {
        $this->createTable('organs', array(
            'id' => 'smallint primary key auto_increment',
            'name' => 'varchar(20) not null unique'
        ));

        $this->createTable('pathway_organs', array(
            'pathway_id' => 'smallint',
            'organ_id' => 'smallint'
        ));

        $this->addForeignKey('fk_pathway_organs_pathways_pathway_id',   'pathway_organs', 'pathway_id', 'pathways', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_pathway_organs_resources_resource_id', 'pathway_organs', 'organ_id',   'organs',   'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('organs');
        $this->dropTable('pathway_organs');
    }
}