# codeceptjs-remote-maildev-helper
[CodeceptJS](https://codecept.io) helper for simplest email check using remote maildev server

## Installation

```shell script
npm install --save-dev condeceptjs-remote-maildev-helper
```

## Running remote server

On the target remote host clone [codeceptjs-remote-maildev](https://github.com/kuzjka/codeceptjs-remote-maildev), install dependencies with npm and start. NodeJS should be installed.
```shell script
git pull https://github.com/kuzjka/codeceptjs-remote-maildev.git
cd codeceptjs-remote-maildev
npm install
npm run serve
```  

Alternatively, you can use [Docker image](https://hub.docker.com/r/kuzjka/codeceptjs-remote-maildev) 
```shell script
docker run --name remote-maildev -d kuzjka/codeceptjs-remote-maildev
```

By default, SMTP listens on port 25 and REST API is exposed on 8080.
You can override it with `SMTP_PORT` and `WEB_PORT` environment variables. 

## CodeceptJS configuration


In codecept.conf.json:
```json
{
  //...
  "helpers": {
    //...
    "RemoteMaildevHelper": {
      "require": "./node_modules/codeceptjs-remote-maildev-helper",
      "host": "123.124.125.126",
      "port": "8080"    
    }
  }
}
```

Default value for `host` is `localhost`, and for `port` is `8080`. 

You may run
```shellscript
npx codeceptjs def .
```
to generate typescript definitions for all installed helpers - this adds code autocompletion to IDEs, which support TypeScript.

## Usage

Configure your application to use remote Maildev server (see [Maildev docs](https://github.com/djfarrelly/MailDev/blob/master/README.md#configure-your-project)).

In your CodeceptJS scenario use `I.haveMailbox(address)` to initialize mailbox and `I.grabNextUnreadMail()` to get email object.

For example:

```js
Scenario('test email sending' async (I) => {
  I.haveMailbox('john.doe@example.com');

  I.amOnPage('/sendMeEmail');
  I.fillField('email', 'john.doe@example.com');
  I.click('Send Me Email!');

  const email = await I.grabNextUnreadMail();

  I.say('I have email: ' + email.subject);
});
```

`I.grabNextUnreadMail()` returns `Promise` like all CodeceptJS grabber methods. It resolves to email object, which is used by Maildev and seems to conform [Mailparser](https://nodemailer.com/extras/mailparser/) specification.

You may register more recipient addresses by adding more `I.haveMailbox()` calls.

## License

[MIT](LICENSE) 
