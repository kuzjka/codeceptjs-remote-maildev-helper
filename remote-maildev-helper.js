const got = require('got');
const chai = require('chai');
const assert = chai.assert;

/**
 * CodeceptJS helper for remote maildev instance. Adds action to check virtual email boxes.
 */
class RemoteMaildevHelper extends Helper {

    constructor(config) {
        super(config);
        this.host = config.host || 'localhost';
        this.port = config.port || 8080;
    }

    async _after() {
        try {
            await got.post(this._makeUrl('reset'));
        } catch (error) {
            assert.fail('Couldn\'t reset remole maildev on ' + this.host + ':' + this.port);
        }
    }

    /**
     * Creates virtual mailbox with given address.
     * @param address   Email address
     */
    async haveMailbox(address) {
        try {
            await got.post(this._makeUrl('haveMailbox'), { json: { address: address }});
        } catch (error) {
            assert.fail('Couldn\'t send command to remote maildev on ' + this.host + ':' + this.port);
        }
    }

    /**
     * Grabs next unread email or fails if there are no unread emails.
     * @return Promise with next unread email object (see maildev API).
     */
    grabNextUnreadMail() {
        return got(this._makeUrl('grabNextUnreadEmail')).json().then(response => {
            assert.isNotTrue(response.empty, 'There are no unread emails');
            return response.email;
        }, () => {
            reject('Couldn\'t get emails from remote maildev on ' + this.host + ':' + this.port);
        });
    }

    _makeUrl(api) {
        return 'http://' + this.host + ":" + this.port + "/" + api;
    }
}

module.exports = RemoteMaildevHelper;
