export default (prefix = '') => `
$skinPrefix: '${prefix}';

@function skinGetStr($str) {
  $str: unquote($str);

  @return $str;
}

@mixin skin($name, $args...) {
  @at-root #{$skinPrefix} #{$name} {
    @content;

    @for $a from 1 through length($args) {
      $arg: nth($args, $a);
      $type: type-of($arg);

      @if $type == list {
        @for $r from 1 through length($arg) {
          $key: nth($arg, $r);

          #{$key}: skinGetStr($skinPrefix + $key);
        }
      } @else if $type == map {
        @each $key, $value in $arg {
          @if type-of($value) == 'string' {
            #{$key}: skinGetStr($value);
          }
        }
      }
    }
  }
}
`;