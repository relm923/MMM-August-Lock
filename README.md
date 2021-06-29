# MMM-August-Lock

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/). It pulls data (lock and door status) from [August](https://august.com) Locks connected to the configured account using [august-connect](https://github.com/ryanblock/august-connect).

![Alt text](/screenshots/example.png?raw=true "Screenshot")

## Installation

```sh
# Navigate to MagicMirror's "modules" folder
cd modules

# Clone repo
git clone https://github.com/relm923/MMM-August-Lock.git

# Navigate into new folder
cd MMM-August-Lock

# Install Module Dependencies
npm install
```

## Authorization
:warning: **In order to enable access to your August account you must first authorize the module by running `npm run auth`** :warning:

This only needs to be completed once

```sh
npm run auth

> MMM-August-Lock@2.0.0 auth
> node auth-helper.js

? What type of ID do you use to access your August account? phone
? Enter your August UserId (ex: +12345678901)? +12223334444
? Enter the code August just sent you 123455
Successfully Authorized!
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
          module: "MMM-August-Lock",
          position: "top_right",
          header: "August", // Optional
          config: {
            // See below for configurable options
            augustID: "+XXXXXXXXXX",
            IDType: "phone",
            password: "XXXXXXXX"
          }
        }
    ]
}
```

## Configuration options

| Option               | Description
|--------------------- |-----------
| `august`             | *Required* Email or phone used to access August account
| `IDType`             | *Required* Either `phone` or `email`
| `password`           | *Required* Password used to access August account
| `updateInterval`     | *Optional* How often the content will be fetched. <br><br>**Type:** `int`(milliseconds) <br>Default 60000 (1 minute)
| `animationSpeed`     | *Optional* Speed of the update animation. <br><br>**Type:** `int`(milliseconds) <br>Default 2000 milliseconds (2 seconds)

## Dependencies

- [august-connect](https://github.com/ryanblock/august-connect) (installed via `npm install`)
