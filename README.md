# Config.js

To use this repository, you need to create a config.js inside api folder.

```javascript
module.exports = {
    api_base_v1: '/api/v1',
    jwtParameters: {
        clientSecret: 'YOUR CLIENT SECRET PASSWORD',
        expiresIn: '2h'
    },
    tvShowsMySQLInfo: {
        host: 'HOST',
        user: 'USER',
        password: 'MYSQL PASSWORD',
        database: 'DATABASE NAME',
        connectionLimit: 100,
        debug: false
    }
} 
```

# Install

```bash
$ npm install
```

# Execution

```bash
$ npm start
```
