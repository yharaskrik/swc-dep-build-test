import {lib2} from "@swc-dep-build-test/lib2";

export function lib1(): string {
  lib2()
  return 'lib1';
}
