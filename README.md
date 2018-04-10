# karmia-utility
Karmia utility suites

## Usage
```JavaScript
const karmia_utility = require('karmia-utility'),
    utility = new karmia_utility();
```


## array

### array

#### unique
- list ```<Array>```

Removes duplicate values from an array


#### count
- list ```<Array>```
- item ```<*>```

Count item in list


#### range
- start ```<number>```
- stop ```<number>```
- step ```<number>``` Default: 1

Get array of integer from start to end


#### flip
- list ```<Array>```


#### intersection
- list1 ```<Array>```
- list2 ```<Array>```

Get intersection of two arrays

```javascript
const list1 = ['a', 'b', 'b', 'c', 'c', 'c'],
    list2 = ['a', 'b'];

console.log(karray.difference(list1, list2));
// => ['a', 'b']
```


#### difference
- list1 ```<Array>```
- list2 ```<Array>```

Get difference of two arrays

```javascript
const list1 = ['a', 'b', 'b', 'c', 'c', 'c'],
    list2 = ['a', 'b'];

console.log(karray.difference(list1, list2));
// => ['c', 'c', 'c']
```


## crypto

### hash

#### hash(algorithm, buffer, encoding)
- algorithm ```<string>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.hash('md5', Buffer.from('text'), 'binary');
```

#### sha1(buffer, encoding)
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.sha1(Buffer.from('text'), 'binary');
```

#### sha256(buffer, encoding)
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.sha256(Buffer.from('text'), 'binary');
```

#### sha512(buffer, encoding)
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.sha512(Buffer.from('text'), 'binary');
```

### stretching(algorithm, buffer, count, encoding)
- algorithm ```<string>```
- buffer ```<Buffer>```
- count ```<Number>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.stretching('sha256', Buffer.from('text'), 10000, 'binary');
```

### hmac

#### hmac(algorithm, secret, buffer, encoding)
- algorithm ```<string>```
- password ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.hmac('md5', 'secret', Buffer.from('text'), 'binary');
```

#### hmac_sha1(secret, buffer, encoding)
- password ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.hmac_sha1('secret', Buffer.from('text'), 'binary');
```

#### hmac_sha256(secret, buffer, encoding)
- password ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.hmac_sha256('secret', Buffer.from('text'), 'binary');
```

#### hmac_sha512(secret, buffer, encoding)
- password ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
utility.crypto.hmac_sha512('secret', Buffer.from('text'), 'binary');
```


### encrypt

#### iv()
```JavaScript
const iv = utility.crypto.iv();
```

#### encrypt(algorithm, password, buffer, encoding)
- algorithm ```<string>```
- password ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
const password = Buffer.from('password'),
      data = Buffer.from('text');
utility.crypto.encrypt('aes-256-ctr', password, data, 'binary');
```

#### decrypt(algorithm, password, data, encoding)
- algorithm ```<string>```
- password ```<Buffer>```
- data ```<Object>``` {data: encrypted}
- encoding ```<string>``` Output encoding

```JavaScript
const password = Buffer.from('password'),
      data = {data: 'encrypted'};
utility.crypto.decrypt('aes-256-ctr', password, data, 'binary');
```

#### encryptiv(algorythm, password, iv, data, encoding)
- algorithm ```<string>```
- password ```<Buffer>```
- iv ```<Buffer>```
- buffer ```<Buffer>```
- encoding ```<string>``` Input encoding

```JavaScript
const password = Buffer.from('password'),
      iv = Buffer.from('iv'),
      buffer = Buffer.from('text');
utility.crypto.encryptiv('aes-256-gcm', password, iv, data, 'binary');
```

#### decryptiv(algorithm, password, iv, data, encoding, tag_encoding)
- algorithm ```<string>```
- password ```<Buffer>```
- iv ```<Buffer>```
- data ```<Object>``` {data: encrypted} or {data: encrypted, tag: auth_tag}
- encoding ```<string>``` Output encoding
- tag_encoding ```<string>``` Auth tag input encoding

```JavaScript
const password = Buffer.from('password'),
    iv = Buffer.from('iv'),
    data = {
        data: 'encrypted',
        tag: 'auth_tag'
    };
utility.crypto.decryptiv(algorithm, password, iv, data, 'binary', 'binary');
```

## date

### date

#### getDate()
```JavaScript
utility.date.getDate();
```

#### getTime()
```JavaScript
utility.date.getTime();
```

#### getYMD()
```JavaScript
utility.date.getYMD();
```

#### format(format, date)
```JavaScript
// Current time
utility.date.format('Y-m-d H:i:s');

// Specific time
utility.date.format('Y-m-d H:i:s', new Date('1999-08-03 00:00:00'));
```

