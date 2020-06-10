# zarya-http-agent

## Project setup

```
yarn install
```

### Compiles for production

```
yarn build
```

### Run web server

```
yarn start
```

### HTTP API

`http://localhost:3000/api/passport`

POST

response json order

**example curl**

```sh
curl --location --request POST 'http://localhost:3000/api/passport' \
--header 'Content-Type: application/json' \
--data-raw '{"cylinder":{"agent*container":"22","serial_number":"007166","nano_protection":"false","test_date":"22.04.2020","production_date":"22.04.2020","next_date_inspection":"22.04.2025","file":"zarya.one/sdfsdf.jpg"},"valve":{"serial_number":"015648","test_date":"22.04.2020","production_date":"22.04.2020"},"pressure_gauge":{"serial_number":"5402W6IN","date_inspection":"12.03.2020"},"module":{"serial_number":"007166","test_date":"24.04.2020","empty_weight":"10,1","file":"zarya.one/sdfsdf.jpg"},"filling":{"сlean*аgent":"Хладон 227EA","clean_agent_weight":"21,5","filling_date":"22.04.2020","total_weight":"10,1","file":"zarya.one/sdfsdf.jpg"},"URL_manufacture":"123"}'
```

**response**

```json
{
  "order": {
    "model": "QmRdP9Cd5TpqWUnQF64H26ek1mjjfVs2RAXSLnYrx5QVoS",
    "objective": "QmXiM4QtA3BdBvjAsxMtFFxX4frivEQw86ro2iJNnTmAJd",
    "token": "0xF47EDC02f201aE58D8C08ab44F7A8439BaD53d8C",
    "cost": 0,
    "lighthouse": "0x3C845DA435153b2620b158F87d973AFaDD829AB0",
    "validator": "0x0000000000000000000000000000000000000000",
    "validatorFee": 0,
    "deadline": 6631714,
    "sender": "0x47831d52dD6FD12E496795E1CA6E5ba73A9552DC",
    "nonce": 126,
    "signature": "0xf5b6f3690ebfd525e71797d2cd5e5cc29812d504e9711b542ca8c7a2bd6584bc25316dcff7f01936a342bd5d2d7b03cf470336a177db45bf7803cdb573509b061b"
  }
}
```

`http://localhost:3000/api/passport/order/:order`

GET

PARAM :order - order.signature

**example**
`http://localhost:3000/api/passport/order/0xf5b6f3690ebfd525e71797d2cd5e5cc29812d504e9711b542ca8c7a2bd6584bc25316dcff7f01936a342bd5d2d7b03cf470336a177db45bf7803cdb573509b061b`

**response**

```json
{
  "order": {
    "demand": {
      "model": "QmRdP9Cd5TpqWUnQF64H26ek1mjjfVs2RAXSLnYrx5QVoS",
      "objective": "QmXiM4QtA3BdBvjAsxMtFFxX4frivEQw86ro2iJNnTmAJd",
      "token": "0xF47EDC02f201aE58D8C08ab44F7A8439BaD53d8C",
      "cost": 0,
      "lighthouse": "0x3C845DA435153b2620b158F87d973AFaDD829AB0",
      "validator": "0x0000000000000000000000000000000000000000",
      "validatorFee": 0,
      "deadline": 6631714,
      "sender": "0x47831d52dD6FD12E496795E1CA6E5ba73A9552DC",
      "nonce": 126,
      "signature": "0xf5b6f3690ebfd525e71797d2cd5e5cc29812d504e9711b542ca8c7a2bd6584bc25316dcff7f01936a342bd5d2d7b03cf470336a177db45bf7803cdb573509b061b"
    },
    "offer": {
      "model": "QmRdP9Cd5TpqWUnQF64H26ek1mjjfVs2RAXSLnYrx5QVoS",
      "objective": "QmXiM4QtA3BdBvjAsxMtFFxX4frivEQw86ro2iJNnTmAJd",
      "token": "0xF47EDC02f201aE58D8C08ab44F7A8439BaD53d8C",
      "cost": 0,
      "validator": "0x0000000000000000000000000000000000000000",
      "lighthouse": "0x3C845DA435153b2620b158F87d973AFaDD829AB0",
      "lighthouseFee": 0,
      "deadline": 6631714,
      "sender": "0x6dC110D283F577127F433a03C2c25BCb2f84f084",
      "nonce": 88,
      "signature": "0xdaab4d348c0c7b879aead2ef0724e17f3631f648c0f7dd8deb16a3f808371d3c150988e0d8d0faa1aae0e5a928148fdea18f85c93c50ddbc48d32b6cb53e93f51c"
    },
    "report": {
      "liability": "0xDD640c2990a6168883b14605c32866a4A49bEC16",
      "result": "QmWaD5A1gR5fT3dj3iiTwriJpRJxiie6B3YP4B1M8Msk3y",
      "success": true,
      "signature": "0xa2169916bbada3a8a881c66469fbab6d2277bc29a2a6d8e64bf258f4aa55b2b84b17715303c425137e645a41550f99d182ee5c7a04b50d11f34d5d7fd2f078531b"
    },
    "result": "QmWaD5A1gR5fT3dj3iiTwriJpRJxiie6B3YP4B1M8Msk3y",
    "liability": "0xDD640c2990a6168883b14605c32866a4A49bEC16"
  }
}
```
