<?php

/**
 * @db id                 int(11)      a unique user ID
 * @db username           varchar(255) this user's chosen name
 * @db password           varchar(255) this user's chosen password (hashed)
 * @db created            timestamp    the time of the account's creation
 * @db theme              varchar(8)   this user's chosen theme
 * @db email              varchar(80)  the email address associated with this
 *                                     user
 * @db email_verified     tinyint(1)   whether the user has verified the email
 *                                     address
 * @db email_verification varchar(16)  the email verification code
 * @db help               tinyint(1)   whether the user has chosen to display
 *                                     help tooltips
 */
class User extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'users';
    }

    public function primaryKey()
    {
        return 'id';
    }

    /**
     * Determines whether the given password is authentic.
     * Note that this function does not add any sort of time delay; it
     *  immediately returns the result of attempting to decrypt the user's
     *  hashed password.
     *
     * @return true if the given password is the correct hash key for the
     *         password hash stored for this user
     */
    public function authenticate($password)
    {
        return $this->password === crypt($password, $this->password);
    }

    /**
     * Gets the domain (everything that follows the first "@") in the user's
     *  email address.
     *
     * @return the domain of the user's email address
     */
    public function getEmailDomain()
    {
        $split = split('@', $this->email);
        return $split[1];
    }

    /**
     * Gets the current User.
     * Note that this function is not memoized, and so repeated calls to it may
     *  result in multiple database queries.
     *
     * @return the User who is currently playing, or null if the user is not
     *         logged in
     */
    public static function getCurrentUser()
    {
        if (Yii::app()->user->isGuest) {
            return null;
        }

        return self::findByUsername(Yii::app()->user->id);
    }

    /**
     * Determines whether a User with the given username already exists.
     *
     * @param username string the username to test
     * @return true if the given username has been taken, false otherwise
     */
    public static function isUsernameTaken($username)
    {
        return self::model()->findByAttributes(array('username' => $username)) 
               !== null;
    }

    /**
     * Determines whether a User with the given email address already exists.
     *
     * @param email string the email address to test
     * @return true if the given email address has been taken, false otherwise
     */
    public static function isEmailTaken($email)
    {
        return self::model()->findByAttributes(array('email' => $email))
               !== null;
    }
}