| format | description                                                             | example                                  |
|:-------|:------------------------------------------------------------------------|:-----------------------------------------|
| d      | Day of the month, 2 digits with leading zeros                           | 01-31                                    |
| D      | A textual representation of a day, three letters                        | Mon through Sun                          |
| j      | Day of the month without leading zeros                                  | 1 to 31                                  |
| l      | A full textual representation of the day of the week                    | Sunday through Saturday                  |
| N      | ISO-8601 numeric representation of the day of the week                  | 1 (for Monday) through 7 (for Sunday)    |
| S      | English ordinal suffix for the day of the month, 2 characters           | st, nd, rd or th. Works well with j      |
| w      | Numeric representation of the day of the week                           | 0 (for Sunday) through 6 (for Saturday)  |
| z      | The day of the year (starting from 0)                                   | 0 through 365                            |
| W      | ISO-8601 week number of year, weeks starting on Monday                  | Example: 42 (the 42nd week in the year)  |
| F      | A full textual representation of a month, such as January or March      | January through December                 |
| m      | Numeric representation of a month, with leading zeros                   | 01 through 12                            |
| M      | A short textual representation of a month, three letters                | Jan through Dec                          |
| n      | Numeric representation of a month, without leading zeros                | 1 through 12                             |
| t      | Number of days in the given month                                       | 28 through 31                            |
| L      | Whether it's a leap year                                                | 1 if it is a leap year, 0 otherwise.     |
| o      | ISO-8601 year number.                                                   | Examples: 1999 or 2003                   |
| Y      | A full numeric representation of a year, 4 digits                       | Examples: 1999 or 2003                   |
| y      | A two digit representation of a year                                    | Examples: 99 or 03                       |
| a      | Lowercase Ante meridiem and Post meridiem                               | am or pm                                 |
| A      | Uppercase Ante meridiem and Post meridiem                               | AM or PM                                 |
| B      | Swatch Internet time                                                    | 000 through 999                          |
| g      | 12-hour format of an hour without leading zeros                         | 1 through 12                             |
| G      | 24-hour format of an hour without leading zeros                         | 0 through 23                             |
| h      | 12-hour format of an hour with leading zeros                            | 01 through 12                            |
| H      | 24-hour format of an hour with leading zeros                            | 00 through 23                            |
| i      | Minutes with leading zeros                                              | 00 to 59                                 |
| s      | Seconds, with leading zeros                                             | 00 through 59                            |
| u      | Microseconds                                                            | Example: 654000                          |
| O      | Difference to Greenwich time (GMT) in hours                             | Example: +0200                           |
| P      | Difference to Greenwich time (GMT) with colon between hours and minutes | Example: +02:00                          |
| T      | Timezone abbreviation                                                   | Examples: EST, MDT ...                   |
| Z      | Timezone offset in seconds                                              | -43200 through 50400                     |
| c      | ISO 8601 date                                                           | 2004-02-12T15:19:21+00:00                |
| r      | RFC 2822 formatted date                                                 | Example: Thu, 21 Dec 2000 16:01:07 +0200 |
| U      | Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)              |                                          |


## random

### random

#### string(length, options)
- length ```<number>```
- options ```<Object>```

```JavaScript
// Includes all characters
utility.string.random(16);

// Excludes special characters
utility.string.random(16, {special: false});

// Excludes number
utility.string.random(16, {number: false});

// Exclude upper and special characters
utility.string.random(16, {upper: false, special: false});

// Exclude lower and special characters
utility.string.random(16, {lower: false, special: false});
```

#### integer(max, min)
- max ```<number>``` Default: Number.MAX_SAFE_INTEGER
- min ```<number>``` Default: 0

```JavaScript
utility.random.integer(); // 0〜Number.MAX_SAFE_INTEGER
```

## string

### string

#### strip
- string ```<string>```
- mask_character ```<string>``` Default: " \t\n\r\0\x0B"

```JavaScript
// Strip whitespaces
const string = '    Hello, world.    ';
utility.string.strip(string);

// Strip specified characters
const string = '"Hello, world."';
utility.string.strip(string, '"');
```

#### lstrip
- string ```<string>```
- mask_character ```<string>``` Default: " \t\n\r\0\x0B"

```JavaScript
// Strip whitespaces
const string = '    Hello, world.';
utility.string.lstrip(string);

// Strip specified characters
const string = '"Hello, world.';
utility.string.lstrip(string, '"');
```

#### rstrip
- string ```<string>```
- mask_character ```<string>``` Default: " \t\n\r\0\x0B"

```JavaScript
// Strip whitespaces
const string = 'Hello, world.    ';
utility.string.rstrip(string);

// Strip specified characters
const string = 'Hello, world."';
utility.string.rstrip(string, '"');
```

#### normalize
- string ```<string>```
- form ```<string>``` Default: "NFKC"

```JavaScript
const string = '\u202b１２３\r\nＡＢＣ\rｄｅｆ\nｱｲｳｴｵｶﾞ';
utility.string.normalize(string); // Return: '123\nABC\ndef\nアイウエオガ'
```

#### unquote
- string  ```<string>```

```JavaScript
const string = '"Hello, world."';
utility.string.unquote(string);
```

#### parse
- string ```<string>```
- delimiter ```<string/regexp>``` Default: /,? /
- separator ```<string/regexp>``` Default: =

```JavaScript
const string = 'key1=value1, key2=value2';
utility.string.parse(string, /,? /, '=');
```

#### toBoolean
- string ```<string>```

```JavaScript
// Should be true
utility.string.toBoolean('true');
utility.string.toBoolean('True');
utility.string.toBoolean('TRUE');
utility.string.toBoolean('0');
utility.string.toBoolean(1);
utility.string.toBoolean(true);
utility.string.toBoolean('false_1');

// Should be false
utility.string.toBoolean('false');
utility.string.toBoolean('False');
utility.string.toBoolean('FALSE');
utility.string.toBoolean('');
utility.string.toBoolean(0);
utility.string.toBoolean(false);
```
