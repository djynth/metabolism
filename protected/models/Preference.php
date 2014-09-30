<?php

/**
 * @db id           int(11)     a unique preference ID
 * @db name         varchar(80) the user-readable name of this preference
 * @db description  text        an optional user-readable description of this
 *                              preference
 * @db default      int(11)     the ID of the default setting
 * @fk default_pref PreferenceOption
 * $fk options      array(PreferenceOption)
 */
class Preference extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'preferences';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'default_pref' => array(
                self::HAS_ONE,
                'PreferenceOption',
                array('default' => 'option_id'),
            ),
            'options' => array(
                self::HAS_MANY,
                'PreferenceOption',
                array('preference_id' => 'id'),
            ),
        );
    }

    public static function getPreferences($user=-1)
    {
        if ($user === -1) {
            $user = User::getCurrentUser();
        }

        $preferences = array();
        $cookies = Yii::app()->request->cookies;
        foreach (self::model()->findAll() as $preference) {
            $current = $preference->default;
            if ($user === null) {
                $cookie_name = UserController::getPreferenceCookieName($preference->id);
                if ($cookies->contains($cookie_name)) {
                    $current = $cookies[$cookie_name]->value;
                }
            } else {
                foreach ($user->preferences as $user_preference) {
                    if ($user_preference->id === $preference->id) {
                        $current = $user_preference->option_id;
                        break;
                    }
                }
            }
            $preferences[$preference->id] = $current;
        }
        return $preferences;
    }
}