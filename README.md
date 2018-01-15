# skin-loader (Base on Sass !!!)
Dynamically create different skin/theme style with data.

[Kind of Demo](https://codepen.io/xiaoshuang/pen/dJmvPp)

## Installation

```sh
npm install --save-dev skin-loader
```

## Loader Options

### type

* Type: Oneof `['before-sass', 'after-sass']`
* Default: `'before-sass'`
* Required: `true`

before-sass: Add `@mixin skin` to the Scss files.

after-sass: Filter skin css code after Sass-loader, and save in `skin-loader/lib/temp/temp.js`.

### prefix

* Type: `String`
* Default: `'_skin_'`
* Required: `false`

For avoid the conflict of name.

## How To Use

### App.jsx

```jsx
import React, { Component } from 'react';

import temp from 'skin-loader/lib/temp';

temp({
  color: 'red',
  background: 'green',
  array: ['blue', 'purple'],
  obj: {
    attr: 'yellow',
  },
});

class App extends Component {
  render() {...}
}

export default App;
```

### App.scss

```scss
.cus-skin-part {
  padding: 100px;
  font-size: 14px;
  animation: 1s ani infinite;

  @include skin(&, (
    box-shadow: '0 0 5px _skin_background',
    text-shadow: '0 0 5px _skin_array[0]',
  ));

  @include skin(&) {
    color: _skin_color;
    background: _skin_background;
    border-color: 0 0 5px '_skin_array[1]';
  };
}

@keyframes ani {
  0% {
    background: _skin_color;
  }
  20% {
    background: '_skin_array[0]';
  }
  40% {
    background: '_skin_array[1]';
  }
  60% {
    background: '_skin_obj._skin_attr';
  }
  100% {
    background: _skin_background;
  }
}
```

### webpack.config.js

```js
{
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?minimize',
          'resolve-url-loader',
          {
            loader: 'skin-loader',
            options: {
              type: 'after-sass',
            },
          },
          'sass-loader',
          {
            loader: 'skin-loader',
            options: {
              type: 'before-sass',
            },
          },
        ]
      },
    ],
  },
}
```