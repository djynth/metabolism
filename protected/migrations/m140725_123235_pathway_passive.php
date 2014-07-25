<?php

class m140725_123235_pathway_passive extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('pathways', 'passive', 'int(1) not null default 0');
    }

    public function down()
    {
        $this->alterColumn('pathways', 'passive', 'int(11) not null default 0');
    }
}