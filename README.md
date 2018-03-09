# postcss-skin
Dynamically create different skin/theme style with data.

[Kind of Demo](https://codepen.io/xiaoshuang/pen/dJmvPp)

## For Sass
[skin-loader](https://github.com/xiaoshuangLi/skin-loader), base on Sass, Webpack

## Installation

```sh
npm install --save-dev postcss-skin
```

## Plugin Options

### prefix
For avoid the conflict of name.

* Type: `String`
* Default: `'$'`
* Required: `false`

```js
require('postcss-skin')({
  prefix: '$',
})
```

## How To Use

### App.jsx

```jsx
import React, { Component } from 'react';

import temp from 'postcss-skin/lib/temp';

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
  margin: 100px;
  padding: 100px;
  border-radius: 3px;
  color: '$obj.$attr';
  animation: 1s ani infinite;
}

@supports (display: block) {
  @media (max-width: 3000px) {
    .cus-skin-part {
      border: 3px solid '$background';
      text-shadow: 0 5px '$background';
    }
  }
}

@keyframes ani {
  0% {
    background: '$color';
  }
  20% {
    background: '$array[0]';
  }
  60% {
    background: '$array[1]';
  }
  80% {
    background: '$obj.$attr';
  }
  100% {
    background: '$background';
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
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-skin'),
              ],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
}
```