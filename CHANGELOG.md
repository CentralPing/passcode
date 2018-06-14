#### v0.1.1 (2018-06-14)

##### Chores

* **package:**  include public publishing option for builds ([4c8dd0b1](https://github.com/CentralPing/passcode/commit/4c8dd0b1e5e2568e2b2a7af259efd7c842624087))

#### v0.1.0 (2018-06-14)

##### Chores

* **package:**
  *  namespace package ([fa3d54a6](https://github.com/CentralPing/passcode/commit/fa3d54a62f922e9fecdb801afe3c8dd0f3196f9f))
  *  update scripts for npm publishing ([0c4c72d3](https://github.com/CentralPing/passcode/commit/0c4c72d39eb58e6688d6729de6495773c9e911a1))
  *  rename integration test file pattern ([bbca601e](https://github.com/CentralPing/passcode/commit/bbca601e32dc75cdf45fef1e315c1e2c2c6a80b4))
  *  dependency bumps ([a7cdaff7](https://github.com/CentralPing/passcode/commit/a7cdaff78e8e8529188a3742fae8af84bc91faf7))
  *  update dependencies ([6ede95ea](https://github.com/CentralPing/passcode/commit/6ede95eabf2f6694bd11679f43bd411d19a6a589))
  *  update dependencies ([1985a66e](https://github.com/CentralPing/passcode/commit/1985a66e93ff88143015debf4258c9ffb0a3b071))
* **travis:**
  *  update build to publish on tagged releases ([0e2e2ae3](https://github.com/CentralPing/passcode/commit/0e2e2ae3481963b252a92d990e52de5f9b9da2e1))
  *  add travis integration ([cc674f7f](https://github.com/CentralPing/passcode/commit/cc674f7f55e2a67f6eec7ba4aed0073772d9d958))
* **npm:**  flag dev artifacts from inclusion in published package ([5083c03c](https://github.com/CentralPing/passcode/commit/5083c03c44534c006cfb212b083f6079924b7c20))
* **index:**  import correct module ([74604c15](https://github.com/CentralPing/passcode/commit/74604c153b1c75273a1a138d1dac9bb09348604b))
* **token:**  standardize naming ([9fa27f7f](https://github.com/CentralPing/passcode/commit/9fa27f7f1341381d201d79f7443c26e58ac5a7db))
*  fix script for lint; add coverage publishing ([8b2b107b](https://github.com/CentralPing/passcode/commit/8b2b107b4a6b5a952be4c103148ef7a2b9803d5c))
*  add coverage reporting ([fbdc09ce](https://github.com/CentralPing/passcode/commit/fbdc09cee1a191bce2e4acff6b42c42111c20538))

##### Documentation Changes

* **readme:**
  *  update docs for published npm install ([ec112261](https://github.com/CentralPing/passcode/commit/ec112261175309a04308b66852c25ed02c3146cd))
  *  add example for using a key as the secret ([2acaebfb](https://github.com/CentralPing/passcode/commit/2acaebfbf05eff2be0f42857b5c35feaa8ef8ebc))
  *  update docs for current usage ([a251c4b4](https://github.com/CentralPing/passcode/commit/a251c4b4082b3737783fa0c884b488a7c02891a4))
  *  update docs for current usage ([f917cb6f](https://github.com/CentralPing/passcode/commit/f917cb6f52d3b7f8586072bac14b66942dbd8ca5))
  *  update docs for current usage ([20a8b9d4](https://github.com/CentralPing/passcode/commit/20a8b9d4dd56be832cbd49482fbb6cf650ff3358))
  *  fix module name ([fccb622a](https://github.com/CentralPing/passcode/commit/fccb622acc36113d606f034e898f40368abffedf))
* **main, readme:**  clarify secret can also be a key; clean up description ([fceaf31d](https://github.com/CentralPing/passcode/commit/fceaf31da36225807d757124c339dccaa250dcf9))
* **main:**
  *  make esline compliant ([1d2cb3a3](https://github.com/CentralPing/passcode/commit/1d2cb3a33512f468904ac1299c4415f108ee9923))
  *  define parameters ([2c17ae71](https://github.com/CentralPing/passcode/commit/2c17ae719c431e62e921d7929b82a36080620767))
*  remove incorrect badge ([87b4703e](https://github.com/CentralPing/passcode/commit/87b4703ecd8b3836c002a7459cebdf12291cebc5))

##### New Features

* **main:**
  *  allow secrect to be optional ([c85baa3b](https://github.com/CentralPing/passcode/commit/c85baa3b7b3de2b1b9cd10cbb9e19f9c5fd6585b))
  *  removed superflous key in response object ([f1b6d9ba](https://github.com/CentralPing/passcode/commit/f1b6d9ba356a3c6b973bbf7427b61a177dc5a071))
  *  make code hashing optional ([94eab169](https://github.com/CentralPing/passcode/commit/94eab1691da7c99513044e598c9f2abdb5324ac6))
  *  allow custom codes for verification ([baa25f2c](https://github.com/CentralPing/passcode/commit/baa25f2c7ad1c5f6bdef92ebd08faad62de211ac))
* **token:**
  *  return error/value as object ([aab9fa17](https://github.com/CentralPing/passcode/commit/aab9fa17f470a9f681d0428981e4542fbe862196))
  *  remove config export ([7980ba04](https://github.com/CentralPing/passcode/commit/7980ba049583d7060cdab43a74b69703c6b67e40))
* **lib:**  export directly from token ([08e430dc](https://github.com/CentralPing/passcode/commit/08e430dc244554156f03bb25c2846e071d600c7e))
*  initial commit ([19a50526](https://github.com/CentralPing/passcode/commit/19a50526d6997e9ecaebd7152fcccf6ec283b75c))

##### Other Changes

* **token:**  make salt and secret required params ([e1632e4a](https://github.com/CentralPing/passcode/commit/e1632e4a9d531de29f773bbdfb4a04afbed272d6))

##### Refactors

* **main:**
  *  make passcode payload property a global ([1518f182](https://github.com/CentralPing/passcode/commit/1518f1822d151758feb050dba8eddc133d55ee7f))
  *  clean up parameters ([23959cc4](https://github.com/CentralPing/passcode/commit/23959cc4ac0940e94873ddd83ef75e40e6af0954))
  *  remove code from response object via destructuring ([5ea1e646](https://github.com/CentralPing/passcode/commit/5ea1e64671819d984caaaab6958160cd6f06c35e))

##### Tests

* **main:**
  *  make eslint compliant ([6d8c66e5](https://github.com/CentralPing/passcode/commit/6d8c66e57c38c4e28aea065b08877abb77aff5d9))
  *  make salt, secret and passcode are required ([4e9be154](https://github.com/CentralPing/passcode/commit/4e9be15424b921b4f386fd6566039f8a2cb05e23))
  *  ensure salt, secret and passcode are required ([7147d41f](https://github.com/CentralPing/passcode/commit/7147d41f3ed09d07e48a7bf1c1dc663ad2d08519))
  *  make eslint compliant ([e49bf094](https://github.com/CentralPing/passcode/commit/e49bf09430c0e3247735e550e5d1cb72a1203fcd))
  *  ensure secret is optional ([5f923a17](https://github.com/CentralPing/passcode/commit/5f923a17a2bb7fe92359952e048f88630d1a1256))
  *  ensure code is removed from decoded response ([7d69cd99](https://github.com/CentralPing/passcode/commit/7d69cd999e8300176202cee523484c9ccfc78de6))
  *  ensure code hashing is optional ([17a34e89](https://github.com/CentralPing/passcode/commit/17a34e89bde889a9d8b91f5e2240ddda3ed75f00))
  *  ensure issue times are allowed ([bf3a2246](https://github.com/CentralPing/passcode/commit/bf3a2246e33065be163908e364a48d28d65d9523))
  *  use regex to match error ([c6ea9454](https://github.com/CentralPing/passcode/commit/c6ea9454ac8085366e568caa061824438510cc35))
  *  ensure custom codes are allowed ([f9ad5519](https://github.com/CentralPing/passcode/commit/f9ad5519e7bfbf57c5c21365ab818492b56eb47e))
  *  ensure custom token ID is allowed ([3c012c47](https://github.com/CentralPing/passcode/commit/3c012c47d8c6323c8b7a96856d831b1a5d8b8350))
* **main, filter:**  use object equality for tests ([a79e851d](https://github.com/CentralPing/passcode/commit/a79e851ddc1b7c2a959196a00f027a2a422514b7))
* **index, filter, random-code:**  refactor grouping ([4b200aa6](https://github.com/CentralPing/passcode/commit/4b200aa6ae3239af778ef4d7900ffb5e39372e49))
* **index:**  ensure interface ([a3f0ce31](https://github.com/CentralPing/passcode/commit/a3f0ce3105f2ec8795cf53ec971312ee2e4fe823))
* **token:**
  *  ensure salt and secret are required params ([6c89eeb0](https://github.com/CentralPing/passcode/commit/6c89eeb0e2c312ff392ba1f8c631a6fa6037d53f))
  *  use correct object returned from methods ([cd48facd](https://github.com/CentralPing/passcode/commit/cd48facdb6e678a15c449433dd3fc64b3bef5868))
  *  remove assertions for config export ([1ec8c7df](https://github.com/CentralPing/passcode/commit/1ec8c7df3d19486181077b3842a71f6c5010e162))
  *  hardcode private code key config; remove config ref from functions ([979e4c25](https://github.com/CentralPing/passcode/commit/979e4c25db774e5ac1a5c25c85d3b09e6ecd66a8))
  *  remove assertion for private code key ([7710f212](https://github.com/CentralPing/passcode/commit/7710f212b7245a62594798cc30d11cf30260f28a))
  *  remove console ([e5a4a5fd](https://github.com/CentralPing/passcode/commit/e5a4a5fd8e9b8cc6684df6a5e0945e81bc86bd78))

