export default (prefix = '') => `
$prefix: '${prefix}';

@function str-replace($string, $search, $replace: '') {
  $index: str-index($string, $search);
  
  @if $index {
    @return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace);
  }
  
  @return $string;
}

@function getStr($str) {
  $str: unquote($str);

  @return $str;
}

@function getValue($value) {
  @return $value;
}

@mixin cus($name, $args...) {

  @at-root #{$prefix} #{$name} {
    @for $a from 1 through length($args) {
      $arg: nth($args, $a);
      $type: type-of($arg);

      @if $type == list {
        @for $r from 1 through length($arg) {
          $key: nth($arg, $r);

          #{$key}: getStr($prefix + $key);
        }
      } @else if $type == map {
        @each $key, $value in $arg {
          @if type-of($value) == 'string' {
            #{$key}: getStr($value);
          }
        }
      }
    }
  }
}
`;